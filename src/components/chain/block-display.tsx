import { encode } from "cbor2";
import { type Component, For } from "solid-js";
import { Divider } from "styled-system/jsx";
import { uint8ArrayToHex } from "uint8array-extras";
import { Card } from "~/components/ui/card";
import { Table } from "~/components/ui/table";
import type { Block } from "~/lib/blockchain/block";
import TablerExternalLink from "~icons/tabler/external-link";
import { Badge } from "../ui/badge";
import { Balance } from "./balance";
import { KeyDisplay } from "./key-display";

export const BlockDisplay: Component<{ block: Block }> = (props) => {
	return (
		<Card.Root wordWrap="break-word">
			<Card.Header>
				<Card.Title>Block #{props.block.index}</Card.Title>
				<Card.Description>{props.block.hash}</Card.Description>
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
							<Table.Cell>{props.block.previousHash}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Header>Mined by</Table.Header>
							<Table.Cell>
								<KeyDisplay value={props.block.minedBy} />
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
				<Divider borderColor="border.default" my="1" />
				<Table.Root size="sm">
					<Table.Head>
						<Table.Header>From</Table.Header>
						<Table.Header>To</Table.Header>
						<Table.Header>Amount</Table.Header>
					</Table.Head>
					<Table.Body>
						<For each={props.block.transactions}>
							{(transaction) => (
								<Table.Row>
									<Table.Cell>
										<KeyDisplay value={transaction.sender} />
									</Table.Cell>
									<Table.Cell>
										<KeyDisplay value={transaction.recipient} />
									</Table.Cell>
									<Table.Cell>
										<Balance>{transaction.amount}</Balance>
									</Table.Cell>
								</Table.Row>
							)}
						</For>
					</Table.Body>
				</Table.Root>
			</Card.Body>
			<Card.Footer>
				<Badge
					variant="solid"
					asChild={(forwardProps) => (
						<a
							{...forwardProps()}
							href={`https://cbor.me/?bytes=${uint8ArrayToHex(encode(props.block))}`}
							target="_blank"
							rel="noreferrer"
						>
							CBOR Data <TablerExternalLink />
						</a>
					)}
				/>
			</Card.Footer>
		</Card.Root>
	);
};
