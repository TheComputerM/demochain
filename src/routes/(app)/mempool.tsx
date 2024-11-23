import { IconArrowNarrowRight, IconPlus } from "@tabler/icons-solidjs";
import { useStore } from "@tanstack/solid-store";
import { For, type Component } from "solid-js";
import { HStack, Stack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { mempool } from "~/lib/blockchain/mempool";
import type { Transaction } from "~/lib/blockchain/transaction";

const TransactionDisplay: Component<{ transaction: Transaction }> = (props) => {
	return (
		<Card.Root>
			<Card.Header>
				<HStack justify="space-between">
					<Stack>
						<Card.Title display="flex" alignItems="center" gap="2">
							{props.transaction.sender}
							<IconArrowNarrowRight />
							{props.transaction.recipient}
						</Card.Title>
						<Card.Description>{props.transaction.amount}</Card.Description>
					</Stack>
					<Button>
						<IconPlus />
						Add to Block
					</Button>
				</HStack>
			</Card.Header>
		</Card.Root>
	);
};

const MempoolDisplay: Component = () => {
	const transactions = useStore(mempool);
	return (
		<Stack>
			<For each={transactions()}>
				{(transaction) => <TransactionDisplay transaction={transaction} />}
			</For>
		</Stack>
	);
};

const MineTransactions: Component = () => {
	return <Button>Mine Selected Transactions</Button>;
};

export default function MempoolPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Mempool
			</Heading>
			<MempoolDisplay />
			<MineTransactions />
		</Stack>
	);
}
