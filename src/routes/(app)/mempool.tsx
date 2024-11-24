import {
	IconArrowNarrowRight,
	IconMinus,
	IconPlus,
} from "@tabler/icons-solidjs";
import { Store, useStore } from "@tanstack/solid-store";
import { encode } from "cbor2";
import { type Component, For, Show, createEffect } from "solid-js";
import { HStack, Stack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { useBlockchain } from "~/lib/blockchain-context";
import { Block } from "~/lib/blockchain/block";
import type { Transaction } from "~/lib/blockchain/transaction";
import { logger } from "~/lib/logger";
import { useRoom } from "~/lib/room";

const selectedTransactionsStore = new Store<boolean[]>([]);

const TransactionDisplay: Component<{
	transaction: Transaction;
	index: number;
}> = (props) => {
	const isSelected = useStore(
		selectedTransactionsStore,
		(state) => state[props.index],
	);

	const toggleSelected = () =>
		selectedTransactionsStore.setState((state) => {
			state[props.index] = !state[props.index];
			return state;
		});

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
	const blockchain = useBlockchain();
	const room = useRoom();
	const sendBlock = room.makeAction("sngl_blk")[0];

	/**
	 * Create a block from the selected transactions
	 */
	async function mineBlock() {
		const block = new Block(
			blockchain.store.blocks.length,
			Date.now(),
			"",
			blockchain.store.blocks.at(-1)!.hash,
			0,
			blockchain.store.mempool.filter((_, i) => selectedTransactions()[i]),
		);
		await block.mine(blockchain.store.settings.difficulty);
		blockchain.appendBlock(block);
		logger.info(`Broadcasted block ${block.hash} at ${(new Date()).getTime()}`);
		await sendBlock(encode(block));
	}

	return (
		<Button
			disabled={!selectedTransactions().find((x) => x)}
			onClick={mineBlock}
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
