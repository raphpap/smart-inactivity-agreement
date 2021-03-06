const InactivityContract = artifacts.require('InactivityContract')
const CryptoJS = require('crypto-js')

// Client variables
const clientFbId = process.env.CLIENT_2_FB_ID
const encryptedFbAccessToken = CryptoJS.AES.encrypt(
  process.env.CLIENT_2_FB_ACCESS_TOKEN,
  process.env.AES_KEY
)

module.exports = async callback => {
  const mc = await InactivityContract.deployed()
  console.log('Creating request on contract:', mc.address)
  console.log(`Updating data for FbUser ${clientFbId}`)

  const tx = await mc.updateUser(
    clientFbId.toString(),
    encryptedFbAccessToken.toString()
  )
  callback(tx.tx)
}
