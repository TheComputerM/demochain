import { useNavigate } from "@solidjs/router";
import { createForm } from "@tanstack/solid-form";
import { css } from "styled-system/css";
import { Center, Container, Divider, HStack, Stack } from "styled-system/jsx";
import { hexToUint8Array } from "uint8array-extras";
import { GridPattern } from "~/components/mystic/grid-pattern";
import ThemeSwitcher from "~/components/theme-switcher";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import TablerBrandGithub from "~icons/tabler/brand-github";

function EntryForm() {
	const navigate = useNavigate();

	const form = createForm(() => ({
		defaultValues: {
			network: sessionStorage.getItem("network") ?? "",
			wallet: sessionStorage.getItem("wallet") ?? "",
		},
		onSubmit: async ({ value }) => {
			sessionStorage.setItem("network", value.network);
			sessionStorage.setItem("wallet", value.wallet);
			navigate("/blockchain");
		},
	}));

	return (
		<Container maxWidth="md" width="full" zIndex={5}>
			<form
				style={{ display: "contents" }}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<Stack
					gap="3"
					backgroundColor="bg.default"
					borderWidth="1"
					borderRadius="l2"
					p="4"
				>
					<form.Field
						name="network"
						validators={{
							onChange: ({ value }) =>
								value.length < 4
									? "Network code must be at least 4 characters long"
									: value.length > 12
										? "Network code must be at most 12 characters long"
										: undefined,
						}}
					>
						{(field) => (
							<Field.Root invalid={field().state.meta.errors.length > 0}>
								<Field.Label for={field().name}>Network Code*</Field.Label>
								<Field.Input
									id={field().name}
									name={field().name}
									onBlur={field().handleBlur}
									value={field().state.value}
									type="text"
									placeholder="random_code"
									onInput={(e) => field().handleChange(e.target.value)}
								/>
								<Field.HelperText>
									Share and use it to connect to the same network
								</Field.HelperText>
								<Field.ErrorText>
									{field().state.meta.errors.join(", ")}
								</Field.ErrorText>
							</Field.Root>
						)}
					</form.Field>
					<form.Field
						name="wallet"
						validators={{
							onChange: ({ value }) => {
								try {
									const bytes = hexToUint8Array(value);
									if (bytes.byteLength !== 32 && bytes.byteLength !== 0)
										throw new Error("Invalid length of Ed25519 private key");
								} catch (error) {
									if (error instanceof Error) {
										return error.message;
									}
									return "Invalid private key";
								}
							},
						}}
					>
						{(field) => (
							<Field.Root invalid={field().state.meta.errors.length > 0}>
								<Field.Label for={field().name}>Private key</Field.Label>
								<Field.Input
									id={field().name}
									name={field().name}
									value={field().state.value}
									onBlur={field().handleBlur}
									onInput={(e) => field().handleChange(e.target.value)}
									type="text"
								/>
								<Field.HelperText>
									Leave empty if you want to generate a random wallet
								</Field.HelperText>
								<Field.ErrorText>
									{field().state.meta.errors.join(", ")}
								</Field.ErrorText>
							</Field.Root>
						)}
					</form.Field>
					<Divider />
					<Button size="2xl" type="submit">
						Enter the App
					</Button>
				</Stack>
			</form>
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
										<TablerBrandGithub />
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
