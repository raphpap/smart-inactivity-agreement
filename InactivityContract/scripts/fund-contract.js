const InactivityContract = artifacts.require('InactivityContract')
const LinkToken = artifacts.require('LinkToken')

/*
  This script is meant to assist with funding the requesting
  contract with LINK. It will send 1 LINK to the requesting
  contract for ease-of-use. Any extra LINK present on the contract
  can be retrieved by calling the withdrawLink() function.
*/

const payment = '4000000000000000000'

module.exports = async callback => {
  const mc = await InactivityContract.deployed()
  const tokenAddress = await mc.getChainlinkToken()
  const token = await LinkToken.at(tokenAddress)
  console.log('Funding contract:', mc.address)
  const tx = await token.transfer(mc.address, payment)
  callback(tx.tx)
}
