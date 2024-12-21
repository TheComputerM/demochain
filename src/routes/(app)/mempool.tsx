import { Divider, Stack } from "styled-system/jsx";
import { BroadcastBlock } from "~/components/chain/broadcast-block";
import { MineBlock } from "~/components/chain/mine-block";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";

export default function MempoolPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Mempool
			</Heading>
			<Stack>
				<Heading as="h2" textStyle="2xl">
					Mine Block
				</Heading>
				<Text color="fg.subtle">
					Mine a block with the chosen transactions, but does not broadcast it
					to the network.
				</Text>
			</Stack>
			<MineBlock />
			<Divider />
			<Stack>
				<Heading as="h2" textStyle="2xl">
					Broadcast Block
				</Heading>
				<Text color="fg.subtle">
					Broadcast a pre-mined block to the network.
				</Text>
			</Stack>
			<BroadcastBlock />
		</Stack>
	);
}
