import { type Component, Suspense, createResource } from "solid-js";
import { HStack } from "styled-system/jsx";
import { useBlockchain } from "~/lib/blockchain-context";
import { useRoom } from "~/lib/room-context";
import TablerRefresh from "~icons/tabler/refresh";
import { IconButton } from "../ui/icon-button";
import { Table } from "../ui/table";
import { KeyDisplay } from "./key-display";

export const PeerDisplay: Component<{
	peerId: string;
}> = (props) => {
	const peers = useBlockchain().peers;
	const peer = peers.get(props.peerId)!;
	const room = useRoom();
	const [ping, { refetch }] = createResource(() => room.ping(props.peerId));

	return (
		<Table.Root size="sm" variant="outline">
			<Table.Body>
				<Table.Row>
					<Table.Header>Peer ID</Table.Header>
					<Table.Cell>{props.peerId}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Header>Public Key</Table.Header>
					<Table.Cell>
						<KeyDisplay value={peer.publicKey.key} />
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Header>Ping</Table.Header>
					<Table.Cell>
						<HStack justify="space-between">
							<Suspense fallback="...">{ping()}ms</Suspense>
							<IconButton size="xs" onClick={refetch}>
								<TablerRefresh />
							</IconButton>
						</HStack>
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	);
};
