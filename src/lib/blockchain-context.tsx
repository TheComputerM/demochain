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
import { useWallet } from "./wallet-context";

const BlockchainContext = createContext<Blockchain>();

export const BlockchainProvider: ParentComponent = (props) => {
	const room = useRoom();
	const wallet = useWallet();
	const blockchain = new Blockchain({
		peers: {},
		blocks: [],
		settings: {
			difficulty: 1,
		},
		mempool: [],
	});

	const [sendWallet, recieveWallet] = room.makeAction<Uint8Array>(
		NetworkEvent.WALLET,
	);

	recieveWallet((payload, peerId) => {
		const publicKey = decode<Uint8Array>(payload);
		blockchain.setStore("peers", peerId, publicKey);
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
				blockchain.setStore("peers", event.detail, undefined!);
			},
		);
	});

	const recieveTransaction = room.makeAction<Uint8Array>(
		NetworkEvent.TRANSACTION,
	)[1];
	recieveTransaction((data) => {
		const transaction = decode<Transaction>(data);
		blockchain.addTransaction(transaction);
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
