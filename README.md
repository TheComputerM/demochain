# Demochain

This is a toy blockchain network built for learning and demonstration. It started as a project for a Blockchain course I took at college, but I wanted to build a more *roboust* and *complete* one as a learning exercise. I tried to keep dependencies to a minimum and try to build the network from scratch.

## Tech stack

This network fully runs on your browser, standing on the shoulders of giants such as:

- [Trystero](https://github.com/dmotz/trystero): for the WebRTC p2p networking
- [@noble/ed25519](https://github.com/paulmillr/noble-ed25519): for the encription algorithms used
- [cbor2](https://www.npmjs.com/package/cbor2): for the JS implementation of the CBOR spec.
- [Park UI](https://park-ui.com/): for the UI components
- [SolidJS](https://www.solidjs.com/) and [SolidStart](https://start.solidjs.com/): for making the website itself

## Technical details

> TODO: add more details in a separate doc

- Uses the Ed25519 algorithm for generating wallets.
- Uses WebRTC for peer-2-peer all communication, except peer discovery which happens using a realtime database on firebase.
- Uses PoW for consensus where difficulty is the number of leading 0s in the block's SHA-256 hash.
- Uses the CBOR spec to encode blocks and transactions to send them over the network.
- Can have multiple transactions in a single block.
- Transactions are differentiated using a nonce, like in the ethereum network.
- All transactions and blocks have a signature (of course).

## Future

- Graphs for monitoring network activity.
- Add videos demonstrating common concepts and attacks (such as race attack, finney attack etc...)
- Add handy tool to manipulate blockchain data on your node.
- Change difficulty dynamically.

## Afterword

The project took a considerable bit of effort and research, but it was quite enjoyable. I will continue to push changes when I get free time but there won't be any breaking features as I intend to keep it as rudimentary as possible. Shoot me a DM/mail if you found this project helpful.

```
───────────────────────────────────────────────────────────────────────────────
Language                 Files     Lines   Blanks  Comments     Code Complexity
───────────────────────────────────────────────────────────────────────────────
TypeScript                  83      3218      321        76     2821        179
JSON                         4       109        0         0      109          0
CSS                          1         1        0         0        1          0
Markdown                     1        31       10         0       21          0
TypeScript Typings           1         1        0         1        0          0
gitignore                    1        33        7         6       20          0
───────────────────────────────────────────────────────────────────────────────
Total                       91      3393      338        83     2972        179
───────────────────────────────────────────────────────────────────────────────
Estimated Cost to Develop (organic) $84,780
Estimated Schedule Effort (organic) 5.38 months
Estimated People Required (organic) 1.40
───────────────────────────────────────────────────────────────────────────────
Processed 95003 bytes, 0.095 megabytes (SI)
───────────────────────────────────────────────────────────────────────────────
```