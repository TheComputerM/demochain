import { type Component, For, Show, createMemo } from "solid-js";
import { Box, Stack } from "styled-system/jsx";
import { areUint8ArraysEqual } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import { actions } from "~/lib/events";
import { useWallet } from "~/lib/wallet-context";
import TablerBroadcast from "~icons/tabler/broadcast";
import { EmptyPlaceholder } from "../empty-placeholder";
import { Button } from "../ui/button";
import { BlockDisplay } from "./block-display";

export const BroadcastBlock: Component = () => {
	const blockchain = useBlockchain();
	const wallet = useWallet();

	// blocks that are mined by the user and are NOT the genesis block
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
				<For each={blocks()}>
					{(block) => (
						<Box position="relative">
							<BlockDisplay block={block} />
							<Button
								position="absolute"
								top="2"
								right="2"
								onClick={() => actions.broadcastBlock(block)}
							>
								Broadcast <TablerBroadcast />
							</Button>
						</Box>
					)}
				</For>
			</Show>
		</Stack>
	);
};
