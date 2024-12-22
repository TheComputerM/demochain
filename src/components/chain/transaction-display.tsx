import { encode } from "cbor2";
import type { Component } from "solid-js";
import { HStack, Wrap } from "styled-system/jsx";
import { uint8ArrayToHex } from "uint8array-extras";
import type { Transaction } from "~/lib/blockchain/transaction";
import { Badge } from "../ui/badge";
import { CopyButton } from "../ui/copy-button";
import { Table } from "../ui/table";
import { Balance } from "./balance";
import { InspectCBOR } from "./inspect-cbor";
import { KeyDisplay } from "./key-display";

export const TransactionDisplay: Component<{ transaction: Transaction }> = (
	props,
) => {
	const raw = encode(props.transaction);
	return (
		<Table.Root size="sm" variant="outline">
			<Table.Row>
				<Table.Header>Nonce</Table.Header>
				<Table.Cell>{props.transaction.nonce}</Table.Cell>
			</Table.Row>

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
				<Table.Cell colSpan={2}>
					<Wrap justify="space-between">
						<HStack>
							<CopyButton
								value={uint8ArrayToHex(encode(props.transaction.data))}
								variant="outline"
							>
								Data
							</CopyButton>
							<CopyButton
								value={uint8ArrayToHex(props.transaction.signature)}
								variant="outline"
							>
								Signature
							</CopyButton>
						</HStack>
						<HStack>
							<Badge>Size: {raw.byteLength}B</Badge>
							<InspectCBOR data={uint8ArrayToHex(raw)} />
						</HStack>
					</Wrap>
				</Table.Cell>
			</Table.Row>
		</Table.Root>
	);
};
