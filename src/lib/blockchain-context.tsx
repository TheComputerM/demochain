import { decode } from "cbor2";
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
		blocks: [],
		settings: {
			difficulty: 1,
		},
		mempool: [],
	});

	onMount(async () => {
		if (
			(await getOccupants(TrysteroConfig, sessionStorage.getItem("network")!))
				.length === 0
		) {
			blockchain.createGenesisBlock(wallet.raw.public);
		}
	});

	const recieveTransaction = room.makeAction(NetworkEvent.TRANSACTION)[1];
	recieveTransaction((data) => {
		const transaction = decode<Transaction>(data as Uint8Array);
		blockchain.addTransaction(transaction);
	});

	const recieveBlock = room.makeAction(NetworkEvent.BLOCK)[1];
	recieveBlock((data) => {
		const block = decode<Block>(data as Uint8Array);
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
