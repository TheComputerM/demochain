import { Stack } from "styled-system/jsx";
import { Heading } from "~/components/ui/heading";

export default function UserPage() {
	return (
		<Stack>
			<Heading as="h1" textStyle="4xl">
				Wallet
			</Heading>
			<Heading as="h2" textStyle="2xl">
				Create Transaction
			</Heading>
		</Stack>
	);
}
