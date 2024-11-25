import { type Component, For } from "solid-js";
import { Divider, Stack } from "styled-system/jsx";
import { Card } from "~/components/ui/card";
import { Table } from "~/components/ui/table";
import { useBlockchain } from "~/lib/blockchain-context";
import type { Block } from "~/lib/blockchain/block";

export const BlockDisplay: Component<{ block: Block }> = (props) => {
	return (
		<Card.Root wordWrap="break-word">
			<Card.Header>
				<Card.Title>Block #{props.block.index}</Card.Title>
				<Card.Description>{props.block.hash}</Card.Description>
			</Card.Header>
			<Card.Body>
				<Table.Root size="sm">
					<Table.Head>
						<Table.Header colSpan={2}>Properties</Table.Header>
					</Table.Head>
					<Table.Body>
						<Table.Row>
							<Table.Cell>Nonce</Table.Cell>
							<Table.Cell>{props.block.nonce}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Timestamp</Table.Cell>
							<Table.Cell>{props.block.timestamp}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Previous Hash</Table.Cell>
							<Table.Cell>{props.block.previousHash}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
				<Divider borderColor="border.default" />
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
									<Table.Cell>{transaction.sender}</Table.Cell>
									<Table.Cell>{transaction.recipient}</Table.Cell>
									<Table.Cell>{transaction.amount}</Table.Cell>
								</Table.Row>
							)}
						</For>
					</Table.Body>
				</Table.Root>
			</Card.Body>
		</Card.Root>
	);
};

export const BlockchainDisplay: Component = () => {
	const blockchain = useBlockchain();
	const blocks = blockchain.store.blocks;
	return (
		<Stack>
			<For each={blocks}>{(block) => <BlockDisplay block={block} />}</For>
		</Stack>
	);
};
