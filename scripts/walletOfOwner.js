const NFT = artifacts.require("NFT");

module.exports = async function(callback) {
  try {
    const wallet = "0xd86F0AA9D8433a80d7b7e7D693e68EF9847A494A"
    const nft = await NFT.deployed()
    r = await nft.walletOfOwner.call( wallet ); 
    console.log(JSON.stringify(  r, null , 2 ) );

  
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
