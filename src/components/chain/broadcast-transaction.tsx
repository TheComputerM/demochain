import { type Component, For, Show, createMemo } from "solid-js";
import { Flex, Stack } from "styled-system/jsx";
import { areUint8ArraysEqual } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import { actions } from "~/lib/events";
import { useWallet } from "~/lib/wallet-context";
import TablerBroadcast from "~icons/tabler/broadcast";
import { EmptyPlaceholder } from "../empty-placeholder";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { TransactionDisplay } from "./transaction-display";

export const BroadcastTransaction: Component = () => {
	const wallet = useWallet();
	const mempool = useBlockchain().store.mempool;
	const transactions = createMemo(() =>
		mempool.filter((transaction) =>
			areUint8ArraysEqual(transaction.sender, wallet.public),
		),
	);
	return (
		<Stack gap="6">
			<Stack>
				<Heading as="h2" textStyle="2xl">
					Broadcast Transaction
				</Heading>
				<Text color="fg.subtle">
					This will broadcast the selected transaction to the network.
				</Text>
			</Stack>
			<Show
				when={transactions().length > 0}
				fallback={
					<EmptyPlaceholder
						title="No transactions"
						description="Create transactions inorder to broadcast them to the network."
					/>
				}
			>
				<For each={transactions()}>
					{(transaction) => (
						<Card.Root>
							<Flex direction="column">
								<Button
									variant="subtle"
									onClick={() => actions.broadcastTransaction(transaction)}
									borderBottomRadius="0"
								>
									Broadcast <TablerBroadcast />
								</Button>
								<TransactionDisplay transaction={transaction} />
							</Flex>
						</Card.Root>
					)}
				</For>
			</Show>
		</Stack>
	);
};
