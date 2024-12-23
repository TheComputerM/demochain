import { encode } from "cbor2";
import { type Component, For, Show, createMemo } from "solid-js";
import { Divider, HStack } from "styled-system/jsx";
import { areUint8ArraysEqual } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import type { Transaction } from "~/lib/blockchain/transaction";
import { logger } from "~/lib/logger";
import { RoomEvent, useRoom } from "~/lib/room-context";
import { useWallet } from "~/lib/wallet-context";
import TablerBroadcast from "~icons/tabler/broadcast";
import { EmptyPlaceholder } from "../empty-placeholder";
import { Card } from "../ui/card";
import { IconButton } from "../ui/icon-button";
import { TransactionDisplay } from "./transaction-display";

const TransactionEntry: Component<{ transaction: Transaction }> = (props) => {
	const room = useRoom();
	const broadcastTransaction = room.makeAction(RoomEvent.TRANSACTION)[0];

	const broadcast = async () => {
		await broadcastTransaction(encode(props.transaction));
		logger.info(
			`broadcasted transaction:${props.transaction.nonce} to the network`,
		);
	};

	return (
		<HStack>
			<TransactionDisplay transaction={props.transaction} />
			<IconButton onClick={broadcast}>
				<TablerBroadcast />
			</IconButton>
		</HStack>
	);
};

export const BroadcastTransaction: Component = () => {
	const wallet = useWallet();
	const mempool = useBlockchain().store.mempool;
	const transactions = createMemo(() =>
		mempool.filter((transaction) =>
			areUint8ArraysEqual(transaction.sender, wallet.public),
		),
	);
	return (
		<Card.Root height="min-content">
			<Card.Header>
				<Card.Title>Broadcast Transaction</Card.Title>
				<Card.Description>
					This will broadcast the selected transaction to the network.
				</Card.Description>
			</Card.Header>
			<Card.Body gap="3" maxHeight="md" overflowY="auto">
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
						{(transaction, i) => (
							<>
								<Show when={i() > 0}>
									<Divider />
								</Show>
								<TransactionEntry transaction={transaction} />
							</>
						)}
					</For>
				</Show>
			</Card.Body>
		</Card.Root>
	);
};
