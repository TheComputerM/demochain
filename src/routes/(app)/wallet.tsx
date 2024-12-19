import { Stack } from "styled-system/jsx";
import { selfId } from "trystero/firebase";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { TransactionForm } from "~/components/wallet/transaction";
import { useBlockchain } from "~/lib/blockchain-context";

export default function WalletPage() {
	const blockchain = useBlockchain();
	const balance = () => blockchain.getBalance(selfId);

	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Wallet
			</Heading>
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Header>Balance</Table.Header>
						<Table.Cell>{balance()}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
			<TransactionForm />
		</Stack>
	);
}
