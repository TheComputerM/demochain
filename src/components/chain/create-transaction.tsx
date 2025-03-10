import { createForm } from "@tanstack/solid-form";
import { HStack } from "styled-system/jsx";
import { hexToUint8Array } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import { Transaction } from "~/lib/blockchain/transaction";
import { useWallet } from "~/lib/wallet-context";
import TablerTransfer from "~icons/tabler/transfer";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Field } from "../ui/field";
import { Link } from "../ui/link";

export const CreateTransaction = () => {
	const wallet = useWallet();
	const blockchain = useBlockchain();

	type TransactionForm = {
		nonce: number;
		wallet: string;
		gas: number;
		amount: number;
	};

	const initialValues = {
		nonce: blockchain.getLatestTransactionNonce(wallet.public) + 1,
		wallet: "",
		gas: 2,
		amount: 10,
	};

	const form = createForm(() => ({
		defaultValues: {
			nonce: blockchain.getLatestTransactionNonce(wallet.public) + 1,
			wallet: "",
			gas: 2,
			amount: 10,
		},
		onSubmit: async ({ value }) => {
			const recipient = hexToUint8Array(value.wallet);
			const transaction = Transaction.create({
				nonce: value.nonce,
				sender: wallet.public,
				recipient,
				amount: value.amount,
				gasFees: value.gas,
			});

			await transaction.sign(wallet.private);
			blockchain.addTransaction(transaction);

			form.reset();
			form.setFieldValue("nonce", value.nonce + 1);
		},
	}));

	return (
		<Card.Root height="min-content">
			<Card.Header>
				<Card.Title>Create Transaction</Card.Title>
				<Card.Description>
					This does not broadcast the transaction to the network, it just adds
					it to your mempool.
				</Card.Description>
			</Card.Header>
			<form
				style={{ display: "contents" }}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<Card.Body gap="3">
					<form.Field
						name="nonce"
						validators={{
							onChange: ({ value }) =>
								value < 1 ? "Nonce should be greater than 0" : undefined,
						}}
					>
						{(field) => (
							<Field.Root invalid={field().state.meta.errors.length > 0}>
								<Field.Label>Nonce</Field.Label>
								<Field.Input
									id={field().name}
									name={field().name}
									value={field().state.value}
									onBlur={field().handleBlur}
									onInput={(e) =>
										field().handleChange(Number.parseInt(e.target.value))
									}
									type="number"
								/>
								<Field.HelperText>
									Nonce is the number of transactions you have sent. Similar to
									the{" "}
									<Link href="https://blog.thirdweb.com/nonce-ethereum/">
										nonce in ethereum transactions.
									</Link>
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
									if (bytes.byteLength !== 32)
										throw new Error("Invalid length of Ed25519 key");
								} catch (error) {
									if (error instanceof Error) {
										return error.message;
									}
									return "Invalid public key";
								}
							},
						}}
					>
						{(field) => (
							<Field.Root invalid={field().state.meta.errors.length > 0}>
								<Field.Label>Recipient public key</Field.Label>
								<Field.Input
									id={field().name}
									name={field().name}
									value={field().state.value}
									onBlur={field().handleBlur}
									onInput={(e) => field().handleChange(e.target.value)}
								/>
								<Field.HelperText>
									Public key of the wallet you want to send crypto to.
								</Field.HelperText>
								<Field.ErrorText>
									{field().state.meta.errors.join(", ")}
								</Field.ErrorText>
							</Field.Root>
						)}
					</form.Field>
					<HStack alignItems="start">
						<form.Field
							name="gas"
							validators={{
								onChange: ({ value }) =>
									value < 1 ? "Gas fees should be greater than 0" : undefined,
							}}
						>
							{(field) => (
								<Field.Root
									invalid={field().state.meta.errors.length > 0}
									flexGrow="1"
								>
									<Field.Label>Gas</Field.Label>
									<Field.Input
										id={field().name}
										name={field().name}
										value={field().state.value}
										onBlur={field().handleBlur}
										onInput={(e) =>
											field().handleChange(Number.parseInt(e.target.value))
										}
										type="number"
									/>
									<Field.HelperText>
										Coins to give to the miner as an incentive.
									</Field.HelperText>
									<Field.ErrorText>
										{field().state.meta.errors.join(", ")}
									</Field.ErrorText>
								</Field.Root>
							)}
						</form.Field>
						<form.Field
							name="amount"
							validators={{
								onChange: ({ value }) =>
									value < 1 ? "Amount should be greater than 0" : undefined,
							}}
						>
							{(field) => (
								<Field.Root
									invalid={field().state.meta.errors.length > 0}
									flexGrow="1"
								>
									<Field.Label>Amount</Field.Label>
									<Field.Input
										id={field().name}
										name={field().name}
										value={field().state.value}
										onBlur={field().handleBlur}
										onInput={(e) =>
											field().handleChange(Number.parseInt(e.target.value))
										}
										type="number"
									/>
									<Field.HelperText>
										Amount of coins to send to the recipient.
									</Field.HelperText>
									<Field.ErrorText>
										{field().state.meta.errors.join(", ")}
									</Field.ErrorText>
								</Field.Root>
							)}
						</form.Field>
					</HStack>
				</Card.Body>
				<Card.Footer>
					<Button>
						Create
						<TablerTransfer />
					</Button>
				</Card.Footer>
			</form>
		</Card.Root>
	);
};
