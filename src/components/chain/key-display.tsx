import type { Component } from "solid-js";
import { uint8ArrayToHex } from "uint8array-extras";
import { Clipboard } from "~/components/ui/clipboard";
import { IconButton } from "~/components/ui/icon-button";
import { Input } from "~/components/ui/input";
import TablerCopy from "~icons/tabler/copy";
import TablerCopyCheck from "~icons/tabler/copy-check";

export const KeyDisplay: Component<{ value: Uint8Array }> = (props) => {
	return (
		<Clipboard.Root value={uint8ArrayToHex(props.value)}>
			<Clipboard.Control gap="1">
				<Clipboard.Input
					asChild={(inputProps) => <Input size="xs" {...inputProps()} />}
				/>
				<Clipboard.Trigger
					asChild={(triggerProps) => (
						<IconButton variant="outline" size="xs" {...triggerProps()}>
							<Clipboard.Indicator copied={<TablerCopyCheck />}>
								<TablerCopy />
							</Clipboard.Indicator>
						</IconButton>
					)}
				/>
			</Clipboard.Control>
		</Clipboard.Root>
	);
};
