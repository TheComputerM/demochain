import { type Component, For } from "solid-js";
import { Box, Stack } from "styled-system/jsx";
import { areUint8ArraysEqual } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import { useWallet } from "~/lib/wallet-context";
import { IconButton } from "../ui/icon-button";
import { BlockDisplay } from "./block-display";
import type { Block } from "~/lib/blockchain/block";
import TablerBroadcast from "~icons/tabler/broadcast";
import { NetworkEvent, useRoom } from "~/lib/room-context";
import { encode } from "cbor2";

const BlockEntry: Component<{ block: Block }> = (props) => {
	const room = useRoom();
	const broadcastBlock = room.makeAction(NetworkEvent.BLOCK)[0];

	const broadcast = async () => {
		const data = encode(props.block);
		const signature = props.block.signature;
		await broadcastBlock(encode([data, signature]));
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
	const blocks = () =>
		blockchain.store.blocks.filter((block) =>
			areUint8ArraysEqual(block.minedBy, wallet.raw.public),
		);

	return (
		<Stack>
			<For each={blocks()}>{(block) => <BlockEntry block={block} />}</For>
		</Stack>
	);
};
