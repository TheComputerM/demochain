import { type Component, For, createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { Stack } from "styled-system/jsx";
import { TransactionDisplay } from "~/components/chain/transaction-display";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { useBlockchain } from "~/lib/blockchain-context";
import { Block } from "~/lib/blockchain/block";
import { useWallet } from "~/lib/wallet-context";

export const MineBlock: Component = () => {
	const blockchain = useBlockchain();
	const wallet = useWallet();
	const mempool = blockchain.store.mempool;
	const [store, setStore] = createStore<{ selected: boolean[] }>({
		selected: [],
	});
	const selectedCount = createMemo(() =>
		store.selected.reduce((acc, x) => (x ? acc + 1 : acc), 0),
	);

	createEffect(() => {
		setStore("selected", new Array(mempool.length).fill(false));
	});

	async function mineBlock() {
		const transactions = mempool.filter((_, i) => store.selected[i]);
		const block = await Block.create({
			index: blockchain.store.blocks.length,
			previousHash: blockchain.store.blocks.at(-1)!.hash,
			transactions,
			minedBy: wallet.public.key,
		});
		await block.mine(blockchain.store.settings.difficulty);
		await block.sign(wallet.private);
		blockchain.appendBlock(block);
	}

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
			<Button width="full" disabled={selectedCount() === 0} onClick={mineBlock}>
				Mine Block with {selectedCount()} Transactions
			</Button>
		</Stack>
	);
};
