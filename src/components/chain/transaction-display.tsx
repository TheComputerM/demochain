import { encode } from "cbor2";
import type { Component } from "solid-js";
import { HStack } from "styled-system/jsx";
import { uint8ArrayToHex } from "uint8array-extras";
import type { Transaction } from "~/lib/blockchain/transaction";
import { CopyButton } from "../ui/copy-button";
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

			<Table.Row>
				<Table.Cell rowSpan={2}>
					<HStack>
						<CopyButton
							value={uint8ArrayToHex(encode(props.transaction))}
							variant="outline"
						>
							Data
						</CopyButton>
						<CopyButton
							value={uint8ArrayToHex(props.transaction.signature!)}
							variant="outline"
						>
							Signature
						</CopyButton>
					</HStack>
				</Table.Cell>
			</Table.Row>
		</Table.Root>
	);
};
