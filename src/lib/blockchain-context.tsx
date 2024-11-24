import { makeEventListener } from "@solid-primitives/event-listener";
import {
	type ParentComponent,
	createContext,
	onMount,
	useContext,
} from "solid-js";
import { unwrap } from "solid-js/store";
import { Blockchain, type BlockchainState } from "./blockchain/chain";
import { decode, encode } from "./blockchain/serializer";
import { logger } from "./logger";
import { useRoom } from "./room";
import { selfId } from "trystero";

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

	const [syncState, getNetworkState] = room.makeAction("init_sync");

	getNetworkState((data) => {
		if (blockchain.store.blocks.length === 0) {
			const blockchainState = decode<BlockchainState>(data as Uint8Array);
			blockchain.setStore(blockchainState);
			logger.info("State synced with the network");
		}
	});

	onMount(() => {
		makeEventListener<{ "peer-join": CustomEvent }>(
			window,
			"peer-join",
			(event) => {
				const blockchainState = unwrap(blockchain.store);
				syncState(encode(blockchainState), event.detail);
			},
		);
	});

	onMount(() => {
		setTimeout(async () => {
			if (blockchain.store.blocks.length === 0) {
				await blockchain.createGenesisBlock(selfId);
				logger.info("Genesis block created");
			}
		}, 3000);
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
