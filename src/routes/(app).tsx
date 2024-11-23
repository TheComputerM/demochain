import { A, type RouteSectionProps } from "@solidjs/router";
import {
	IconLogout,
	IconPick,
	IconTerminal2,
	IconTopologyFull,
	IconWallet,
} from "@tabler/icons-solidjs";
import { For } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "styled-system/css";
import { Container, Flex, Stack } from "styled-system/jsx";
import ThemeSwitcher from "~/components/theme-switcher";
import { IconButton } from "~/components/ui/icon-button";
import { Tooltip } from "~/components/ui/tooltip";
import { RoomProvider } from "~/lib/room";

export default function AppLayout(props: RouteSectionProps) {
	const routes = [
		{ icon: IconWallet, id: "user", label: "Wallet" },
		{ icon: IconTopologyFull, id: "network", label: "Network" },
		{ icon: IconPick, id: "mempool", label: "Mempool" },
		{ icon: IconTerminal2, id: "console", label: "Console" },
	];
	return (
		<Flex height="screen">
			<aside
				class={css({
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					top: 0,
					position: "sticky",
					bottom: 0,
					backgroundColor: "bg.default",
					paddingBlock: 1,
					paddingInline: 1,
					borderColor: "border.subtle",
					borderRight: "1px solid",
				})}
			>
				<Stack gap="2">
					<For each={routes}>
						{(route) => (
							<Tooltip.Root
								openDelay={100}
								positioning={{ placement: "right" }}
							>
								<Tooltip.Trigger
									asChild={(forwardProps) => (
										<IconButton
											{...forwardProps()}
											variant={
												props.location.pathname.includes(route.id)
													? "subtle"
													: "ghost"
											}
											asChild={(forwardProps) => (
												<A {...forwardProps()} href={`/${route.id}`}>
													<route.icon />
												</A>
											)}
										/>
									)}
								/>
								<Portal>
									<Tooltip.Positioner>
										<Tooltip.Content>{route.label}</Tooltip.Content>
									</Tooltip.Positioner>
								</Portal>
							</Tooltip.Root>
						)}
					</For>
				</Stack>
				<Stack gap="1">
					<ThemeSwitcher />
					<IconButton
						asChild={(forwardProps) => (
							<A {...forwardProps()} href="/">
								<IconLogout />
							</A>
						)}
					/>
				</Stack>
			</aside>
			<Container mt="3" width="full">
				<RoomProvider>{props.children}</RoomProvider>
			</Container>
		</Flex>
	);
}
