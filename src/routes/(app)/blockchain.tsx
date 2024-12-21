import { For, Show } from "solid-js";
import { Stack } from "styled-system/jsx";
import { BlockDisplay } from "~/components/chain/block-display";
import { Heading } from "~/components/ui/heading";
import { Icon } from "~/components/ui/icon";
import { useBlockchain } from "~/lib/blockchain-context";
import TablerArrowDownSquareFilled from "~icons/tabler/arrow-down-square-filled";

export default function BlockchainPage() {
	const blockchain = useBlockchain();
	const blocks = blockchain.store.blocks;
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Blockchain
			</Heading>
			<Stack align="center">
				<For each={blocks}>
					{(block, i) => (
						<>
							<Show when={i() > 0}>
								<Icon
									size="2xl"
									asChild={(forwardProps) => (
										<TablerArrowDownSquareFilled {...forwardProps()} />
									)}
								/>
							</Show>
							<BlockDisplay block={block} />
						</>
					)}
				</For>
			</Stack>
		</Stack>
	);
}
