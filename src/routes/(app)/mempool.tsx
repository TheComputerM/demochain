import {
	IconArrowNarrowRight,
	IconMinus,
	IconPlus,
} from "@tabler/icons-solidjs";
import { Store, useStore } from "@tanstack/solid-store";
import { type Component, For, Show, createEffect } from "solid-js";
import { HStack, Stack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { useBlockchain } from "~/lib/blockchain-context";
import type { Transaction } from "~/lib/blockchain/transaction";

const selectedTransactionsStore = new Store<boolean[]>([]);

const TransactionDisplay: Component<{
	transaction: Transaction;
	index: number;
}> = (props) => {
	// TODO: select transaction based on index only
	const selectedTransactions = useStore(selectedTransactionsStore);
	const isSelected = () => selectedTransactions()[props.index];
	const toggleSelected = () => {
		selectedTransactionsStore.setState((state) => {
			state[props.index] = !state[props.index];
			return state;
		});
	};

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
					<Button
						variant={isSelected() ? "outline" : "solid"}
						onClick={toggleSelected}
					>
						<Show
							when={isSelected()}
							fallback={
								<>
									<IconPlus />
									Add to Block
								</>
							}
						>
							<IconMinus />
							Remove
						</Show>
					</Button>
				</HStack>
			</Card.Header>
		</Card.Root>
	);
};

const MempoolDisplay: Component = () => {
	const mempool = useBlockchain().store.mempool;

	createEffect(() => {
		selectedTransactionsStore.setState(() =>
			new Array(mempool.length).fill(false),
		);
	});

	return (
		<Stack>
			<For each={mempool}>
				{(transaction, i) => (
					<TransactionDisplay transaction={transaction} index={i()} />
				)}
			</For>
		</Stack>
	);
};

const MineTransactions: Component = () => {
	const selectedTransactions = useStore(selectedTransactionsStore);

	/**
	 * Create a block from the selected transactions
	 */
	async function createBlock() {}

	return (
		<Button
			disabled={!selectedTransactions().find((x) => x)}
			onClick={createBlock}
		>
			Mine Selected Transactions
		</Button>
	);
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
