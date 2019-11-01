# Inactivity Contract - TruffleBox

## Environment variables

See `.env.example` and read carefully to create your `.env` file by following the directions correctly

## Requirements

- NPM
- [nv](https://github.com/jcouture/nv) to load the environment variables

## Installation

```bash
npm install
```

## Deploy the contract

```bash
nv .env npm run migrate:live
```

## Helper Scripts

```bash
Funds the deployed contract with 4 Link tokens

nv .env npx truffle exec scripts/fund-contract.js --network live
```

```bash
Register the first user to the contract with a 1 ETH deposit

nv .env npx truffle exec scripts/register-client-1.js --network live
```

```bash
Register the second user to the contract with a 1 ETH deposit

nv .env npx truffle exec scripts/register-client-2.js --network live
```

```bash
Updating state of the first user’s state in the contract
If he has more recent activity, his balance is redistributed

npx truffle exec scripts/update-client-1.js --network live
```

```bash
Updating state of the second user’s state in the contract
If he has more recent activity, his balance is redistributed

npx truffle exec scripts/update-client-1.js --network live
```

# Note

To avoir a possible division by 0, a user's balance is divided by the number of other active users in the contract + 1.

Therefore, the contract itself keeps a part of every occuring redistribution (equal to that of other users)
