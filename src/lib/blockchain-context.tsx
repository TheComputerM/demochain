import { makeEventListener } from "@solid-primitives/event-listener";
import { decode, encode } from "cbor2";
import {
	type ParentComponent,
	createContext,
	onMount,
	useContext,
} from "solid-js";
import { reconcile, unwrap } from "solid-js/store";
import { selfId } from "trystero/firebase";
import { Blockchain, type BlockchainState } from "~/lib/blockchain/chain";
import type { Transaction } from "~/lib/blockchain/transaction";
import { logger } from "~/lib/logger";
import { NetworkEvent, useRoom } from "~/lib/room-context";
import type { Block } from "./blockchain/block";

const BlockchainContext = createContext<Blockchain>();

export const BlockchainProvider: ParentComponent = (props) => {
	const room = useRoom();
	const blockchain = new Blockchain({
		blocks: [],
		settings: {
			difficulty: 1,
		},
		mempool: [],
	});

	const [broadcastNetworkState, recieveNetworkState] = room.makeAction(
		NetworkEvent.STATE,
	);

	recieveNetworkState(async (data) => {
		if (blockchain.store.blocks.length === 0) {
			const blockchainState = decode<BlockchainState>(data as Uint8Array);
			if (await Blockchain.validate(blockchainState.blocks)) {
				blockchain.setStore(reconcile(blockchainState));
				logger.info("State synced with the network");
			}
		}
	});

	onMount(() => {
		makeEventListener<{ "peer-join": CustomEvent }>(
			window,
			"peer-join",
			(event) => {
				const blockchainState = unwrap(blockchain.store);
				broadcastNetworkState(encode(blockchainState), event.detail);
			},
		);

		// create genesis block if there are no blocks after 3s
		setTimeout(async () => {
			if (blockchain.store.blocks.length === 0) {
				await blockchain.createGenesisBlock(selfId);
				logger.info("Genesis block created");
			}
		}, 3000);
	});

	const recieveTransaction = room.makeAction(NetworkEvent.TRANSACTION)[1];
	recieveTransaction((data) => {
		const transaction = decode<Transaction>(data as Uint8Array);
		blockchain.addTransaction(transaction);
	});

	const recieveBlock = room.makeAction(NetworkEvent.BLOCK)[1];
	recieveBlock((data) => {
		const block = decode<Block>(data as Uint8Array);
		logger.info(`Received block ${block.hash} at ${(new Date()).getTime()}`);
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
