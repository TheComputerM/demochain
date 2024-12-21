import { Grid, Stack } from "styled-system/jsx";
import { Balance } from "~/components/chain/balance";
import { BroadcastTransaction } from "~/components/chain/broadcast-transaction";
import { CreateTransaction } from "~/components/chain/create-transaction";
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
							<KeyDisplay value={wallet.raw.private!} />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Balance</Table.Header>
						<Table.Cell>
							<Balance>{balance()}</Balance>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
			<Grid columns={{ base: 1, lg: 2 }} alignItems="self-start">
				<CreateTransaction />
				<BroadcastTransaction />
			</Grid>
		</Stack>
	);
}
