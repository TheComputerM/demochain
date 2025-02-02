import { encode } from "cbor2";
import { type Component, For, Show, createMemo } from "solid-js";
import { Box, Stack } from "styled-system/jsx";
import { areUint8ArraysEqual, uint8ArrayToHex } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import type { Block } from "~/lib/blockchain/block";
import { RoomEvent, sendRoomEvent } from "~/lib/events";
import { logger } from "~/lib/logger";
import { useRoom } from "~/lib/room-context";
import { useWallet } from "~/lib/wallet-context";
import TablerBroadcast from "~icons/tabler/broadcast";
import { EmptyPlaceholder } from "../empty-placeholder";
import { IconButton } from "../ui/icon-button";
import { BlockDisplay } from "./block-display";

const BlockEntry: Component<{ block: Block }> = (props) => {
	const room = useRoom();
	const broadcastBlock = sendRoomEvent(RoomEvent.BLOCK);

	const broadcast = async () => {
		await broadcastBlock(encode(props.block));
		logger.info(
			`broadcasted block:${uint8ArrayToHex(props.block.hash.slice(0, 6))}... to the network`,
		);
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
