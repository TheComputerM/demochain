import { useStore } from "@tanstack/solid-store";
import { For } from "solid-js";
import { Stack } from "styled-system/jsx";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { logStore } from "~/lib/logger";

export default function ConsolePage() {
	const logs = useStore(logStore);

	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Console
			</Heading>
			<Table.Root size="sm">
				<Table.Head>
					<Table.Row>
						<Table.Header>Type</Table.Header>
						<Table.Header>Message</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<For each={logs()}>
						{(log) => (
							<Table.Row>
								<Table.Cell>{log.type}</Table.Cell>
								<Table.Cell>{log.args.join(";")}</Table.Cell>
							</Table.Row>
						)}
					</For>
				</Table.Body>
			</Table.Root>
		</Stack>
	);
}
