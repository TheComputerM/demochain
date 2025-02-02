import { For, Show } from "solid-js";
import { Divider, Grid, HStack, Stack } from "styled-system/jsx";
import { selfId } from "trystero/firebase";
import { SyncDialog } from "~/components/chain/network-sync";
import { PeerDisplay } from "~/components/chain/peer-display";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { useBlockchain } from "~/lib/blockchain-context";

function NetworkSettings() {
	const blockchain = useBlockchain();
	const connectedPeers = () => blockchain.peers.size;

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
					<Table.Header>Connected peers</Table.Header>
					<Table.Cell>{connectedPeers()}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	);
}

function PeerGrid() {
	const wallets = useBlockchain().peers;
	return (
		<Show
			when={wallets.size > 0}
			fallback={
				<EmptyPlaceholder
					title="No peers :("
					description="Open another tab or ask someone to join the network using the same network id."
				/>
			}
		>
			<Grid columns={{ base: 1, md: 2, xl: 3 }}>
				<For each={Array.from(wallets.keys())}>
					{(peerId) => (
						<Card.Root p="4">
							<PeerDisplay peerId={peerId} />
						</Card.Root>
					)}
				</For>
			</Grid>
		</Show>
	);
}

export default function NetworkPage() {
	return (
		<Stack gap="6">
			<HStack justify="space-between">
				<Heading as="h1" textStyle="4xl">
					Network
				</Heading>
				<SyncDialog />
			</HStack>
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
