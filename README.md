# psf-bch-wallet

This is a command-line (CLI) app for working with the Bitcoin Cash (BCH) blockchain, and SLP tokens.

This app connects to a [ipfs-bch-wallet-service](https://github.com/Permissionless-Software-Foundation/ipfs-bch-wallet-service) over [IPFS](https://ipfs.io), using the [ipfs-coord](https://github.com/Permissionless-Software-Foundation/ipfs-coord) library. This app uses the [oclif CLI framework](https://oclif.io/).

This app is intended for developers who want to work with the BCH blockchain. It's an integral part of the [Cash Stack](https://cashstack.info).

## How-To Videos
- [Part 1: How to Install and Use](https://www.youtube.com/watch?v=nsExL0Hb7bQ)
- [Part 2: Configuration](https://www.youtube.com/watch?v=Bu8KqUJSvvc)
- [Creating NFTs and tokens](https://youtu.be/KWgGS5zN0Ys)

## Install

- `git clone` this repository.
- `npm install` dependencies.
- `./bin/run help` to see a list of available commands.
- `./bin/run wallet-create` to create a wallet. Wallet files are stored in the `.wallets` directory.

## Configuration
The `./bin/run conf` command is used to set various configuration settings.

### Blockchain Access
By default, this app uses [free-bch.fullstack.cash](https://free-bch.fullstack.cash) as its back-end service for working with the BCH blockchain. That back-end service is simply a copy of [ipfs-bch-wallet-consumer](https://github.com/Permissionless-Software-Foundation/ipfs-bch-wallet-consumer). By running your own copy of ipfs-bch-wallet-consumer, you can have greater reliability and can use this app to switch between different [Cash Stack](https://cashstack.info) *global back-ends*. If `free-bch.fullstack.cash` goes down for some reason, running your own instance of `ipfs-bch-wallet-consumer` allows you to easily switch to any functional back end on the internet.

Switch to a local instance of `ipfs-bch-wallet-consumer`:

- `./bin/run conf -k restURL -v http://localhost:5005`
- `./bin/run conf -k interface -v consumer-api`

Switch back to [free-bch.fullstack.cash](https://free-bch.fullstack.cash):

- `./bin/run conf -k restURL -v https://free-bch.fullstack.cash`

Switch to using the web2 infrastructure with [FullStack.cash](https://fullstack.cash):
- `./bin/run conf -k restURL -v http://api.fullstack.cash/v5/`
- `./bin/run conf -k interface -v rest-api`

Explore the other configuration settings:

- `./bin/run conf`

### Advanced Commands
Because of the wide-range of applications and commands that psf-bch-wallet can interact with, some application-specific commands are hidden by default. This is an attempt to prevent new users from feeling overwhelmed. By default, these commands are not shown when running `./bin/run help`. Setting their config value to `true` will cause them to show up in the help.

#### IPFS Diagnostics
When running your own instance of `ipfs-bch-wallet-consumer`, you will want to enable the `ipfs-*` commands. They will allow diagnostics and configuration of the IPFS node.

- `./bin/run conf -k cmdIpfs -v true`

## License

[MIT](./LICENSE.md)

## Credit

- [js-ipfs](https://www.npmjs.com/package/ipfs) - The IPFS node software.
- [ipfs-coord](https://github.com/Permissionless-Software-Foundation/ipfs-coord) - IPFS subnet coordination library.
- [bch-js](https://github.com/Permissionless-Software-Foundation/bch-js) - BCH toolkit.
- [oclif](https://oclif.io/) - CLI framework.
- [conf-cli](https://github.com/natzcam/conf-cli) - oclif config plugin.

## Table of Contents

<!-- toc -->
* [psf-bch-wallet](#psf-bch-wallet)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

```sh-session
$ npm install
$ ./bin/run [COMMAND] --help
$ ./bin/run COMMAND
```

# Commands

In the commands below, replace `psf-bch-wallet` with `./bin/run`.

<!-- commands -->
* [`psf-bch-wallet conf [KEY] [VALUE]`](#psf-bch-wallet-conf-key-value)
* [`psf-bch-wallet help [COMMAND]`](#psf-bch-wallet-help-command)
* [`psf-bch-wallet ipfs-peers`](#psf-bch-wallet-ipfs-peers)
* [`psf-bch-wallet ipfs-relays`](#psf-bch-wallet-ipfs-relays)
* [`psf-bch-wallet ipfs-status`](#psf-bch-wallet-ipfs-status)
* [`psf-bch-wallet mc-collect-keys`](#psf-bch-wallet-mc-collect-keys)
* [`psf-bch-wallet mc-finish`](#psf-bch-wallet-mc-finish)
* [`psf-bch-wallet mc-read-tx`](#psf-bch-wallet-mc-read-tx)
* [`psf-bch-wallet mc-sign-tx`](#psf-bch-wallet-mc-sign-tx)
* [`psf-bch-wallet mc-update-p2wdb-price`](#psf-bch-wallet-mc-update-p2wdb-price)
* [`psf-bch-wallet msg-check`](#psf-bch-wallet-msg-check)
* [`psf-bch-wallet msg-read`](#psf-bch-wallet-msg-read)
* [`psf-bch-wallet msg-send`](#psf-bch-wallet-msg-send)
* [`psf-bch-wallet msg-sign`](#psf-bch-wallet-msg-sign)
* [`psf-bch-wallet msg-verify`](#psf-bch-wallet-msg-verify)
* [`psf-bch-wallet p2wdb-json`](#psf-bch-wallet-p2wdb-json)
* [`psf-bch-wallet p2wdb-pin`](#psf-bch-wallet-p2wdb-pin)
* [`psf-bch-wallet p2wdb-read`](#psf-bch-wallet-p2wdb-read)
* [`psf-bch-wallet p2wdb-write`](#psf-bch-wallet-p2wdb-write)
* [`psf-bch-wallet send-bch`](#psf-bch-wallet-send-bch)
* [`psf-bch-wallet send-tokens`](#psf-bch-wallet-send-tokens)
* [`psf-bch-wallet token-burn`](#psf-bch-wallet-token-burn)
* [`psf-bch-wallet token-create-fungible`](#psf-bch-wallet-token-create-fungible)
* [`psf-bch-wallet token-create-group`](#psf-bch-wallet-token-create-group)
* [`psf-bch-wallet token-create-nft`](#psf-bch-wallet-token-create-nft)
* [`psf-bch-wallet token-info`](#psf-bch-wallet-token-info)
* [`psf-bch-wallet token-mda-tx`](#psf-bch-wallet-token-mda-tx)
* [`psf-bch-wallet token-mint`](#psf-bch-wallet-token-mint)
* [`psf-bch-wallet token-tx-history`](#psf-bch-wallet-token-tx-history)
* [`psf-bch-wallet token-update`](#psf-bch-wallet-token-update)
* [`psf-bch-wallet vote-addrs`](#psf-bch-wallet-vote-addrs)
* [`psf-bch-wallet vote-airdrop`](#psf-bch-wallet-vote-airdrop)
* [`psf-bch-wallet wallet-addrs`](#psf-bch-wallet-wallet-addrs)
* [`psf-bch-wallet wallet-balances`](#psf-bch-wallet-wallet-balances)
* [`psf-bch-wallet wallet-create`](#psf-bch-wallet-wallet-create)
* [`psf-bch-wallet wallet-list`](#psf-bch-wallet-wallet-list)
* [`psf-bch-wallet wallet-optimize`](#psf-bch-wallet-wallet-optimize)
* [`psf-bch-wallet wallet-remove`](#psf-bch-wallet-wallet-remove)
* [`psf-bch-wallet wallet-scan`](#psf-bch-wallet-wallet-scan)
* [`psf-bch-wallet wallet-service`](#psf-bch-wallet-wallet-service)
* [`psf-bch-wallet wallet-service-test`](#psf-bch-wallet-wallet-service-test)
* [`psf-bch-wallet wallet-sweep`](#psf-bch-wallet-wallet-sweep)

## `psf-bch-wallet conf [KEY] [VALUE]`

manage configuration

```
USAGE
  $ psf-bch-wallet conf [KEY] [VALUE] [-h] [-k <value>] [-v <value>] [-d] [-p <value>] [-n <value>] [-d <value>]

ARGUMENTS
  KEY    key of the config
  VALUE  value of the config

FLAGS
  -d, --cwd=<value>      config file location
  -d, --delete           delete?
  -h, --help             show CLI help
  -k, --key=<value>      key of the config
  -n, --name=<value>     config file name
  -p, --project=<value>  project name
  -v, --value=<value>    value of the config

DESCRIPTION
  manage configuration
```

_See code: [conf-cli](https://github.com/natzcam/conf-cli/blob/v0.1.9/src/commands/conf.ts)_

## `psf-bch-wallet help [COMMAND]`

display help for psf-bch-wallet

```
USAGE
  $ psf-bch-wallet help [COMMAND] [--all]

ARGUMENTS
  COMMAND  command to show help for

FLAGS
  --all  see all commands in CLI

DESCRIPTION
  display help for psf-bch-wallet
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_

## `psf-bch-wallet ipfs-peers`

Query the state of subnet peers

```
USAGE
  $ psf-bch-wallet ipfs-peers [-a]

FLAGS
  -a, --all  Display all data about peers

DESCRIPTION
  Query the state of subnet peers
```

_See code: [src/commands/ipfs-peers.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-peers.js)_

## `psf-bch-wallet ipfs-relays`

Query the state of circuit relays

```
USAGE
  $ psf-bch-wallet ipfs-relays

DESCRIPTION
  Query the state of circuit relays
```

_See code: [src/commands/ipfs-relays.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-relays.js)_

## `psf-bch-wallet ipfs-status`

Query the state of the IPFS node

```
USAGE
  $ psf-bch-wallet ipfs-status

DESCRIPTION
  Query the state of the IPFS node
```

_See code: [src/commands/ipfs-status.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-status.js)_

## `psf-bch-wallet mc-collect-keys`

Collect Voting Addresses

```
USAGE
  $ psf-bch-wallet mc-collect-keys

DESCRIPTION
  Collect Voting Addresses

  This command is run to prepare for a governance vote. It looks up the addresses
  holding all NFTs tied to a common group token. This list of addresses can
  then be used to air-drop voting tokens.
```

_See code: [src/commands/mc-collect-keys.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-collect-keys.js)_

## `psf-bch-wallet mc-finish`

Retrieve signatures, sign multisig TX, and broadcast

```
USAGE
  $ psf-bch-wallet mc-finish [-n <value>] [-a <value>]

FLAGS
  -a, --txids=<value>  Array of TXIDs of messages containing signatures
  -n, --name=<value>   Name of wallet

DESCRIPTION
  Retrieve signatures, sign multisig TX, and broadcast

  This command expects a JSON string containing an array of transaction IDs (TXIDs)
  that contain e2ee messages containing signatures for the transaction generated
  by the mc-update-p2wdb-price command.
```

_See code: [src/commands/mc-finish.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-finish.js)_

## `psf-bch-wallet mc-read-tx`

Read multisig TX proposal

```
USAGE
  $ psf-bch-wallet mc-read-tx [-n <value>] [-t <value>]

FLAGS
  -n, --name=<value>  Name of wallet
  -t, --txid=<value>  Transaction ID

DESCRIPTION
  Read multisig TX proposal

  This command reads the 'message' section of a proposed multisig transaction for
  Minting Council members. This command should be run *before* the mc-sign-tx
  command.
```

_See code: [src/commands/mc-read-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-read-tx.js)_

## `psf-bch-wallet mc-sign-tx`

Read signed messages

```
USAGE
  $ psf-bch-wallet mc-sign-tx [-n <value>] [-t <value>]

FLAGS
  -n, --name=<value>  Name of wallet
  -t, --txid=<value>  Transaction ID

DESCRIPTION
  Read signed messages

  This command signs a multisig transaction for Minting Council members. The
  mc-read-tx command should be run *before* this command, so that you can
  read the context of the transaction.

  After signing the transaction, it will send the signature back to the message
  originator.
```

_See code: [src/commands/mc-sign-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-sign-tx.js)_

## `psf-bch-wallet mc-update-p2wdb-price`

Generate a multsig TX for the Minting Council to update the price of P2WDB writes.

```
USAGE
  $ psf-bch-wallet mc-update-p2wdb-price [-n <value>] [-s <value>] [-m <value>]

FLAGS
  -m, --message=<value>  Message attached to transaction sent to each NFT holder.
  -n, --name=<value>     Name of wallet paying to send messages to NFT holders
  -s, --subject=<value>  Subject of e2ee message.

DESCRIPTION
  Generate a multsig TX for the Minting Council to update the price of P2WDB writes.

  This command creates a multisig wallet. As input, it takes address-public-key
  pairs generated from the multisig-collect-keys command. It uses that
  data to construct a P2SH multisig wallet. The wallet object is displayed
  on the command line as the output.

  This is a long-running command. It does the following:
  - It calls the mc-collect-keys commands to get the public keys for each holder of the Minting Council NFT.
  - It generates a multisignature wallet from those keys requiring 50% + 1 signers.
  - It generates a transaction for spending from the wallet, attaching an OP_RETURN to update the P2WDB write price.
  - It sends the unsigned transaction to each member of the Minting Council.
```

_See code: [src/commands/mc-update-p2wdb-price.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-update-p2wdb-price.js)_

## `psf-bch-wallet msg-check`

Check signed messages

```
USAGE
  $ psf-bch-wallet msg-check [-n <value>]

FLAGS
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Check signed messages
```

_See code: [src/commands/msg-check.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-check.js)_

## `psf-bch-wallet msg-read`

Read signed messages

```
USAGE
  $ psf-bch-wallet msg-read [-n <value>] [-t <value>]

FLAGS
  -n, --name=<value>  Name of wallet
  -t, --txid=<value>  Transaction ID

DESCRIPTION
  Read signed messages
```

_See code: [src/commands/msg-read.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-read.js)_

## `psf-bch-wallet msg-send`

Send encrypted messages

```
USAGE
  $ psf-bch-wallet msg-send [-a <value>] [-m <value>] [-s <value>] [-n <value>]

FLAGS
  -a, --bchAddress=<value>  BCH Address
  -m, --message=<value>     Message to send
  -n, --name=<value>        Name of wallet
  -s, --subject=<value>     Message Subject

DESCRIPTION
  Send encrypted messages
```

_See code: [src/commands/msg-send.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-send.js)_

## `psf-bch-wallet msg-sign`

Cryptographically sign a message.

```
USAGE
  $ psf-bch-wallet msg-sign [-n <value>] [-m <value>]

FLAGS
  -m, --msg=<value>   Cleartext message to sign
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Cryptographically sign a message.

  Generate a signature from a clear-text message and the private key of your wallet.
  The system verifying the signature will also need the BCH address of the walllet.
```

_See code: [src/commands/msg-sign.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-sign.js)_

## `psf-bch-wallet msg-verify`

Verify a signed message

```
USAGE
  $ psf-bch-wallet msg-verify [-b <value>] [-m <value>] [-s <value>]

FLAGS
  -b, --bchAddr=<value>  BCH address of signer.
  -m, --msg=<value>      Cleartext message used to generate the signature.
  -s, --sig=<value>      Signature to verify.

DESCRIPTION
  Verify a signed message

  Verify the authenticity of a signed message.
```

_See code: [src/commands/msg-verify.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-verify.js)_

## `psf-bch-wallet p2wdb-json`

Upload JSON to IPFS

```
USAGE
  $ psf-bch-wallet p2wdb-json [-n <value>] [-j <value>]

FLAGS
  -j, --json=<value>  A JSON string. Encase this argument in single quotes.
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Upload JSON to IPFS

  This command uses the p2wdb npm library to upload a JSON object to an IPFS node.
  The node returns a CID representing the JSON. That CID can then be pinned using
  the P2WDB Pinning cluster, using the p2wdb-pin command.
```

_See code: [src/commands/p2wdb-json.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-json.js)_

## `psf-bch-wallet p2wdb-pin`

Pin an IPFS CID using the P2WDB pinning service

```
USAGE
  $ psf-bch-wallet p2wdb-pin [-n <value>] [-c <value>]

FLAGS
  -c, --cid=<value>   IPFS CID to pin
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Pin an IPFS CID using the P2WDB pinning service

  This command uses the p2wdb npm library to pin an IPFS CID using the P2WDB
  pinning service.

  Note: Currently only files 1MB or less are supported.
```

_See code: [src/commands/p2wdb-pin.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-pin.js)_

## `psf-bch-wallet p2wdb-read`

Read an entry from the P2WDB

```
USAGE
  $ psf-bch-wallet p2wdb-read [-h <value>]

FLAGS
  -h, --hash=<value>  Hash CID representing P2WDB entry

DESCRIPTION
  Read an entry from the P2WDB
```

_See code: [src/commands/p2wdb-read.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-read.js)_

## `psf-bch-wallet p2wdb-write`

Write an entry to the pay-to-write database (P2WDB)

```
USAGE
  $ psf-bch-wallet p2wdb-write [-n <value>] [-d <value>] [-a <value>]

FLAGS
  -a, --appId=<value>  appId string to categorize data
  -d, --data=<value>   String of data to write to the P2WDB
  -n, --name=<value>   Name of wallet

DESCRIPTION
  Write an entry to the pay-to-write database (P2WDB)

  In order to execute this command, the wallet must contain some BCH and some PSF
  token, in order to pay for the write to the P2WDB.
```

_See code: [src/commands/p2wdb-write.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-write.js)_

## `psf-bch-wallet send-bch`

Send BCH

```
USAGE
  $ psf-bch-wallet send-bch [-n <value>] [-q <value>] [-a <value>]

FLAGS
  -a, --sendAddr=<value>  Cash address to send to
  -n, --name=<value>      Name of wallet
  -q, --qty=<value>       Quantity in BCH

DESCRIPTION
  Send BCH
```

_See code: [src/commands/send-bch.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/send-bch.js)_

## `psf-bch-wallet send-tokens`

Send Tokens

```
USAGE
  $ psf-bch-wallet send-tokens [-n <value>] [-t <value>] [-a <value>] [-q <value>]

FLAGS
  -a, --sendAddr=<value>  Cash or SimpleLedger address to send to
  -n, --name=<value>      Name of wallet
  -q, --qty=<value>
  -t, --tokenId=<value>   Token ID

DESCRIPTION
  Send Tokens
```

_See code: [src/commands/send-tokens.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/send-tokens.js)_

## `psf-bch-wallet token-burn`

Burn a specific quantity of SLP tokens.

```
USAGE
  $ psf-bch-wallet token-burn [-n <value>] [-q <value>] [-t <value>]

FLAGS
  -n, --name=<value>     Name of wallet
  -q, --qty=<value>      Quantity of tokens to burn. If quantity is 0, all tokens will be burned.
  -t, --tokenId=<value>  tokenId of token to burn

DESCRIPTION
  Burn a specific quantity of SLP tokens.
```

_See code: [src/commands/token-burn.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-burn.js)_

## `psf-bch-wallet token-create-fungible`

Create a new SLP Type1 fugible token.

```
USAGE
  $ psf-bch-wallet token-create-fungible [-n <value>] [-t <value>] [-m <value>] [-d <value>] [-q <value>] [-u <value>] [-h <value>] [-b]

FLAGS
  -b, --baton               (optional Boolean) create a minting baton
  -d, --decimals=<value>    Decimals used by the token
  -h, --hash=<value>        (optional) Document hash of the group
  -m, --tokenName=<value>   Name of token
  -n, --walletName=<value>  Name of wallet to pay for transaction
  -q, --qty=<value>         Quantity of tokens to create
  -t, --ticker=<value>      Ticker of the group
  -u, --url=<value>         (optional) Document URL of the group

DESCRIPTION
  Create a new SLP Type1 fugible token.

  Creating a minting baton is optional. If a baton address is not specified, then the
  baton is burned and makes the it a 'fixed supply' token.
```

_See code: [src/commands/token-create-fungible.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-create-fungible.js)_

## `psf-bch-wallet token-create-group`

Create a new SLP Group token.

```
USAGE
  $ psf-bch-wallet token-create-group [-n <value>] [-m <value>] [-t <value>] [-q <value>] [-u <value>] [-h <value>]

FLAGS
  -h, --hash=<value>        (optional) Document hash of the group
  -m, --tokenName=<value>   Name of token
  -n, --walletName=<value>  Name of wallet to pay for transaction
  -q, --qty=<value>         (optional) Quantity of tokens to create. Defaults to 1
  -t, --ticker=<value>      Ticker of the group
  -u, --url=<value>         (optional) Document URL of the group

DESCRIPTION
  Create a new SLP Group token.

  Group tokens are used to generate NFTs. Read more about the relationship:
  https://github.com/Permissionless-Software-Foundation/bch-js-examples/tree/master/bch/applications/slp/nft
```

_See code: [src/commands/token-create-group.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-create-group.js)_

## `psf-bch-wallet token-create-nft`

Create a new SLP Group token.

```
USAGE
  $ psf-bch-wallet token-create-nft [-n <value>] [-m <value>] [-t <value>] [-u <value>] [-h <value>] [-i <value>]

FLAGS
  -h, --hash=<value>        (optional) Document hash of the group
  -i, --tokenId=<value>     Token ID of Group token to burn, to generate the NFT
  -m, --tokenName=<value>   Name of token
  -n, --walletName=<value>  Name of wallet to pay for transaction
  -t, --ticker=<value>      Ticker of the group
  -u, --url=<value>         (optional) Document URL of the group

DESCRIPTION
  Create a new SLP Group token.

  Group tokens are used to generate NFTs. Read more about the relationship:
  https://github.com/Permissionless-Software-Foundation/bch-js-examples/tree/master/bch/applications/slp/nft
```

_See code: [src/commands/token-create-nft.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-create-nft.js)_

## `psf-bch-wallet token-info`

Get information on a token

```
USAGE
  $ psf-bch-wallet token-info [-t <value>]

FLAGS
  -t, --tokenId=<value>  The ID of the token to lookup

DESCRIPTION
  Get information on a token

  Retrieves the Genesis data for a token. If PS002 mutable and immutable data is
  attached to the token, it is retrieved from IPFS.
```

_See code: [src/commands/token-info.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-info.js)_

## `psf-bch-wallet token-mda-tx`

Create TXID for token mutable data

```
USAGE
  $ psf-bch-wallet token-mda-tx [-n <value>] [-a <value>]

FLAGS
  -a, --mda=<value>         Mutable data address
  -n, --walletName=<value>  Name of wallet to pay for transaction

DESCRIPTION
  Create TXID for token mutable data

  MDA is an acrynym for 'Mutable Data Address'

  This command is used to generate a TXID for attaching mutable data to a token.
  Given a BCH address, it generates a transaction to turn that address into
  the controller of mutable data for a token. This generates a TXID which is
  used in the tokens 'documentHash' field when creating the token.

  PS002 specification for mutable data:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md
```

_See code: [src/commands/token-mda-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-mda-tx.js)_

## `psf-bch-wallet token-mint`

Mint new Fungible (Type 1) or Group tokens

```
USAGE
  $ psf-bch-wallet token-mint [-n <value>] [-q <value>] [-t <value>] [-r <value>]

FLAGS
  -n, --name=<value>      Name of wallet to pay for transaction
  -q, --qty=<value>       Quantity of tokens to create
  -r, --receiver=<value>  (optional) Receiver of new baton. Defaults to same wallet. null burns baton.
  -t, --tokenId=<value>   Token ID

DESCRIPTION
  Mint new Fungible (Type 1) or Group tokens

  If the wallet contains a minting baton from creating a Fungible or Group token,
  this command can be used to mint new tokens into existence.

  The '-r' flag is optional. By default the minting baton will be sent back to the
  origionating wallet. A different address can be specified by the -r flag. Passing
  a value of 'null' will burn the minting baton, removing the ability to mint
  new tokens.
```

_See code: [src/commands/token-mint.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-mint.js)_

## `psf-bch-wallet token-tx-history`

Get transaction history for a token

```
USAGE
  $ psf-bch-wallet token-tx-history [-t <value>]

FLAGS
  -t, --tokenId=<value>  The ID of the token to lookup

DESCRIPTION
  Get transaction history for a token

  Retrieves the transaction history for a token. This is every transaction that
  has involved the token. The data is more informative for an NFT than it is for
  a fungible token.
```

_See code: [src/commands/token-tx-history.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-tx-history.js)_

## `psf-bch-wallet token-update`

Update token mutable data.

```
USAGE
  $ psf-bch-wallet token-update [-n <value>] [-c <value>]

FLAGS
  -c, --cid=<value>   A CID that resolves to the new mutable data JSON
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Update token mutable data.

  This command is used to update the mutable data for a token.

  Data updates are effected by writing a new
  CID to an OP_RETURN inside a transaction, published to the Mutable Data Address
  (MDA), as described in PS002.

  The wallet used to pay for the transaction must control the MDA, otherwise the
  update will be ignored.

  To use this command, you'll need a CID that resolves to the updated data.
  The p2wdb-json command can be used for that.

  New mutable data follows the PS002 spec by uploading JSON data to IPFS and
  then including the CID in an OP_RETURN. The JSON data should also follow the
  schema in the PS007 specification:

  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps007-token-data-schema.md
```

_See code: [src/commands/token-update.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-update.js)_

## `psf-bch-wallet vote-addrs`

Collect Voting Addresses

```
USAGE
  $ psf-bch-wallet vote-addrs

DESCRIPTION
  Collect Voting Addresses

  This command is run to prepare for a governance vote. It looks up the addresses
  holding all NFTs tied to a common group token. This list of addresses can
  then be used to air-drop voting tokens.
```

_See code: [src/commands/vote-addrs.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/vote-addrs.js)_

## `psf-bch-wallet vote-airdrop`

Airdrop Voting Tokens

```
USAGE
  $ psf-bch-wallet vote-airdrop [-n <value>] [-a <value>] [-t <value>]

FLAGS
  -a, --addrs=<value>    JSON string containing array of addresses
  -n, --name=<value>     Name of wallet holding voting tokens
  -t, --tokenId=<value>  Token ID to air-drop to each address

DESCRIPTION
  Airdrop Voting Tokens

  This command is used to air-drop voting tokens to an array of addresses. It
  is expected the array of addresses is generated from the vote-addrs command.
  One token will be send to each address in the list.
```

_See code: [src/commands/vote-airdrop.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/vote-airdrop.js)_

## `psf-bch-wallet wallet-addrs`

List the different addresses for a wallet.

```
USAGE
  $ psf-bch-wallet wallet-addrs [-n <value>]

FLAGS
  -n, --name=<value>  Name of wallet

DESCRIPTION
  List the different addresses for a wallet.
```

_See code: [src/commands/wallet-addrs.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-addrs.js)_

## `psf-bch-wallet wallet-balances`

Display the balances of the wallet

```
USAGE
  $ psf-bch-wallet wallet-balances [-n <value>] [-v]

FLAGS
  -n, --name=<value>  Name of wallet
  -v, --verbose       Show verbose UTXO information

DESCRIPTION
  Display the balances of the wallet
```

_See code: [src/commands/wallet-balances.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-balances.js)_

## `psf-bch-wallet wallet-create`

Generate a new HD Wallet.

```
USAGE
  $ psf-bch-wallet wallet-create [-n <value>] [-d <value>]

FLAGS
  -d, --description=<value>  Description of the wallet
  -n, --name=<value>         Name of wallet

DESCRIPTION
  Generate a new HD Wallet.
```

_See code: [src/commands/wallet-create.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-create.js)_

## `psf-bch-wallet wallet-list`

List existing wallets.

```
USAGE
  $ psf-bch-wallet wallet-list

DESCRIPTION
  List existing wallets.
```

_See code: [src/commands/wallet-list.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-list.js)_

## `psf-bch-wallet wallet-optimize`

Optimize a wallet

```
USAGE
  $ psf-bch-wallet wallet-optimize [-n <value>]

FLAGS
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Optimize a wallet

  This command 'optimizes' a wallet by consolidating the UTXOs with in it. This
  consolidation can significantly reduce the number of API calls, which speeds
  up the the network calls and results in an improved user experience (UX).
```

_See code: [src/commands/wallet-optimize.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-optimize.js)_

## `psf-bch-wallet wallet-remove`

Remove an existing wallet.

```
USAGE
  $ psf-bch-wallet wallet-remove [-n <value>]

FLAGS
  -n, --name=<value>  Name of wallet

DESCRIPTION
  Remove an existing wallet.
```

_See code: [src/commands/wallet-remove.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-remove.js)_

## `psf-bch-wallet wallet-scan`

Scan different derivation paths of a 12 word mnemonic for tx history.

```
USAGE
  $ psf-bch-wallet wallet-scan [-m <value>]

FLAGS
  -m, --mnemonic=<value>  mnemonic phrase to generate addresses, wrapped in quotes

DESCRIPTION
  Scan different derivation paths of a 12 word mnemonic for tx history.

  Scans the first 20 addresses of each derivation path for
  history and balance of the given mnemonic. If any of them had a history, scans
  the next 20, until it reaches a batch of 20 addresses with no history. The -m
  flag is used to pass it a mnemonic phrase. Be sure to enclose the words in
  quotes.

  This command is handy for people who maintain multiple wallets. This allows easy
  scanning to see if a mnemonic holds any funds on any of the commonly used
  derivation paths.

  Derivation pathes used:
  145 - BIP44 standard path for Bitcoin Cash
  245 - BIP44 standard path for SLP tokens
  0 - Used by common software like the Bitcoin.com wallet and Honest.cash
```

_See code: [src/commands/wallet-scan.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-scan.js)_

## `psf-bch-wallet wallet-service`

List and/or select a wallet service provider.

```
USAGE
  $ psf-bch-wallet wallet-service [-s <value>]

FLAGS
  -s, --select=<value>  Switch to a given IPFS ID for wallet service.

DESCRIPTION
  List and/or select a wallet service provider.
```

_See code: [src/commands/wallet-service.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-service.js)_

## `psf-bch-wallet wallet-service-test`

Run end-to-end tests on the selected wallet service.

```
USAGE
  $ psf-bch-wallet wallet-service-test

DESCRIPTION
  Run end-to-end tests on the selected wallet service.

  This command will run a series of end-to-end (e2e) tests on a current global
  back end selected with the 'wallet-service' command. It will test that the
  selected service if fully function, and this app can adaquately communicate
  with that service.
```

_See code: [src/commands/wallet-service-test.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-service-test.js)_

## `psf-bch-wallet wallet-sweep`

Sweep funds from one wallet into another

```
USAGE
  $ psf-bch-wallet wallet-sweep [-n <value>] [-m <value>] [-w <value>] [-d <value>]

FLAGS
  -d, --derivation=<value>  Derivation path. Will default to 245 if not specified. Common values are 245, 145, and 0
  -m, --mnemonic=<value>    12-word mnemonic phrase, wrapped in quotes
  -n, --name=<value>        name of receiving wallet
  -w, --wif=<value>         WIF private key controlling funds of a single address

DESCRIPTION
  Sweep funds from one wallet into another

  Sweep funds from a single private key (WIF) or a whole HD wallet (mnemonic)
  into another wallet. Works for both BCH and tokens.

  If the target wallet does not have enough funds to pay transaction fees, fees
  are paid from the receiving wallet. In the case of a mnemonic, a derivation path
  can be specified.

  Either a WIF or a mnemonic must be specified.
```

_See code: [src/commands/wallet-sweep.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-sweep.js)_
<!-- commandsstop -->
