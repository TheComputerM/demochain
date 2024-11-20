import { TbAccessPoint } from "solid-icons/tb";
import { createSignal } from "solid-js";
import { HStack, Stack } from "styled-system/jsx";
import { Badge } from "~/components/ui/badge";
import { Heading } from "~/components/ui/heading";
import { useRoom } from "~/lib/room";

const ConnectedPeers = () => {
	const room = useRoom();
	const [peers, setPeers] = createSignal(Object.keys(room.getPeers()).length);

	room.onPeerJoin(() => setPeers((prev) => prev + 1));
	room.onPeerLeave(() => setPeers((prev) => prev - 1));

	return (
		<Badge variant="solid">{peers()} Connected <TbAccessPoint /></Badge>
	);
}

export default function NetworkPage() {
	return (
		<Stack>
			<HStack justify="space-between">
				<Heading as="h1" textStyle="4xl">
					Network
				</Heading>
				<ConnectedPeers />
			</HStack>
		</Stack>
	);
}
