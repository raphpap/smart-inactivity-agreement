# Inactivity Contract - TruffleBox

## Environment variables

See `.env.example`

## Requirements

- NPM

## Installation

```bash
npm install
```

## Test

```bash
npm test
```

## Deploy

```bash
npm run migrate:live
```

## Helper Scripts

```bash
To request the uptime and then transfer the funds if necessary
npx truffle exec scripts/request-uptime.js --network live
```

```bash
After waiting at least 3 blocks, this will read the latest uptime
npx truffle exec scripts/read-uptime.js --network live
```
