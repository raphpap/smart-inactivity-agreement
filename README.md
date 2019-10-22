# smart-inactivity-agreement

Due to the recent backlash against Facebook, we try to give an incentive for users to leave the platform.

A custom Node Adapter will need to connect to the Facebook API to fetch information on users using our app.

Basically, a Dapp would allow users to "stake" $20 worth of ETH as a promise that they won't login to Facebook for a certain amount of time. When a user is caught login in again, his $20 is redistributed to all the users that are currently respecting their own agreement. Beforehand, users will need to allow us to access their facebook info through OAUTH. Their FacebookId would be sent to the contract as a parameter.

In v1, users will simply lose their collateral if they don't respect their agreement.

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
