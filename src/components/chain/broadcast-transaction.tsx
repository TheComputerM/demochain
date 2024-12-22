import { encode } from "cbor2";
import { type Component, For } from "solid-js";
import { HStack } from "styled-system/jsx";
import { areUint8ArraysEqual } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import type { Transaction } from "~/lib/blockchain/transaction";
import { RoomEvent, useRoom } from "~/lib/room-context";
import { useWallet } from "~/lib/wallet-context";
import TablerBroadcast from "~icons/tabler/broadcast";
import { Card } from "../ui/card";
import { IconButton } from "../ui/icon-button";
import { TransactionDisplay } from "./transaction-display";

const TransactionEntry: Component<{ transaction: Transaction }> = (props) => {
	const room = useRoom();
	const broadcastTransaction = room.makeAction(RoomEvent.TRANSACTION)[0];

	const broadcast = async () => {
		const data = encode(props.transaction);
		const signature = props.transaction.signature;
		await broadcastTransaction(encode([data, signature]));
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
	const transactions = () =>
		mempool.filter((transaction) =>
			areUint8ArraysEqual(transaction.sender, wallet.public.key),
		);
	return (
		<Card.Root height="min-content">
			<Card.Header>
				<Card.Title>Broadcast Transaction</Card.Title>
				<Card.Description>
					This will broadcast the selected transaction to the network.
				</Card.Description>
			</Card.Header>
			<Card.Body gap="2" maxHeight="md" overflowY="auto">
				<For each={transactions()}>
					{(transaction) => <TransactionEntry transaction={transaction} />}
				</For>
			</Card.Body>
		</Card.Root>
	);
};
