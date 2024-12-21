import { encode } from "cbor2";
import { type Component, For } from "solid-js";
import { Divider, Grid, HStack } from "styled-system/jsx";
import { uint8ArrayToHex } from "uint8array-extras";
import { Card } from "~/components/ui/card";
import { Table } from "~/components/ui/table";
import type { Block } from "~/lib/blockchain/block";
import TablerExternalLink from "~icons/tabler/external-link";
import { Badge } from "../ui/badge";
import { CopyButton } from "../ui/copy-button";
import { KeyDisplay } from "./key-display";
import { TransactionDisplay } from "./transaction-display";

export const BlockDisplay: Component<{ block: Block }> = (props) => {
	const blockData = encode(props.block);
	const hexBlockData = uint8ArrayToHex(blockData);
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
				<Divider borderColor="border.default" my="3" />
				<Grid columns={{ base: 1, md: 2 }}>
					<For each={props.block.transactions}>
						{(transaction) => <TransactionDisplay transaction={transaction} />}
					</For>
				</Grid>
			</Card.Body>
			<Card.Footer justifyContent="space-between" alignItems="center">
				<HStack>
					<CopyButton value={hexBlockData}>Data</CopyButton>
					<CopyButton value={uint8ArrayToHex(props.block.signature!)}>
						Signature
					</CopyButton>
				</HStack>
				<HStack>
					<Badge>Size: {blockData.byteLength}bytes</Badge>
					<Badge
						variant="solid"
						asChild={(forwardProps) => (
							<a
								{...forwardProps()}
								href={`https://cbor.me/?bytes=${hexBlockData}`}
								target="_blank"
								rel="noreferrer"
							>
								CBOR Data <TablerExternalLink />
							</a>
						)}
					/>
				</HStack>
			</Card.Footer>
		</Card.Root>
	);
};
