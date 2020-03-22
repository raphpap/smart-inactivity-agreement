# The Anti-Social Social Challenge

# Elevator Pitch
Unconsciously addicted to social networks? Don't worry, we all are. Fear not! The Anti-Social Social Challenge is here to incentivize us all to tone it down a notch. Ever got paid to do nothing?

# Description
The goal of the Anti-Social Social Challenge is to incentivize people to reduce their usage of social platforms by going cold-turkey on Facebook for a month.

For starters, users wanting to participate to the challenge will need to grant access to some of their information (posts, likes, photos and videos) to a Facebook Application. Afterwards, using the Ethereum blockchain along with the Chainlink oracle network, they will need to register to a Smart-Inactivity-Contract by sending their info and a collateral (in the form of Ethereum).

The contract will then pull their current latest activity on the platform. The challenge is now to stay inactive for a month. If the user either posts, likes, or publish a photo or video, his balance is redistributed equally to all other users actively registered in the contract. However, if after a whole month, his current latest activity hasn't changed, the user will get back his collateral plus any redistributions he was part of.

Don't forget to share about the challenge before registering! The more people registered, the more redistributions you might get!

# Demo

*Make sure that you have [Metamask](https://metamask.io/) installed in your browser*

Website: https://anti-social-social-challenge.s3.amazonaws.com/index.html
Ethereum contract address: https://ropsten.etherscan.io/address/0x89ffaff8c9414cdbff0dc078bd6ae4964298fc0a

# Future Development
## Dapp and Facebook access granting backend
The next step would be to finalize the Dapp to not use the Facebook Graph Api Explorer Tool. Before registering and sending ETH, the user would need to grant a Facebook App the access to some of his Facebook profile's info through a backend that would simply encrypt the user's access token using an AES_KEY. The Dapp would then allow the user to send his facebook id, encrypted access key, and some ETH, to register to the contract. Since it's possible to get a user access token with a valid duration of a month, we won't have an issue for a one-month challenge.

## Mupliple payment methods
Ideally, the user would have more than one way to fund the contract and all users would need to deposit the same cash value of collateral.

## Improve security
Again, ideally, multiple oracles (and external adapters) would be used to fetch the `latest activity` and the data would be aggregated.

## Improve contract
The contract is too costly to run in it's current state. Optimizations would likely have to be made for this project to be viable at a larger scale.

Also, currently, the contract has to be manually called in order to validate the final state of a user's contract. Ideally that process would be launched automatically via a cron job or a "Timer" External Adapter.

## Restrict registration
It would be nice to have a way to validate that the Facebook is real. We would need to find a way to validate that a user's previous activity history looks legitimate.

Proudly built for: [the Chainlink Hackathon](https://blog.chain.link/chainlink-virtual-hackaton-building-real-world-smart-contracts-using-off-chain-resources/)

# Local development
To run the project, you will need to:

- Deploy the `ExternalAdapter` on `AWS lambda`
    - Follow the steps in the [README of ExternalAdapter](./ExternalAdapter/README.md)
- [Run and fully setup a Chainlink Node](https://docs.chain.link/docs/running-a-chainlink-node)
    - [Create a bridge towards the lambda on your Node's dashboard](https://docs.chain.link/docs/node-operators)
    - Add the [JobSpec](./JobSpec/README.md) of this project to your Node
- Deploy and use the `InactivityContract`
    - Follow the steps in the [README of InactivityContract](./InactivityContract/README.md)
- Deploy and use the `Dapp`
    - Follow the steps in the [README of InactivityContract/dapp-src](./InactivityContract/dapp-src/README.md)

## Thanks
Many thanks to all those of [the Chainlink Discord Server](https://discord.gg/9nrz6y8) who supported us during the Hackathon.
