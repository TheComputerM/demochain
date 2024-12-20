import { makeEventListener } from "@solid-primitives/event-listener";
import { decode, encode } from "cbor2";
import {
	type ParentComponent,
	createContext,
	onMount,
	useContext,
} from "solid-js";
import { getOccupants } from "trystero/firebase";
import { Blockchain } from "~/lib/blockchain/chain";
import type { Transaction } from "~/lib/blockchain/transaction";
import { logger } from "~/lib/logger";
import { NetworkEvent, TrysteroConfig, useRoom } from "~/lib/room-context";
import type { Block } from "./blockchain/block";
import { Wallet } from "./blockchain/wallet";
import { useWallet } from "./wallet-context";

const BlockchainContext = createContext<Blockchain>();

export const BlockchainProvider: ParentComponent = (props) => {
	const room = useRoom();
	const wallet = useWallet();
	const blockchain = new Blockchain({
		wallets: {},
		blocks: [],
		settings: {
			difficulty: 1,
		},
		mempool: [],
	});

	const [sendWallet, recieveWallet] = room.makeAction<Uint8Array>(
		NetworkEvent.WALLET,
	);

	recieveWallet(async (payload, peerId) => {
		const publicKey = decode<Uint8Array>(payload);
		const wallet = await Wallet.fromPublickey(publicKey);
		blockchain.setStore("wallets", peerId, wallet);
	});

	onMount(async () => {
		if (
			(await getOccupants(TrysteroConfig, sessionStorage.getItem("network")!))
				.length === 0
		) {
			blockchain.createGenesisBlock(wallet.raw.public);
		}

		makeEventListener<{ "peer-join": CustomEvent<string> }>(
			window,
			"peer-join",
			(event) => {
				// send our wallet to the new peer
				sendWallet(encode(wallet.raw.public), event.detail);
			},
		);

		makeEventListener<{ "peer-leave": CustomEvent<string> }>(
			window,
			"peer-leave",
			(event) => {
				// remove peer from blockchain
				blockchain.setStore("wallets", event.detail, null!);
			},
		);
	});

	const recieveTransaction = room.makeAction<Uint8Array>(
		NetworkEvent.TRANSACTION,
	)[1];

	recieveTransaction(async (data, peerId) => {
		const [payload, signature] = decode<[Uint8Array, Uint8Array]>(data);
		const senderWallet = blockchain.store.wallets[peerId];
		const valid = senderWallet.verify(payload, signature);
		if (!valid) {
			logger.error("Invalid transaction signature");
			return;
		}
		logger.info(`Received transaction from ${peerId}`);
		blockchain.addTransaction(decode<Transaction>(payload));
	});

	const recieveBlock = room.makeAction<Uint8Array>(NetworkEvent.BLOCK)[1];
	recieveBlock((data) => {
		const block = decode<Block>(data);
		logger.info(`Received block ${block.hash}`);
		blockchain.appendBlock(block);
	});

	return (
		<BlockchainContext.Provider value={blockchain}>
			{props.children}
		</BlockchainContext.Provider>
	);
};

export function useBlockchain() {
	const blockchain = useContext(BlockchainContext);
	if (!blockchain) {
		throw new Error("BlockchainContext not found");
	}
	return blockchain;
}
