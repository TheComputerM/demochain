import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import { Box, HStack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Tabs } from "~/components/ui/tabs";

export default function AppLayout(props: RouteSectionProps) {
	const navigate = useNavigate();

	return (
		<>
			<Tabs.Root
				variant="enclosed"
				defaultValue={props.location.pathname.split("/").at(-1)}
				onValueChange={({ value }) => {
					navigate(`/app/${value}`);
				}}
			>
				<Tabs.List>
					<Tabs.Trigger value="user">User</Tabs.Trigger>
					<Tabs.Trigger value="console">Console</Tabs.Trigger>
					<Tabs.Indicator />
          <HStack ml="auto">
            <Button size="sm" variant="subtle">Exit</Button>
          </HStack>
				</Tabs.List>
			</Tabs.Root>
			{props.children}
		</>
	);
}
