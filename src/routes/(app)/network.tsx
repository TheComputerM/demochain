import { For } from "solid-js";
import { Divider, Grid, Stack } from "styled-system/jsx";
import { selfId } from "trystero/firebase";
import { PeerDisplay } from "~/components/chain/peer-display";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { useBlockchain } from "~/lib/blockchain-context";

function NetworkSettings() {
	const blockchain = useBlockchain();
	const connectedPeers = () => blockchain.wallets.size;

	return (
		<Table.Root>
			<Table.Body>
				<Table.Row>
					<Table.Header>Network ID</Table.Header>
					<Table.Cell>{sessionStorage.getItem("network")}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Header>Peer ID</Table.Header>
					<Table.Cell>{selfId}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Header>Difficulty</Table.Header>
					<Table.Cell>{blockchain.store.settings.difficulty}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Header>Base reward for mining</Table.Header>
					<Table.Cell>{blockchain.store.settings.baseReward}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Header>Connected peers</Table.Header>
					<Table.Cell>{connectedPeers()}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	);
}

function PeerGrid() {
	const wallets = useBlockchain().wallets;
	return (
		<Grid columns={{ base: 1, md: 2, xl: 3 }}>
			<For each={Array.from(wallets.entries())}>
				{([peerId, wallet]) => (
					<Card.Root p="4">
						<PeerDisplay peerId={peerId} wallet={wallet} />
					</Card.Root>
				)}
			</For>
		</Grid>
	);
}

export default function NetworkPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Network
			</Heading>
			<Heading as="h2" textStyle="2xl">
				Details
			</Heading>
			<NetworkSettings />
			<Divider my="3" />
			<Heading as="h2" textStyle="2xl">
				Peers
			</Heading>
			<PeerGrid />
			<br />
		</Stack>
	);
}
