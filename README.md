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

#### Governance Voting
The [PSF Governance](https://psfoundation.info/governance) vote can be initiated with the `vote-*` commands. These commands are not needed by normal users, so they are hidden by default.

- `./bin/run conf -k cmdVote -v true`

#### Minting Council
Members of the [PSF Minting Council](https://psfoundation.info/governance#the-minting-council) hold an NFT which allows them to participate in multisignature wallets. They can use the `mc-*` commands to interact with the multisig wallet. These commands are not needed by normal users, so they are hidden by default.

- `./bin/run conf -k cmdMc -v true`

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
* [`psf-bch-wallet ipfs-connect`](#psf-bch-wallet-ipfs-connect)
* [`psf-bch-wallet ipfs-node`](#psf-bch-wallet-ipfs-node)
* [`psf-bch-wallet ipfs-peers`](#psf-bch-wallet-ipfs-peers)
* [`psf-bch-wallet ipfs-relays`](#psf-bch-wallet-ipfs-relays)
* [`psf-bch-wallet ipfs-status`](#psf-bch-wallet-ipfs-status)
* [`psf-bch-wallet mc-collect-keys`](#psf-bch-wallet-mc-collect-keys)
* [`psf-bch-wallet mc-finish`](#psf-bch-wallet-mc-finish)
* [`psf-bch-wallet mc-p2wdb-approval-tx`](#psf-bch-wallet-mc-p2wdb-approval-tx)
* [`psf-bch-wallet mc-p2wdb-update-tx`](#psf-bch-wallet-mc-p2wdb-update-tx)
* [`psf-bch-wallet mc-read-tx`](#psf-bch-wallet-mc-read-tx)
* [`psf-bch-wallet mc-sign-tx`](#psf-bch-wallet-mc-sign-tx)
* [`psf-bch-wallet msg-check`](#psf-bch-wallet-msg-check)
* [`psf-bch-wallet msg-read`](#psf-bch-wallet-msg-read)
* [`psf-bch-wallet msg-send`](#psf-bch-wallet-msg-send)
* [`psf-bch-wallet msg-sign`](#psf-bch-wallet-msg-sign)
* [`psf-bch-wallet msg-verify`](#psf-bch-wallet-msg-verify)
* [`psf-bch-wallet p2wdb-json`](#psf-bch-wallet-p2wdb-json)
* [`psf-bch-wallet p2wdb-pin`](#psf-bch-wallet-p2wdb-pin)
* [`psf-bch-wallet p2wdb-read`](#psf-bch-wallet-p2wdb-read)
* [`psf-bch-wallet p2wdb-write`](#psf-bch-wallet-p2wdb-write)
* [`psf-bch-wallet psffpp-download`](#psf-bch-wallet-psffpp-download)
* [`psf-bch-wallet psffpp-download2`](#psf-bch-wallet-psffpp-download2)
* [`psf-bch-wallet psffpp-info`](#psf-bch-wallet-psffpp-info)
* [`psf-bch-wallet psffpp-pin`](#psf-bch-wallet-psffpp-pin)
* [`psf-bch-wallet psffpp-upload`](#psf-bch-wallet-psffpp-upload)
* [`psf-bch-wallet psffpp-upload2`](#psf-bch-wallet-psffpp-upload2)
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
[1mUSAGE[22m
  $ psf-bch-wallet conf [KEY] [VALUE] [-h] [-k <value>] [-v <value>] [-d] [-p <value>] [-n <value>] [-d <value>]

[1mARGUMENTS[22m
  KEY    [2mkey of the config[22m
  VALUE  [2mvalue of the config[22m

[1mFLAGS[22m
  -d, --cwd=[4m<value>[24m      [2mconfig file location[22m
  -d, --delete           [2mdelete?[22m
  -h, --help             [2mshow CLI help[22m
  -k, --key=[4m<value>[24m      [2mkey of the config[22m
  -n, --name=[4m<value>[24m     [2mconfig file name[22m
  -p, --project=[4m<value>[24m  [2mproject name[22m
  -v, --value=[4m<value>[24m    [2mvalue of the config[22m

[1mDESCRIPTION[22m
  manage configuration
```

_See code: [conf-cli](https://github.com/natzcam/conf-cli/blob/v0.1.9/src/commands/conf.ts)_

## `psf-bch-wallet help [COMMAND]`

display help for psf-bch-wallet

```
[1mUSAGE[22m
  $ psf-bch-wallet help [COMMAND] [--all]

[1mARGUMENTS[22m
  COMMAND  [2mcommand to show help for[22m

[1mFLAGS[22m
  --all  [2msee all commands in CLI[22m

[1mDESCRIPTION[22m
  display help for psf-bch-wallet
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_

## `psf-bch-wallet ipfs-connect`

Connect to an IPFS peer

```
[1mUSAGE[22m
  $ psf-bch-wallet ipfs-connect [-m <value>] [-d]

[1mFLAGS[22m
  -d, --getDetails         [2minclude details about the connection[22m
  -m, --multiaddr=[4m<value>[24m  [2mmultiaddr to connect to an IPFS node[22m

[1mDESCRIPTION[22m
  Connect to an IPFS peer
```

_See code: [src/commands/ipfs-connect.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-connect.js)_

## `psf-bch-wallet ipfs-node`

Query the state of the IPFS node

```
[1mUSAGE[22m
  $ psf-bch-wallet ipfs-node

[1mDESCRIPTION[22m
  Query the state of the IPFS node
```

_See code: [src/commands/ipfs-node.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-node.js)_

## `psf-bch-wallet ipfs-peers`

Query the state of subnet peers

```
[1mUSAGE[22m
  $ psf-bch-wallet ipfs-peers [-a]

[1mFLAGS[22m
  -a, --all  [2mDisplay all data about peers[22m

[1mDESCRIPTION[22m
  Query the state of subnet peers
```

_See code: [src/commands/ipfs-peers.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-peers.js)_

## `psf-bch-wallet ipfs-relays`

Query the state of circuit relays

```
[1mUSAGE[22m
  $ psf-bch-wallet ipfs-relays

[1mDESCRIPTION[22m
  Query the state of circuit relays
```

_See code: [src/commands/ipfs-relays.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-relays.js)_

## `psf-bch-wallet ipfs-status`

Query the state of the IPFS node

```
[1mUSAGE[22m
  $ psf-bch-wallet ipfs-status

[1mDESCRIPTION[22m
  Query the state of the IPFS node
```

_See code: [src/commands/ipfs-status.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/ipfs-status.js)_

## `psf-bch-wallet mc-collect-keys`

Collect Voting Addresses

```
[1mUSAGE[22m
  $ psf-bch-wallet mc-collect-keys

[1mDESCRIPTION[22m
  Collect Voting Addresses

  This command is run to prepare for a governance vote. It looks up the addresses
  holding all NFTs tied to a common group token. This list of addresses can
  then be used to air-drop voting tokens.
```

_See code: [src/commands/mc-collect-keys.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-collect-keys.js)_

## `psf-bch-wallet mc-finish`

Retrieve signatures, sign multisig TX, and broadcast

```
[1mUSAGE[22m
  $ psf-bch-wallet mc-finish [-n <value>] [-a <value>]

[1mFLAGS[22m
  -a, --txids=[4m<value>[24m  [2mArray of TXIDs of messages containing signatures[22m
  -n, --name=[4m<value>[24m   [2mName of wallet[22m

[1mDESCRIPTION[22m
  Retrieve signatures, sign multisig TX, and broadcast

  This command expects a JSON string containing an array of transaction IDs (TXIDs)
  that contain e2ee messages containing signatures for the transaction generated
  by the mc-update-p2wdb-price command.
```

_See code: [src/commands/mc-finish.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-finish.js)_

## `psf-bch-wallet mc-p2wdb-approval-tx`

Generate a multsig TX for the Minting Council to update the price of P2WDB writes.

```
[1mUSAGE[22m
  $ psf-bch-wallet mc-p2wdb-approval-tx [-n <value>] [-s <value>] [-m <value>] [-t <value>]

[1mFLAGS[22m
  -m, --message=[4m<value>[24m  [2mMessage attached to transaction sent to each NFT holder.[22m
  -n, --name=[4m<value>[24m     [2mName of wallet paying to send messages to NFT holders[22m
  -s, --subject=[4m<value>[24m  [2mSubject of e2ee message.[22m
  -t, --txid=[4m<value>[24m     [2mTXID of the update transaction generated from the mc-update-tx command.[22m

[1mDESCRIPTION[22m
  Generate a multsig TX for the Minting Council to update the price of P2WDB writes.

  This command creates a multisig wallet. As input, it takes address-public-key
  pairs generated from the multisig-collect-keys command. It uses that
  data to construct a P2SH multisig wallet. The wallet object is displayed
  on the command line as the output.

  This is a long-running command. It does the following:
  - It calls the mc-collect-keys commands to get the public keys for each holder of the Minting Council NFT.
  - It generates a multisignature wallet from those keys requiring 50% + 1 signers.
  - It generates a transaction for spending from the wallet, attaching an OP_RETURN to approve an update to the P2WDB write price.
  - It sends the unsigned transaction to each member of the Minting Council.
```

_See code: [src/commands/mc-p2wdb-approval-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-p2wdb-approval-tx.js)_

## `psf-bch-wallet mc-p2wdb-update-tx`

Generate a PS009 Update Transaction to update the P2WDB write price

```
[1mUSAGE[22m
  $ psf-bch-wallet mc-p2wdb-update-tx [-n <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet paying to send messages to NFT holders[22m

[1mDESCRIPTION[22m
  Generate a PS009 Update Transaction to update the P2WDB write price

  This command generates an 'Update Transaction' as per PS009 specification:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps009-multisig-approval.md

  This command creates a multisig wallet. As input, it takes address-public-key
  pairs generated from the multisig-collect-keys command. It uses that
  data to construct a P2SH multisig wallet. The wallet object is displayed
  on the command line as the output.

  This is a long-running command. It does the following:
  - It calls the mc-collect-keys commands to get the public keys for each holder
  of the Minting Council NFT.
  - It generates a multisignature wallet from those keys requiring 50% + 1 signers.
  - It retrieves the current PSF token price and calculates the price of $0.01 USD
  in PSF tokens.
  - It writes all the data to the P2WDB, pins the data with the P2WDB Pinning
  Cluster, and gets an IPFS CID for the data.
  - It then writes a PS009 Update Transaction to the BCH blockchain, containing
  the CID, returning a TXID.

  That BCH TXID is then used as input to the mc-update-p2wdb-price command, to
  generate a PS009 Approval Transaction, so that the price update can be approved
  by the Minting Council via the multisignature wallet.
```

_See code: [src/commands/mc-p2wdb-update-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-p2wdb-update-tx.js)_

## `psf-bch-wallet mc-read-tx`

Read multisig TX proposal

```
[1mUSAGE[22m
  $ psf-bch-wallet mc-read-tx [-n <value>] [-t <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m
  -t, --txid=[4m<value>[24m  [2mTransaction ID[22m

[1mDESCRIPTION[22m
  Read multisig TX proposal

  This command reads the 'message' section of a proposed multisig transaction for
  Minting Council members. This command should be run *before* the mc-sign-tx
  command.
```

_See code: [src/commands/mc-read-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-read-tx.js)_

## `psf-bch-wallet mc-sign-tx`

Read signed messages

```
[1mUSAGE[22m
  $ psf-bch-wallet mc-sign-tx [-n <value>] [-t <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m
  -t, --txid=[4m<value>[24m  [2mTransaction ID[22m

[1mDESCRIPTION[22m
  Read signed messages

  This command signs a multisig transaction for Minting Council members. The
  mc-read-tx command should be run *before* this command, so that you can
  read the context of the transaction.

  After signing the transaction, it will send the signature back to the message
  originator.
```

_See code: [src/commands/mc-sign-tx.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/mc-sign-tx.js)_

## `psf-bch-wallet msg-check`

Check signed messages

```
[1mUSAGE[22m
  $ psf-bch-wallet msg-check [-n <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  Check signed messages
```

_See code: [src/commands/msg-check.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-check.js)_

## `psf-bch-wallet msg-read`

Read signed messages

```
[1mUSAGE[22m
  $ psf-bch-wallet msg-read [-n <value>] [-t <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m
  -t, --txid=[4m<value>[24m  [2mTransaction ID[22m

[1mDESCRIPTION[22m
  Read signed messages
```

_See code: [src/commands/msg-read.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-read.js)_

## `psf-bch-wallet msg-send`

Send encrypted messages

```
[1mUSAGE[22m
  $ psf-bch-wallet msg-send [-a <value>] [-m <value>] [-s <value>] [-n <value>]

[1mFLAGS[22m
  -a, --bchAddress=[4m<value>[24m  [2mBCH Address[22m
  -m, --message=[4m<value>[24m     [2mMessage to send[22m
  -n, --name=[4m<value>[24m        [2mName of wallet[22m
  -s, --subject=[4m<value>[24m     [2mMessage Subject[22m

[1mDESCRIPTION[22m
  Send encrypted messages
```

_See code: [src/commands/msg-send.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-send.js)_

## `psf-bch-wallet msg-sign`

Cryptographically sign a message.

```
[1mUSAGE[22m
  $ psf-bch-wallet msg-sign [-n <value>] [-m <value>]

[1mFLAGS[22m
  -m, --msg=[4m<value>[24m   [2mCleartext message to sign[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  Cryptographically sign a message.

  Generate a signature from a clear-text message and the private key of your wallet.
  The system verifying the signature will also need the BCH address of the walllet.
```

_See code: [src/commands/msg-sign.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-sign.js)_

## `psf-bch-wallet msg-verify`

Verify a signed message

```
[1mUSAGE[22m
  $ psf-bch-wallet msg-verify [-b <value>] [-m <value>] [-s <value>]

[1mFLAGS[22m
  -b, --bchAddr=[4m<value>[24m  [2mBCH address of signer.[22m
  -m, --msg=[4m<value>[24m      [2mCleartext message used to generate the signature.[22m
  -s, --sig=[4m<value>[24m      [2mSignature to verify.[22m

[1mDESCRIPTION[22m
  Verify a signed message

  Verify the authenticity of a signed message.
```

_See code: [src/commands/msg-verify.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/msg-verify.js)_

## `psf-bch-wallet p2wdb-json`

Upload JSON to IPFS

```
[1mUSAGE[22m
  $ psf-bch-wallet p2wdb-json [-n <value>] [-j <value>]

[1mFLAGS[22m
  -j, --json=[4m<value>[24m  [2mA JSON string. Encase this argument in single quotes.[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  Upload JSON to IPFS

  This command uses the p2wdb npm library to upload a JSON object to an IPFS node.
  The node returns a CID representing the JSON. That CID can then be pinned using
  the P2WDB Pinning cluster, using the p2wdb-pin command.
```

_See code: [src/commands/p2wdb-json.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-json.js)_

## `psf-bch-wallet p2wdb-pin`

Pin an IPFS CID using the P2WDB pinning service

```
[1mUSAGE[22m
  $ psf-bch-wallet p2wdb-pin [-n <value>] [-c <value>]

[1mFLAGS[22m
  -c, --cid=[4m<value>[24m   [2mIPFS CID to pin[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  Pin an IPFS CID using the P2WDB pinning service

  This command uses the p2wdb npm library to pin an IPFS CID using the P2WDB
  pinning service.

  Note: Currently only files 1MB or less are supported.
```

_See code: [src/commands/p2wdb-pin.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-pin.js)_

## `psf-bch-wallet p2wdb-read`

Read an entry from the P2WDB

```
[1mUSAGE[22m
  $ psf-bch-wallet p2wdb-read [-h <value>]

[1mFLAGS[22m
  -h, --hash=[4m<value>[24m  [2mHash CID representing P2WDB entry[22m

[1mDESCRIPTION[22m
  Read an entry from the P2WDB
```

_See code: [src/commands/p2wdb-read.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-read.js)_

## `psf-bch-wallet p2wdb-write`

Write an entry to the pay-to-write database (P2WDB)

```
[1mUSAGE[22m
  $ psf-bch-wallet p2wdb-write [-n <value>] [-d <value>] [-a <value>]

[1mFLAGS[22m
  -a, --appId=[4m<value>[24m  [2mappId string to categorize data[22m
  -d, --data=[4m<value>[24m   [2mString of data to write to the P2WDB[22m
  -n, --name=[4m<value>[24m   [2mName of wallet[22m

[1mDESCRIPTION[22m
  Write an entry to the pay-to-write database (P2WDB)

  In order to execute this command, the wallet must contain some BCH and some PSF
  token, in order to pay for the write to the P2WDB.
```

_See code: [src/commands/p2wdb-write.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/p2wdb-write.js)_

## `psf-bch-wallet psffpp-download`

Download a file, given its CID.

```
[1mUSAGE[22m
  $ psf-bch-wallet psffpp-download [-c <value>] [-f <value>]

[1mFLAGS[22m
  -c, --cid=[4m<value>[24m       [2mCID of file to download[22m
  -f, --fileName=[4m<value>[24m  [2mfilename to apply to the downloaded file[22m

[1mDESCRIPTION[22m
  Download a file, given its CID.

  IPFS files do not retain the original filename. This command will download a
  file given its CID, then rename the download to the given filename.
```

_See code: [src/commands/psffpp-download.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/psffpp-download.js)_

## `psf-bch-wallet psffpp-download2`

Download a file, given its CID.

```
[1mUSAGE[22m
  $ psf-bch-wallet psffpp-download2 [-c <value>]

[1mFLAGS[22m
  -c, --cid=[4m<value>[24m  [2mCID of file to download[22m

[1mDESCRIPTION[22m
  Download a file, given its CID.

  Query the ipfs-bch-wallet-consumer for a given CID. If the file is pinned by
  the ipfs-file-pin-service connected to it, it will attempt to download the
  file to the ipfs-files directory.
```

_See code: [src/commands/psffpp-download2.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/psffpp-download2.js)_

## `psf-bch-wallet psffpp-info`

Download a file, given its CID.

```
[1mUSAGE[22m
  $ psf-bch-wallet psffpp-info [-c <value>]

[1mFLAGS[22m
  -c, --cid=[4m<value>[24m  [2mCID of file to download[22m

[1mDESCRIPTION[22m
  Download a file, given its CID.

  Query the ipfs-bch-wallet-consumer for a given CID. It will request the file
  status from the ipfs-file-pin-service connected to it. This is a good way
  to check if the file has been pinned by that service.
```

_See code: [src/commands/psffpp-info.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/psffpp-info.js)_

## `psf-bch-wallet psffpp-pin`

Pin a file to the PSFFPP network

```
[1mUSAGE[22m
  $ psf-bch-wallet psffpp-pin [-f <value>] [-n <value>]

[1mFLAGS[22m
  -f, --fileName=[4m<value>[24m  [2mfileName to pin to PSF network[22m
  -n, --name=[4m<value>[24m      [2mName of wallet[22m

[1mDESCRIPTION[22m
  Pin a file to the PSFFPP network

  This command leverages the psffpp-upload command. It will upload the file
  using that command, then use the CID returned by that command to generate
  a Proof-of-Burn and a Pin Claim transaction.
```

_See code: [src/commands/psffpp-pin.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/psffpp-pin.js)_

## `psf-bch-wallet psffpp-upload`

Upload a file to the IPFS node

```
[1mUSAGE[22m
  $ psf-bch-wallet psffpp-upload [-f <value>]

[1mFLAGS[22m
  -f, --fileName=[4m<value>[24m  [2mfilename to upload[22m

[1mDESCRIPTION[22m
  Upload a file to the IPFS node

  If you are trying to pin a file to the PSFFPP network, you do not need to run
  this command. This command is automatically  used by the psffpp-pin command to
  upload the file.

  This command is useful in isolation if you want to test uploading and passing
  files between IPFS nodes, independant of the PSFFPP.
```

_See code: [src/commands/psffpp-upload.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/psffpp-upload.js)_

## `psf-bch-wallet psffpp-upload2`

Upload a file to the psffpp-client

```
[1mUSAGE[22m
  $ psf-bch-wallet psffpp-upload2 [-f <value>]

[1mFLAGS[22m
  -f, --fileName=[4m<value>[24m  [2mfilename to upload[22m

[1mDESCRIPTION[22m
  Upload a file to the psffpp-client

  This command will upload a file to the psffpp-client via the REST API.
```

_See code: [src/commands/psffpp-upload2.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/psffpp-upload2.js)_

## `psf-bch-wallet send-bch`

Send BCH

```
[1mUSAGE[22m
  $ psf-bch-wallet send-bch [-n <value>] [-q <value>] [-a <value>]

[1mFLAGS[22m
  -a, --sendAddr=[4m<value>[24m  [2mCash address to send to[22m
  -n, --name=[4m<value>[24m      [2mName of wallet[22m
  -q, --qty=[4m<value>[24m       [2mQuantity in BCH[22m

[1mDESCRIPTION[22m
  Send BCH
```

_See code: [src/commands/send-bch.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/send-bch.js)_

## `psf-bch-wallet send-tokens`

Send Tokens

```
[1mUSAGE[22m
  $ psf-bch-wallet send-tokens [-n <value>] [-t <value>] [-a <value>] [-q <value>]

[1mFLAGS[22m
  -a, --sendAddr=[4m<value>[24m  [2mCash or SimpleLedger address to send to[22m
  -n, --name=[4m<value>[24m      [2mName of wallet[22m
  -q, --qty=[4m<value>[24m
  -t, --tokenId=[4m<value>[24m   [2mToken ID[22m

[1mDESCRIPTION[22m
  Send Tokens
```

_See code: [src/commands/send-tokens.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/send-tokens.js)_

## `psf-bch-wallet token-burn`

Burn a specific quantity of SLP tokens.

```
[1mUSAGE[22m
  $ psf-bch-wallet token-burn [-n <value>] [-q <value>] [-t <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m     [2mName of wallet[22m
  -q, --qty=[4m<value>[24m      [2mQuantity of tokens to burn. If quantity is 0, all tokens will be burned.[22m
  -t, --tokenId=[4m<value>[24m  [2mtokenId of token to burn[22m

[1mDESCRIPTION[22m
  Burn a specific quantity of SLP tokens.
```

_See code: [src/commands/token-burn.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-burn.js)_

## `psf-bch-wallet token-create-fungible`

Create a new SLP Type1 fugible token.

```
[1mUSAGE[22m
  $ psf-bch-wallet token-create-fungible [-n <value>] [-t <value>] [-m <value>] [-d <value>] [-q <value>] [-u <value>] [-h <value>] [-b]

[1mFLAGS[22m
  -b, --baton               [2m(optional Boolean) create a minting baton[22m
  -d, --decimals=[4m<value>[24m    [2mDecimals used by the token[22m
  -h, --hash=[4m<value>[24m        [2m(optional) Document hash of the group[22m
  -m, --tokenName=[4m<value>[24m   [2mName of token[22m
  -n, --walletName=[4m<value>[24m  [2mName of wallet to pay for transaction[22m
  -q, --qty=[4m<value>[24m         [2mQuantity of tokens to create[22m
  -t, --ticker=[4m<value>[24m      [2mTicker of the group[22m
  -u, --url=[4m<value>[24m         [2m(optional) Document URL of the group[22m

[1mDESCRIPTION[22m
  Create a new SLP Type1 fugible token.

  Creating a minting baton is optional. If a baton address is not specified, then the
  baton is burned and makes the it a 'fixed supply' token.
```

_See code: [src/commands/token-create-fungible.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-create-fungible.js)_

## `psf-bch-wallet token-create-group`

Create a new SLP Group token.

```
[1mUSAGE[22m
  $ psf-bch-wallet token-create-group [-n <value>] [-m <value>] [-t <value>] [-q <value>] [-u <value>] [-h <value>]

[1mFLAGS[22m
  -h, --hash=[4m<value>[24m        [2m(optional) Document hash of the group[22m
  -m, --tokenName=[4m<value>[24m   [2mName of token[22m
  -n, --walletName=[4m<value>[24m  [2mName of wallet to pay for transaction[22m
  -q, --qty=[4m<value>[24m         [2m(optional) Quantity of tokens to create. Defaults to 1[22m
  -t, --ticker=[4m<value>[24m      [2mTicker of the group[22m
  -u, --url=[4m<value>[24m         [2m(optional) Document URL of the group[22m

[1mDESCRIPTION[22m
  Create a new SLP Group token.

  Group tokens are used to generate NFTs. Read more about the relationship:
  https://github.com/Permissionless-Software-Foundation/bch-js-examples/tree/master/bch/applications/slp/nft
```

_See code: [src/commands/token-create-group.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-create-group.js)_

## `psf-bch-wallet token-create-nft`

Create a new SLP Group token.

```
[1mUSAGE[22m
  $ psf-bch-wallet token-create-nft [-n <value>] [-m <value>] [-t <value>] [-u <value>] [-h <value>] [-i <value>]

[1mFLAGS[22m
  -h, --hash=[4m<value>[24m        [2m(optional) Document hash of the group[22m
  -i, --tokenId=[4m<value>[24m     [2mToken ID of Group token to burn, to generate the NFT[22m
  -m, --tokenName=[4m<value>[24m   [2mName of token[22m
  -n, --walletName=[4m<value>[24m  [2mName of wallet to pay for transaction[22m
  -t, --ticker=[4m<value>[24m      [2mTicker of the group[22m
  -u, --url=[4m<value>[24m         [2m(optional) Document URL of the group[22m

[1mDESCRIPTION[22m
  Create a new SLP Group token.

  Group tokens are used to generate NFTs. Read more about the relationship:
  https://github.com/Permissionless-Software-Foundation/bch-js-examples/tree/master/bch/applications/slp/nft
```

_See code: [src/commands/token-create-nft.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-create-nft.js)_

## `psf-bch-wallet token-info`

Get information on a token

```
[1mUSAGE[22m
  $ psf-bch-wallet token-info [-t <value>]

[1mFLAGS[22m
  -t, --tokenId=[4m<value>[24m  [2mThe ID of the token to lookup[22m

[1mDESCRIPTION[22m
  Get information on a token

  Retrieves the Genesis data for a token. If PS002 mutable and immutable data is
  attached to the token, it is retrieved from IPFS.
```

_See code: [src/commands/token-info.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-info.js)_

## `psf-bch-wallet token-mda-tx`

Create TXID for token mutable data

```
[1mUSAGE[22m
  $ psf-bch-wallet token-mda-tx [-n <value>] [-a <value>]

[1mFLAGS[22m
  -a, --mda=[4m<value>[24m         [2mMutable data address[22m
  -n, --walletName=[4m<value>[24m  [2mName of wallet to pay for transaction[22m

[1mDESCRIPTION[22m
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
[1mUSAGE[22m
  $ psf-bch-wallet token-mint [-n <value>] [-q <value>] [-t <value>] [-r <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m      [2mName of wallet to pay for transaction[22m
  -q, --qty=[4m<value>[24m       [2mQuantity of tokens to create[22m
  -r, --receiver=[4m<value>[24m  [2m(optional) Receiver of new baton. Defaults to same wallet. null burns baton.[22m
  -t, --tokenId=[4m<value>[24m   [2mToken ID[22m

[1mDESCRIPTION[22m
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
[1mUSAGE[22m
  $ psf-bch-wallet token-tx-history [-t <value>]

[1mFLAGS[22m
  -t, --tokenId=[4m<value>[24m  [2mThe ID of the token to lookup[22m

[1mDESCRIPTION[22m
  Get transaction history for a token

  Retrieves the transaction history for a token. This is every transaction that
  has involved the token. The data is more informative for an NFT than it is for
  a fungible token.
```

_See code: [src/commands/token-tx-history.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/token-tx-history.js)_

## `psf-bch-wallet token-update`

Update token mutable data.

```
[1mUSAGE[22m
  $ psf-bch-wallet token-update [-n <value>] [-c <value>]

[1mFLAGS[22m
  -c, --cid=[4m<value>[24m   [2mA CID that resolves to the new mutable data JSON[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
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
[1mUSAGE[22m
  $ psf-bch-wallet vote-addrs

[1mDESCRIPTION[22m
  Collect Voting Addresses

  This command is run to prepare for a governance vote. It looks up the addresses
  holding all NFTs tied to a common group token. This list of addresses can
  then be used to air-drop voting tokens.
```

_See code: [src/commands/vote-addrs.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/vote-addrs.js)_

## `psf-bch-wallet vote-airdrop`

Airdrop Voting Tokens

```
[1mUSAGE[22m
  $ psf-bch-wallet vote-airdrop [-n <value>] [-a <value>] [-t <value>]

[1mFLAGS[22m
  -a, --addrs=[4m<value>[24m    [2mJSON string containing array of addresses[22m
  -n, --name=[4m<value>[24m     [2mName of wallet holding voting tokens[22m
  -t, --tokenId=[4m<value>[24m  [2mToken ID to air-drop to each address[22m

[1mDESCRIPTION[22m
  Airdrop Voting Tokens

  This command is used to air-drop voting tokens to an array of addresses. It
  is expected the array of addresses is generated from the vote-addrs command.
  One token will be sent to each address in the list.
```

_See code: [src/commands/vote-airdrop.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/vote-airdrop.js)_

## `psf-bch-wallet wallet-addrs`

List the different addresses for a wallet.

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-addrs [-n <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  List the different addresses for a wallet.
```

_See code: [src/commands/wallet-addrs.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-addrs.js)_

## `psf-bch-wallet wallet-balances`

Display the balances of the wallet

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-balances [-n <value>] [-v]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m
  -v, --verbose       [2mShow verbose UTXO information[22m

[1mDESCRIPTION[22m
  Display the balances of the wallet
```

_See code: [src/commands/wallet-balances.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-balances.js)_

## `psf-bch-wallet wallet-create`

Generate a new HD Wallet.

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-create [-n <value>] [-d <value>]

[1mFLAGS[22m
  -d, --description=[4m<value>[24m  [2mDescription of the wallet[22m
  -n, --name=[4m<value>[24m         [2mName of wallet[22m

[1mDESCRIPTION[22m
  Generate a new HD Wallet.
```

_See code: [src/commands/wallet-create.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-create.js)_

## `psf-bch-wallet wallet-list`

List existing wallets.

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-list

[1mDESCRIPTION[22m
  List existing wallets.
```

_See code: [src/commands/wallet-list.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-list.js)_

## `psf-bch-wallet wallet-optimize`

Optimize a wallet

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-optimize [-n <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  Optimize a wallet

  This command 'optimizes' a wallet by consolidating the UTXOs with in it. This
  consolidation can significantly reduce the number of API calls, which speeds
  up the the network calls and results in an improved user experience (UX).
```

_See code: [src/commands/wallet-optimize.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-optimize.js)_

## `psf-bch-wallet wallet-remove`

Remove an existing wallet.

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-remove [-n <value>]

[1mFLAGS[22m
  -n, --name=[4m<value>[24m  [2mName of wallet[22m

[1mDESCRIPTION[22m
  Remove an existing wallet.
```

_See code: [src/commands/wallet-remove.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-remove.js)_

## `psf-bch-wallet wallet-scan`

Scan different derivation paths of a 12 word mnemonic for tx history.

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-scan [-m <value>]

[1mFLAGS[22m
  -m, --mnemonic=[4m<value>[24m  [2mmnemonic phrase to generate addresses, wrapped in quotes[22m

[1mDESCRIPTION[22m
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
[1mUSAGE[22m
  $ psf-bch-wallet wallet-service [-s <value>]

[1mFLAGS[22m
  -s, --select=[4m<value>[24m  [2mSwitch to a given IPFS ID for wallet service.[22m

[1mDESCRIPTION[22m
  List and/or select a wallet service provider.
```

_See code: [src/commands/wallet-service.js](https://github.com/Permissionless-Software-Foundation/psf-bch-wallet/blob/vv2.14.2/src/commands/wallet-service.js)_

## `psf-bch-wallet wallet-service-test`

Run end-to-end tests on the selected wallet service.

```
[1mUSAGE[22m
  $ psf-bch-wallet wallet-service-test

[1mDESCRIPTION[22m
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
[1mUSAGE[22m
  $ psf-bch-wallet wallet-sweep [-n <value>] [-m <value>] [-w <value>] [-d <value>]

[1mFLAGS[22m
  -d, --derivation=[4m<value>[24m  [2mDerivation path. Will default to 245 if not specified. Common values are 245, 145, and 0[22m
  -m, --mnemonic=[4m<value>[24m    [2m12-word mnemonic phrase, wrapped in quotes[22m
  -n, --name=[4m<value>[24m        [2mname of receiving wallet[22m
  -w, --wif=[4m<value>[24m         [2mWIF private key controlling funds of a single address[22m

[1mDESCRIPTION[22m
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
