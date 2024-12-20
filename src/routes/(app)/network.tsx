import { type Component, For, Suspense, createResource } from "solid-js";
import { Divider, Grid, HStack, Stack } from "styled-system/jsx";
import { selfId } from "trystero/firebase";
import { KeyDisplay } from "~/components/chain/key-display";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import { Table } from "~/components/ui/table";
import { useBlockchain } from "~/lib/blockchain-context";
import { useRoom } from "~/lib/room-context";
import TablerRefresh from "~icons/tabler/refresh";

function NetworkSettings() {
	const blockchain = useBlockchain();
	const connectedPeers = () => Object.keys(blockchain.store.wallets).length;

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

const PeerCard: Component<{ peerId: string; key: Uint8Array }> = (props) => {
	const room = useRoom();
	const [ping, { refetch }] = createResource(() => room.ping(props.peerId));

	return (
		<Card.Root p="4" gap="2">
			<Table.Root size="sm">
				<Table.Body>
					<Table.Row>
						<Table.Header>Peer ID</Table.Header>
						<Table.Cell>{props.peerId}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Public Key</Table.Header>
						<Table.Cell>
							<KeyDisplay value={props.key} />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Header>Ping</Table.Header>
						<Table.Cell>
							<HStack>
								<Suspense fallback="...">{ping()}ms</Suspense>
								<IconButton size="xs" onClick={refetch}>
									<TablerRefresh />
								</IconButton>
							</HStack>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Root>
	);
};

function PeerGrid() {
	const blockchain = useBlockchain();
	const wallets = blockchain.store.wallets;
	return (
		<Grid columns={{ base: 1, md: 2, xl: 3 }}>
			<For each={Object.entries(wallets)}>
				{([peerId, data]) => <PeerCard peerId={peerId} key={data.raw.public} />}
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
