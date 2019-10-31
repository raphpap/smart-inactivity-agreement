const InactivityContract = artifacts.require('InactivityContract')

/*
  This script makes it easy to read the nbActiveUsers variable
  of the requesting contract.
*/

module.exports = async callback => {
  console.log('Reading current number of active users in the contract:')
  const mc = await InactivityContract.deployed()
  const nbActiveUsers = await mc.nbActiveUsers.call()
  callback(nbActiveUsers)
}
