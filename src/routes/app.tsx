import { A, type RouteSectionProps } from "@solidjs/router";
import { TbLogout, TbTerminal2, TbWallet } from "solid-icons/tb";
import { For } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "styled-system/css";
import { Container, Flex, Stack } from "styled-system/jsx";
import { IconButton } from "~/components/ui/icon-button";
import { Tooltip } from "~/components/ui/tooltip";

export default function AppLayout(props: RouteSectionProps) {
	const routes = [
		{ icon: TbWallet, id: "user", label: "Wallet" },
		{ icon: TbTerminal2, id: "console", label: "Console" },
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
					borderColor: "border.default",
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
												<A {...forwardProps()} href={`/app/${route.id}`}>
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
				<Stack>
					<IconButton>
						<TbLogout />
					</IconButton>
				</Stack>
			</aside>
			<Container width="full">{props.children}</Container>
		</Flex>
	);
}
