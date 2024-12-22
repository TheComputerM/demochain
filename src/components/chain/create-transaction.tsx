import {
	type SubmitHandler,
	createForm,
	minRange,
	required,
	reset,
} from "@modular-forms/solid";
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
	const [form, { Form, Field: FormField }] = createForm<TransactionForm>({
		initialValues: {
			nonce: blockchain.getLatestTransactionNonce(wallet.public.key) + 1,
			wallet: "",
			gas: 2,
			amount: 10,
		},
	});

	const handleSubmit: SubmitHandler<TransactionForm> = async (values) => {
		const recipient = hexToUint8Array(values.wallet);
		const transaction = Transaction.create({
			nonce: values.nonce,
			sender: wallet.public.key,
			recipient,
			amount: values.amount,
			gasFees: values.gas,
		});
		await transaction.sign(wallet.private);
		blockchain.addTransaction(transaction);
		reset(form);
	};

	return (
		<Card.Root height="min-content">
			<Card.Header>
				<Card.Title>Create Transaction</Card.Title>
				<Card.Description>
					This does not broadcast the transaction to the network, it just adds
					it to your mempool.
				</Card.Description>
			</Card.Header>
			<Form style={{ display: "contents" }} onSubmit={handleSubmit}>
				<Card.Body gap="3">
					<FormField
						name="nonce"
						type="number"
						validate={[
							required("Nonce cannot be empty"),
							minRange(1, "Nonce should be greater than 0"),
						]}
					>
						{(field, props) => (
							<Field.Root invalid={field.error.length > 0}>
								<Field.Label>Nonce</Field.Label>
								<Field.Input {...props} type="number" value={field.value} />
								<Field.HelperText>
									Nonce is the number of transactions you have sent. Similar to
									the{" "}
									<Link href="https://blog.thirdweb.com/nonce-ethereum/">
										nonce in ethereum transactions.
									</Link>
								</Field.HelperText>
								<Field.ErrorText>{field.error}</Field.ErrorText>
							</Field.Root>
						)}
					</FormField>
					<FormField
						name="wallet"
						validate={required("Wallet Public Key is required")}
					>
						{(field, props) => (
							<Field.Root invalid={field.error.length > 0}>
								<Field.Label>Recipient public key</Field.Label>
								<Field.Input {...props} value={field.value} />
								<Field.HelperText>
									Public key of the wallet you want to send crypto to.
								</Field.HelperText>
								<Field.ErrorText>{field.error}</Field.ErrorText>
							</Field.Root>
						)}
					</FormField>
					<HStack alignItems="start">
						<FormField
							name="gas"
							type="number"
							validate={[
								required("Gas fees cannot be empty"),
								minRange(1, "Gas fees should be greater than 0"),
							]}
						>
							{(field, props) => (
								<Field.Root invalid={field.error.length > 0} flexGrow="1">
									<Field.Label>Gas</Field.Label>
									<Field.Input {...props} type="number" value={field.value} />
									<Field.HelperText>
										Coins to give to the miner as an incentive.
									</Field.HelperText>
									<Field.ErrorText>{field.error}</Field.ErrorText>
								</Field.Root>
							)}
						</FormField>
						<FormField
							name="amount"
							type="number"
							validate={[
								required("Amount cannot be empty"),
								minRange(1, "Amount should be greater than 0"),
							]}
						>
							{(field, props) => (
								<Field.Root invalid={field.error.length > 0} flexGrow="1">
									<Field.Label>Amount</Field.Label>
									<Field.Input {...props} type="number" value={field.value} />
									<Field.HelperText>
										Amount of coins to send to the recipient.
									</Field.HelperText>
									<Field.ErrorText>{field.error}</Field.ErrorText>
								</Field.Root>
							)}
						</FormField>
					</HStack>
				</Card.Body>
				<Card.Footer>
					<Button>
						Create
						<TablerTransfer />
					</Button>
				</Card.Footer>
			</Form>
		</Card.Root>
	);
};
