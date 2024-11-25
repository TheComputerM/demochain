import { makeEventListener } from "@solid-primitives/event-listener";
import { createSignal } from "solid-js";
import { Divider, Stack } from "styled-system/jsx";
import { BlockchainDisplay } from "~/components/chain/blockchain";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";
import { useBlockchain } from "~/lib/blockchain-context";
import { useRoom } from "~/lib/room";

function getConnectedPeers() {
	const room = useRoom();
	const [peers, setPeers] = createSignal(Object.keys(room.getPeers()).length);
	makeEventListener(window, "peer-join", () => setPeers((x) => x + 1));
	makeEventListener(window, "peer-leave", () => setPeers((x) => x - 1));
	return peers;
}

function NetworkSettings() {
	const blockchain = useBlockchain();
	const connectedPeers = getConnectedPeers();

	return (
		<Table.Root>
			<Table.Body>
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

export default function NetworkPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Network
			</Heading>
			<Heading as="h2" textStyle="2xl">
				Settings
			</Heading>
			<NetworkSettings />
			<Divider my="3" />
			<Heading as="h2" textStyle="2xl">
				Chain
			</Heading>
			<BlockchainDisplay />
		</Stack>
	);
}
