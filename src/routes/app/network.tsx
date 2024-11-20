import { HStack, Stack } from "styled-system/jsx";
import { Badge } from "~/components/ui/badge";
import { Heading } from "~/components/ui/heading";

export default function NetworkPage() {
	return (
		<Stack>
			<HStack justify="space-between">
				<Heading as="h1" textStyle="4xl">
					Network
				</Heading>
				<Badge variant="solid">1 Connected</Badge>
			</HStack>
		</Stack>
	);
}
