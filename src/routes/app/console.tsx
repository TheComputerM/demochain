import { Stack } from "styled-system/jsx";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";

export default function ConsolePage() {
	return (
		<Stack>
			<Heading as="h1" textStyle="4xl">
				Console
			</Heading>
			<Table.Root>
				<Table.Head>
					<Table.Row>
						<Table.Header>Level</Table.Header>
						<Table.Header>Message</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell>INFO</Table.Cell>
						<Table.Cell>Application started</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Stack>
	);
}
