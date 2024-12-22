import { makeEventListener } from "@solid-primitives/event-listener";
import { decode, encode } from "cbor2";
import {
	type ParentComponent,
	createContext,
	onMount,
	useContext,
} from "solid-js";
import { unwrap } from "solid-js/store";
import { getOccupants } from "trystero/firebase";
import { uint8ArrayToHex } from "uint8array-extras";
import { Blockchain } from "~/lib/blockchain/chain";
import type { Transaction } from "~/lib/blockchain/transaction";
import { LogError, logger } from "~/lib/logger";
import { RoomEvent, TrysteroConfig, useRoom } from "~/lib/room-context";
import type { Block } from "./blockchain/block";
import { PublicKey } from "./blockchain/keys";
import { useWallet } from "./wallet-context";

const BlockchainContext = createContext<Blockchain>();

export const BlockchainProvider: ParentComponent = (props) => {
	const room = useRoom();
	const wallet = useWallet();
	const blockchain = new Blockchain({
		blocks: [],
		settings: {
			difficulty: 1,
		},
		mempool: [],
	});

	const [sendWallet, recieveWallet] = room.makeAction<Uint8Array>(
		RoomEvent.WALLET,
	);

	recieveWallet(async (payload, peerId) => {
		const publicKey = decode<Uint8Array>(payload);
		const wallet = new PublicKey(publicKey);
		blockchain.peers.set(peerId, { publicKey: wallet });
	});

	onMount(() => {
		makeEventListener<{ "peer-join": CustomEvent<string> }>(
			window,
			"peer-join",
			(event) => {
				// send our wallet to the new peer
				sendWallet(encode(wallet.public.key), event.detail);
			},
		);

		makeEventListener<{ "peer-leave": CustomEvent<string> }>(
			window,
			"peer-leave",
			(event) => {
				// remove peer from blockchain
				blockchain.peers.delete(event.detail);
			},
		);
	});

	const broadcastState = room.makeAction(RoomEvent.SYNC_STATE)[0];
	const recieveStateSyncRequest = room.makeAction(RoomEvent.REQUEST_STATE)[1];

	recieveStateSyncRequest((_, peerId) => {
		broadcastState(encode(unwrap(blockchain.store)), peerId);
	});

	onMount(async () => {
		const occupants = await getOccupants(
			TrysteroConfig,
			sessionStorage.getItem("network")!,
		);

		if (occupants.length === 0) {
			blockchain.createGenesisBlock(wallet.private, wallet.public);
		}
	});

	const recieveTransaction = room.makeAction<Uint8Array>(
		RoomEvent.TRANSACTION,
	)[1];

	recieveTransaction(async (data, peerId) => {
		const transaction = decode<Transaction>(data);
		logger.info(`received transaction from peer:${peerId}`);

		if (!(await transaction.verify())) {
			throw new LogError("invalid transaction signature");
		}

		blockchain.addTransaction(transaction);
	});

	const recieveBlock = room.makeAction<Uint8Array>(RoomEvent.BLOCK)[1];
	recieveBlock(async (data, peerId) => {
		const block = decode<Block>(data);
		logger.info(
			`received block:${uint8ArrayToHex(block.hash.slice(0, 6))} from peer:${peerId}`,
		);

		if (!(await block.verify())) {
			throw new LogError("invalid block signature");
		}

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
