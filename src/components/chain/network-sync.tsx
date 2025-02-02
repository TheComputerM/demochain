import { useDialog } from "@ark-ui/solid";
import { decode } from "cbor2";
import { createSignal } from "solid-js";
import { reconcile } from "solid-js/store";
import { For, Portal } from "solid-js/web";
import { Box, Stack, Wrap } from "styled-system/jsx";
import { useBlockchain } from "~/lib/blockchain-context";
import { Blockchain, type BlockchainState } from "~/lib/blockchain/chain";
import { RoomEvent, recieveRoomEvent, sendRoomEvent } from "~/lib/events";
import TablerPackageImport from "~icons/tabler/package-import";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { RadioGroup } from "../ui/radio-group";
import { PeerDisplay } from "./peer-display";

export const SyncDialog = () => {
	const dialog = useDialog();
	const blockchain = useBlockchain();
	const peers = blockchain.peers;

	const [selectedPeer, setSelectedPeer] = createSignal<string | null>();

	const requestState = sendRoomEvent(RoomEvent.REQUEST_STATE);
	const recieveState = recieveRoomEvent(RoomEvent.SYNC_STATE);

	function startSync() {
		if (!selectedPeer()) {
			throw new Error("no peer is selected");
		}
		requestState(new Uint8Array([]), selectedPeer());
	}

	recieveState(async (data) => {
		const blockchainState = decode<BlockchainState>(data);
		if (await Blockchain.validate(blockchainState.blocks)) {
			blockchain.setStore(reconcile(blockchainState));
			dialog().setOpen(false);
		}
	});

	return (
		<Dialog.RootProvider value={dialog}>
			<Dialog.Trigger
				asChild={(triggerProps) => (
					<Button {...triggerProps()}>
						Sync with Network <TablerPackageImport />
					</Button>
				)}
			/>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Stack gap="8" p="6">
							<Stack gap="1">
								<Dialog.Title>Sync with peer</Dialog.Title>
								<Dialog.Description>
									Choose a peer to sync network data with.
								</Dialog.Description>
							</Stack>
							<RadioGroup.Root
								value={selectedPeer()}
								onValueChange={(e) => setSelectedPeer(e.value)}
							>
								<Wrap
									maxWidth="4xl"
									maxHeight="sm"
									overflowY="auto"
									justify="center"
								>
									<For each={Array.from(peers.entries())}>
										{([peerId, data]) => (
											<Box
												borderWidth="1px"
												paddingRight="2"
												borderColor={
													selectedPeer() === peerId
														? "colorPalette.default"
														: "border.default"
												}
											>
												<RadioGroup.Item value={peerId}>
													<PeerDisplay peerId={peerId} />
													<RadioGroup.ItemControl />
													<RadioGroup.ItemHiddenInput />
												</RadioGroup.Item>
											</Box>
										)}
									</For>
								</Wrap>
							</RadioGroup.Root>
							<Stack gap="3" direction="row" width="full">
								<Button
									width="full"
									onClick={startSync}
									disabled={!selectedPeer()}
								>
									Sync
								</Button>
							</Stack>
						</Stack>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.RootProvider>
	);
};
