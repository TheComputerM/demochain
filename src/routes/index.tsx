import { Center } from "styled-system/jsx";
import { Button } from "~/components/ui/button";

export default function Home() {
	return (
		<Center height="screen">
			<Button
				size="2xl"
				asChild={(forwardProps) => <a {...forwardProps()} href="/user" />}
			>
				Enter the App
			</Button>
		</Center>
	);
}
