import { type Component, For, Show, createMemo } from "solid-js";
import { Box, Stack } from "styled-system/jsx";
import { areUint8ArraysEqual } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import type { Block } from "~/lib/blockchain/block";
import { actions } from "~/lib/events";
import { useWallet } from "~/lib/wallet-context";
import TablerBroadcast from "~icons/tabler/broadcast";
import { EmptyPlaceholder } from "../empty-placeholder";
import { IconButton } from "../ui/icon-button";
import { BlockDisplay } from "./block-display";

const BlockEntry: Component<{ block: Block }> = (props) => {
	const broadcast = async () => {
		await actions.broadcastBlock(props.block);
	};

	return (
		<Box position="relative">
			<BlockDisplay block={props.block} />
			<IconButton position="absolute" top="2" right="2" onClick={broadcast}>
				<TablerBroadcast />
			</IconButton>
		</Box>
	);
};

export const BroadcastBlock: Component = () => {
	const blockchain = useBlockchain();
	const wallet = useWallet();
	const blocks = createMemo(() =>
		blockchain.store.blocks.filter(
			(block) =>
				block.index !== 0 && areUint8ArraysEqual(block.minedBy, wallet.public),
		),
	);

	return (
		<Stack>
			<Show
				when={blocks().length > 0}
				fallback={
					<EmptyPlaceholder
						title="No blocks mined by you"
						description="Mine a block to broadcast it to the network."
					/>
				}
			>
				<For each={blocks()}>{(block) => <BlockEntry block={block} />}</For>
			</Show>
		</Stack>
	);
};
