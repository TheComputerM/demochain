import { type Component, For, createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { Divider, Stack } from "styled-system/jsx";
import { TransactionDisplay } from "~/components/chain/transaction-display";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";
import { useBlockchain } from "~/lib/blockchain-context";

const MempoolDisplay: Component = () => {
	const mempool = useBlockchain().store.mempool;
	const [store, setStore] = createStore<{ selected: boolean[] }>({
		selected: [],
	});
	const selectedCount = createMemo(() =>
		store.selected.reduce((acc, x) => (x ? acc + 1 : acc), 0),
	);

	createEffect(() => {
		setStore("selected", new Array(mempool.length).fill(false));
	});

	return (
		<Stack>
			<For each={mempool}>
				{(transaction, i) => (
					<Card.Root flexDirection="row">
						<TransactionDisplay transaction={transaction} />
						<Checkbox
							size="lg"
							marginX="3"
							checked={store.selected[i()]}
							onCheckedChange={(e) => {
								setStore("selected", i(), !!e.checked);
							}}
						/>
					</Card.Root>
				)}
			</For>
			<Button width="full" disabled={selectedCount() === 0}>
				Mine Block with {selectedCount()} Transactions
			</Button>
		</Stack>
	);
};

export default function MempoolPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Mempool
			</Heading>
			<Stack>
				<Heading as="h2" textStyle="2xl">
					Mine Block
				</Heading>
				<Text color="fg.subtle">
					Mine a block with the chosen transactions, but does not broadcast it
					to the network.
				</Text>
			</Stack>
			<MempoolDisplay />
			<Divider />
			<Stack>
				<Heading as="h2" textStyle="2xl">
					Broadcast Block
				</Heading>
				<Text color="fg.subtle">
					Broadcast a pre-mined block to the network.
				</Text>
			</Stack>
		</Stack>
	);
}
