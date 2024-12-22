import { encode } from "cbor2";
import { type Component, For } from "solid-js";
import { HStack, Stack } from "styled-system/jsx";
import { uint8ArrayToHex } from "uint8array-extras";
import { Card } from "~/components/ui/card";
import { Table } from "~/components/ui/table";
import type { Block } from "~/lib/blockchain/block";
import type { Transaction } from "~/lib/blockchain/transaction";
import TablerCaretUpDownFilled from "~icons/tabler/caret-up-down-filled";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Collapsible } from "../ui/collapsible";
import { CopyButton } from "../ui/copy-button";
import { InspectCBOR } from "./inspect-cbor";
import { KeyDisplay } from "./key-display";
import { TransactionDisplay } from "./transaction-display";
import { VerifySignature } from "./verify-signature";

const TransactionsList: Component<{ transactions: Transaction[] }> = (
	props,
) => {
	return (
		<Collapsible.Root>
			<Collapsible.Trigger
				asChild={(triggerProps) => (
					<Button variant="subtle" {...triggerProps()} width="full" my="2">
						Transactions
						<TablerCaretUpDownFilled />
					</Button>
				)}
			/>
			<Collapsible.Content>
				<Stack>
					<For each={props.transactions}>
						{(transaction) => <TransactionDisplay transaction={transaction} />}
					</For>
				</Stack>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};

export const BlockDisplay: Component<{ block: Block }> = (props) => {
	const raw = encode(props.block);
	const data = uint8ArrayToHex(encode(props.block.data));
	const signature = uint8ArrayToHex(props.block.signature);

	return (
		<Card.Root wordWrap="break-word">
			<Card.Header>
				<Card.Title>Block #{props.block.index}</Card.Title>
				<Card.Description>{uint8ArrayToHex(props.block.hash)}</Card.Description>
			</Card.Header>
			<Card.Body>
				<Table.Root size="sm">
					<Table.Body>
						<Table.Row>
							<Table.Header>Nonce</Table.Header>
							<Table.Cell>{props.block.nonce}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Header>Timestamp</Table.Header>
							<Table.Cell>{props.block.timestamp}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Header>Previous Hash</Table.Header>
							<Table.Cell>
								{uint8ArrayToHex(props.block.previousHash)}
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Header>Mined by</Table.Header>
							<Table.Cell>
								<KeyDisplay value={props.block.minedBy} />
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
				<TransactionsList transactions={props.block.transactions} />
			</Card.Body>
			<Card.Footer justifyContent="space-between" alignItems="center">
				<HStack>
					<CopyButton value={data}>Data</CopyButton>
					<CopyButton value={signature}>Signature</CopyButton>
					<VerifySignature
						key={uint8ArrayToHex(props.block.minedBy)}
						message={data}
						signature={signature}
					/>
				</HStack>
				<HStack>
					<Badge>Size: {raw.byteLength}B</Badge>
					<InspectCBOR data={uint8ArrayToHex(raw)} />
				</HStack>
			</Card.Footer>
		</Card.Root>
	);
};
