import { Stack } from "styled-system/jsx";
import { BlockchainDisplay } from "~/components/chain/blockchain";
import { Heading } from "~/components/ui/heading";

export default function BlockchainPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Blockchain
			</Heading>
			<BlockchainDisplay />
		</Stack>
	);
}
