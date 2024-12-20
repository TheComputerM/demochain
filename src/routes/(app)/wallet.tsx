import { type Component, createResource } from "solid-js";
import { Stack } from "styled-system/jsx";
import { selfId } from "trystero/firebase";
import { Clipboard } from "~/components/ui/clipboard";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import { Input } from "~/components/ui/input";
import { Table } from "~/components/ui/table";
import { TransactionForm } from "~/components/wallet/transaction";
import { useBlockchain } from "~/lib/blockchain-context";
import { Wallet } from "~/lib/blockchain/wallet";
import { useWallet } from "~/lib/wallet-context";
import TablerCopy from "~icons/tabler/copy";
import TablerCopyCheck from "~icons/tabler/copy-check";

const KeyDisplay: Component<{ value?: string }> = (props) => {
	return (
		<Clipboard.Root value={props.value}>
			<Clipboard.Control>
				<Clipboard.Input
					asChild={(inputProps) => <Input size="xs" {...inputProps()} />}
				/>
				<Clipboard.Trigger
					asChild={(triggerProps) => (
						<IconButton variant="outline" size="xs" {...triggerProps()}>
							<Clipboard.Indicator copied={<TablerCopyCheck />}>
								<TablerCopy />
							</Clipboard.Indicator>
						</IconButton>
					)}
				/>
			</Clipboard.Control>
		</Clipboard.Root>
	);
};

export default function WalletPage() {
	const blockchain = useBlockchain();
	const balance = () => blockchain.getBalance(selfId);
	const wallet = useWallet();
	const [keys] = createResource(
		async () =>
			await Promise.all([
				Wallet.exportHex(wallet.public),
				Wallet.exportHex(wallet.private),
			]),
	);

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
							<KeyDisplay value={keys()?.[0]} />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Private Key</Table.Header>
						<Table.Cell overflow="hidden" textOverflow="ellipsis" maxWidth="0">
							<KeyDisplay value={keys()?.[1]} />
						</Table.Cell>
					</Table.Row>
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
