import { useNavigate } from "@solidjs/router";
import { IconBrandGithub } from "@tabler/icons-solidjs";
import { css } from "styled-system/css";
import { Center, Container, Divider, HStack, Stack } from "styled-system/jsx";
import { GridPattern } from "~/components/mystic/grid-pattern";
import ThemeSwitcher from "~/components/theme-switcher";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";

function EntryForm() {
	const navigate = useNavigate();

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const formdata = new FormData(event.target as HTMLFormElement);
		const network = formdata.get("network");
		const wallet = formdata.get("wallet");

		sessionStorage.setItem("network", network as string);

		navigate("/user");
	}

	return (
		<Container maxWidth="md" width="full" zIndex={5}>
			<Stack
				gap="3"
				backgroundColor="bg.default"
				borderWidth="1"
				borderRadius="l2"
				p="4"
			>
				<form style={{ display: "contents" }} onSubmit={handleSubmit}>
					<Field.Root>
						<Field.Label>Network Code*</Field.Label>
						<Field.Input name="network" placeholder="random_code" />
						<Field.HelperText>
							Share and use it to connect to the same network
						</Field.HelperText>
					</Field.Root>
					<Field.Root>
						<Field.Label>Wallet Seed</Field.Label>
						<Field.Input name="wallet" placeholder="passphrase" />
						<Field.HelperText>Seed used to generate your keys</Field.HelperText>
					</Field.Root>
					<Divider />
					<Button size="2xl" type="submit">
						Enter the App
					</Button>
				</form>
			</Stack>
		</Container>
	);
}

export default function HomePage() {
	return (
		<div>
			<Divider py="2">
				<Container>
					<HStack justify="space-between">
						<Heading textStyle="xl">Demochain</Heading>
						<HStack>
							<ThemeSwitcher />
							<IconButton
								variant="ghost"
								asChild={(forwardProps) => (
									<a
										{...forwardProps()}
										href="https://github.com/TheComputerM/demochain"
									>
										<IconBrandGithub />
									</a>
								)}
							/>
						</HStack>
					</HStack>
				</Container>
			</Divider>
			<Center height="lg" position="relative">
				<EntryForm />
				<GridPattern
					x={-10}
					class={css({
						maskImage:
							"radial-gradient(350px circle at center,white,transparent)",
					})}
				/>
			</Center>
		</div>
	);
}
