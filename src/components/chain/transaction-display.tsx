import type { Component } from "solid-js";
import type { Transaction } from "~/lib/blockchain/transaction";
import { Table } from "../ui/table";
import { Balance } from "./balance";
import { KeyDisplay } from "./key-display";

export const TransactionDisplay: Component<{ transaction: Transaction }> = (
	props,
) => {
	return (
		<Table.Root size="sm" variant="outline">
			<Table.Row>
				<Table.Header>From</Table.Header>
				<Table.Cell>
					<KeyDisplay value={props.transaction.sender} />
				</Table.Cell>
			</Table.Row>

			<Table.Row>
				<Table.Header>To</Table.Header>
				<Table.Cell>
					<KeyDisplay value={props.transaction.recipient} />
				</Table.Cell>
			</Table.Row>

			<Table.Row>
				<Table.Header>Amount</Table.Header>
				<Table.Cell>
					<Balance>{props.transaction.amount}</Balance>
				</Table.Cell>
			</Table.Row>

			<Table.Row>
				<Table.Header>Timestamp</Table.Header>
				<Table.Cell>{props.transaction.timestamp}</Table.Cell>
			</Table.Row>
		</Table.Root>
	);
};
