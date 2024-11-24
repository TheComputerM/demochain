import { Stack } from "styled-system/jsx";
import { selfId } from "trystero";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { TransactionForm } from "~/components/wallet/transaction";
import { useBlockchain } from "~/lib/blockchain-context";

const walletBalance = () => {
	const blocks = useBlockchain().store.blocks;
	const balance = () =>
		blocks
			.flatMap((block) => block.transactions)
			.reduce((acc, tx) => {
				if (tx.recipient === selfId) return acc + tx.amount;
				if (tx.sender === selfId) return acc - tx.amount;
				return acc;
			}, 0);
	return balance;
};

export default function UserPage() {
	const balance = walletBalance();
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Wallet
			</Heading>
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Header>ID</Table.Header>
						<Table.Cell>{selfId}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Balance</Table.Header>
						<Table.Cell>{balance()}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>

			<Heading as="h2" textStyle="2xl">
				Create Transaction
			</Heading>
			<TransactionForm />
		</Stack>
	);
}
