import { makeEventListener } from "@solid-primitives/event-listener";
import { decode, encode } from "cbor2";
import {
	type ParentComponent,
	createContext,
	onMount,
	useContext,
} from "solid-js";
import { unwrap } from "solid-js/store";
import { getOccupants, selfId } from "trystero/firebase";
import { uint8ArrayToHex } from "uint8array-extras";
import { Blockchain } from "~/lib/blockchain/chain";
import type { Transaction } from "~/lib/blockchain/transaction";
import { LogError, logger } from "~/lib/logger";
import { TrysteroConfig, useRoom } from "~/lib/room-context";
import type { Block } from "./blockchain/block";
import { RoomEvent, recieveRoomEvent, sendRoomEvent } from "./events";
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

	// add peer's public key to node's memory to help identify them
	const recieveWallet = recieveRoomEvent(RoomEvent.WALLET);
	recieveWallet(async (payload, peerId) => {
		const publicKey = decode<Uint8Array>(payload);
		blockchain.peers.set(peerId, { publicKey });
	});

	onMount(() => {
		makeEventListener<{ "peer-join": CustomEvent<string> }>(
			window,
			"peer-join",
			(event) => {
				// send our wallet to the new peer
				const sendWallet = sendRoomEvent(RoomEvent.WALLET);
				sendWallet(encode(wallet.public), event.detail);
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

	// sync state with a peer when requested
	const broadcastState = sendRoomEvent(RoomEvent.SYNC_STATE);
	const recieveStateSyncRequest = recieveRoomEvent(RoomEvent.REQUEST_STATE);
	recieveStateSyncRequest((_, peerId) => {
		broadcastState(encode(unwrap(blockchain.store)), peerId);
	});

	// if we are the first peer, create the genesis block
	onMount(async () => {
		const occupants = await getOccupants(
			TrysteroConfig,
			sessionStorage.getItem("network")!,
		);

		if (
			occupants.length === 0 ||
			(occupants.length === 1 && occupants[0] === selfId)
		) {
			blockchain.createGenesisBlock(wallet.private, wallet.public);
		} else {
			logger.info("choose a peer to sync state with");
		}
	});

	// recieve a transaction from a peer
	const recieveTransaction = recieveRoomEvent(RoomEvent.TRANSACTION);
	recieveTransaction(async (data, peerId) => {
		const transaction = decode<Transaction>(data);
		logger.info(`received transaction from peer:${peerId}`);

		if (!(await transaction.verify())) {
			throw new LogError("invalid transaction signature");
		}

		blockchain.addTransaction(transaction);
	});

	// recieve a block from a peer
	const recieveBlock = recieveRoomEvent(RoomEvent.BLOCK);
	recieveBlock(async (data, peerId) => {
		const block = decode<Block>(data);
		logger.info(
			`received block:${uint8ArrayToHex(block.hash.slice(0, 6))}... from peer:${peerId}`,
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
