import { For } from "solid-js";
import { Stack } from "styled-system/jsx";
import { BlockDisplay } from "~/components/chain/block-display";
import { Heading } from "~/components/ui/heading";
import { useBlockchain } from "~/lib/blockchain-context";

export default function BlockchainPage() {
	const blockchain = useBlockchain();
	const blocks = blockchain.store.blocks;
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Blockchain
			</Heading>
			<Stack>
				<For each={blocks}>{(block) => <BlockDisplay block={block} />}</For>
			</Stack>
		</Stack>
	);
}
