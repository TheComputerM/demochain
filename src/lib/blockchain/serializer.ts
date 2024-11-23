import { Tag, decode } from "cbor2";
import { encode, registerEncoder } from "cbor2/encoder";
import { Block } from "./block";
import { Transaction } from "./transaction";

// Serialization for Transaction class
registerEncoder(Transaction, (b, _writer, _options) => [
	64000,
	[b.sender, b.recipient, b.amount],
]);
Tag.registerDecoder(
	64000,
	({ contents }) =>
		new Transaction(...(contents as ConstructorParameters<typeof Transaction>)),
);

// Serialization for Block class
registerEncoder(Block, (b, _writer, _options) => [
	64001,
	[b.index, b.timestamp, b.hash, b.previousHash, b.nonce, b.transactions],
]);
Tag.registerDecoder(
	64001,
	({ contents }) =>
		new Block(...(contents as ConstructorParameters<typeof Block>)),
);

export function serialize(value: unknown) {
	return encode(value);
}

export function deserialize<T>(buffer: Uint8Array): T {
	return decode(buffer);
}