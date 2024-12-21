import { Clipboard } from "@ark-ui/solid";
import { type ParentComponent, splitProps } from "solid-js";
import TablerCopy from "~icons/tabler/copy";
import TablerCopyCheck from "~icons/tabler/copy-check";
import { Button } from "../ui/button";
import type { ButtonProps } from "./styled/button";

interface CopyButtonProps extends ButtonProps {
	value: string;
}

export const CopyButton: ParentComponent<CopyButtonProps> = (props) => {
	const [localProps, forwardProps] = splitProps(props, ["value"]);
	return (
		<Clipboard.Root value={localProps.value}>
			<Clipboard.Trigger
				asChild={(triggerProps) => (
					<Button {...triggerProps()} size="xs" {...forwardProps}>
						{props.children}
						<Clipboard.Indicator copied={<TablerCopyCheck />}>
							<TablerCopy />
						</Clipboard.Indicator>
					</Button>
				)}
			/>
		</Clipboard.Root>
	);
};
