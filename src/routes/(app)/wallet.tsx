import { Stack } from "styled-system/jsx";
import { KeyDisplay } from "~/components/chain/key-display";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { useBlockchain } from "~/lib/blockchain-context";
import { useWallet } from "~/lib/wallet-context";

export default function WalletPage() {
	const blockchain = useBlockchain();
	const wallet = useWallet();
	const balance = () => blockchain.getBalance(wallet.raw.public);

	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Wallet
			</Heading>
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Header>Public Key</Table.Header>
						<Table.Cell>
							<KeyDisplay value={wallet.raw.public} />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Private Key</Table.Header>
						<Table.Cell overflow="hidden" textOverflow="ellipsis" maxWidth="0">
							<KeyDisplay value={wallet.raw.private} />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Balance</Table.Header>
						<Table.Cell>{balance()}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Stack>
	);
}
