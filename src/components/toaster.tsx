import type { Component } from "solid-js";
import { IconButton } from "~/components/ui/icon-button";
import { Toast } from "~/components/ui/toast";
import TablerX from "~icons/tabler/x";

export const toaster = Toast.createToaster({
	placement: "bottom-end",
	overlap: true,
	gap: 16,
});

export const ToasterContainer: Component = () => {
	return (
		<Toast.Toaster toaster={toaster}>
			{(toast) => (
				<Toast.Root>
					<Toast.Title>{toast().title}</Toast.Title>
					<Toast.Description>{toast().description}</Toast.Description>
					<Toast.CloseTrigger
						asChild={(closeProps) => (
							<IconButton {...closeProps()} size="sm" variant="link">
								<TablerX />
							</IconButton>
						)}
					/>
				</Toast.Root>
			)}
		</Toast.Toaster>
	);
};
