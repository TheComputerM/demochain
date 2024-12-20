import {
	type SubmitHandler,
	createForm,
	custom,
	maxLength,
	minLength,
	required,
	setValues,
} from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { css } from "styled-system/css";
import { Center, Container, Divider, HStack, Stack } from "styled-system/jsx";
import { GridPattern } from "~/components/mystic/grid-pattern";
import ThemeSwitcher from "~/components/theme-switcher";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import TablerBrandGithub from "~icons/tabler/brand-github";

function EntryForm() {
	const navigate = useNavigate();

	type SettingsForm = {
		network: string;
		wallet: string;
	};

	const [form, { Form, Field: FormField }] = createForm<SettingsForm>();

	onMount(() => {
		setValues(form, {
			network: sessionStorage.getItem("network") ?? "",
			wallet: sessionStorage.getItem("wallet") ?? "",
		});
	});

	const handleSubmit: SubmitHandler<SettingsForm> = (values, event) => {
		sessionStorage.setItem("network", values.network);
		sessionStorage.setItem("wallet", values.wallet);
		navigate("/console");
	};

	return (
		<Container maxWidth="md" width="full" zIndex={5}>
			<Form style={{ display: "contents" }} onSubmit={handleSubmit}>
				<Stack
					gap="3"
					backgroundColor="bg.default"
					borderWidth="1"
					borderRadius="l2"
					p="4"
				>
					<FormField
						name="network"
						validate={[
							required("Network ID is required"),
							minLength(4, "Network ID should be at least 4 characters"),
							maxLength(12, "Network ID should be at most 12 characters"),
							custom(
								(value) =>
									!value?.includes(" ") && value === value?.toLowerCase(),
								"Network ID should be snake_case",
							),
						]}
					>
						{(field, props) => (
							<Field.Root invalid={field.error.length > 0}>
								<Field.Label>Network Code*</Field.Label>
								<Field.Input
									{...props}
									value={field.value}
									type="text"
									placeholder="random_code"
								/>
								<Field.HelperText>
									Share and use it to connect to the same network
								</Field.HelperText>
								<Field.ErrorText>{field.error}</Field.ErrorText>
							</Field.Root>
						)}
					</FormField>
					<FormField name="wallet">
						{(field, props) => (
							<Field.Root invalid={field.error.length > 0}>
								<Field.Label>Wallet Seed</Field.Label>
								<Field.Input
									{...props}
									value={field.value}
									type="text"
									placeholder="passphrase"
								/>
								<Field.HelperText>
									Seed used to generate your keys
								</Field.HelperText>
								<Field.ErrorText>{field.error}</Field.ErrorText>
							</Field.Root>
						)}
					</FormField>
					<Divider />
					<Button size="2xl" type="submit">
						Enter the App
					</Button>
				</Stack>
			</Form>
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
