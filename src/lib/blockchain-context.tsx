import { makeEventListener } from "@solid-primitives/event-listener";
import { decode, encode } from "cbor2";
import {
	type ParentComponent,
	createContext,
	onMount,
	useContext,
} from "solid-js";
import { getOccupants } from "trystero/firebase";
import { uint8ArrayToHex } from "uint8array-extras";
import { Blockchain } from "~/lib/blockchain/chain";
import type { Transaction } from "~/lib/blockchain/transaction";
import { logger } from "~/lib/logger";
import { RoomEvent, TrysteroConfig, useRoom } from "~/lib/room-context";
import type { Block } from "./blockchain/block";
import { Wallet } from "./blockchain/wallet";
import { useWallet } from "./wallet-context";

const BlockchainContext = createContext<Blockchain>();

export const BlockchainProvider: ParentComponent = (props) => {
	const room = useRoom();
	const wallet = useWallet();
	const blockchain = new Blockchain({
		blocks: [],
		settings: {
			difficulty: 1,
			baseReward: 5,
		},
		mempool: [],
	});

	const [sendWallet, recieveWallet] = room.makeAction<Uint8Array>(
		RoomEvent.WALLET,
	);

	recieveWallet(async (payload, peerId) => {
		const publicKey = decode<Uint8Array>(payload);
		const wallet = await Wallet.fromPublickey(publicKey);
		blockchain.wallets.set(peerId, wallet);
	});

	onMount(() => {
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
				blockchain.wallets.delete(event.detail);
			},
		);
	});

	onMount(async () => {
		const occupants = await getOccupants(
			TrysteroConfig,
			sessionStorage.getItem("network")!,
		);

		if (occupants.length === 0) {
			blockchain.createGenesisBlock(wallet);
		}
	});

	const recieveTransaction = room.makeAction<Uint8Array>(
		RoomEvent.TRANSACTION,
	)[1];

	recieveTransaction(async (data, peerId) => {
		const [payload, signature] = decode<[Uint8Array, Uint8Array]>(data);
		const senderWallet = blockchain.wallets.get(peerId);
		if (!senderWallet) throw new Error("Sender wallet not found");

		const valid = await senderWallet.verify(payload, signature);
		if (!valid) throw new Error("Invalid signature");

		const transaction = decode<Transaction>(payload);
		transaction.signature = signature;
		logger.info(`received transaction from peer:${peerId}`);
		blockchain.addTransaction(transaction);
	});

	const recieveBlock = room.makeAction<Uint8Array>(RoomEvent.BLOCK)[1];
	recieveBlock(async (data, peerId) => {
		const [payload, signature] = decode<[Uint8Array, Uint8Array]>(data);
		const senderWallet = blockchain.wallets.get(peerId);
		if (!senderWallet) throw new Error("Sender wallet not found");

		const valid = senderWallet.verify(payload, signature);
		if (!valid) throw new Error("Invalid signature");

		const block = decode<Block>(payload);
		block.signature = signature;
		blockchain.appendBlock(block);
		logger.info(
			`received block:${uint8ArrayToHex(block.hash.slice(0, 6))} from peer:${peerId}`,
		);
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
