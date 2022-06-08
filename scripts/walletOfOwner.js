const NFT = artifacts.require("NFT");

module.exports = async function(callback) {
  try {
    const nft = await NFT.deployed()
    r = await nft.walletOfOwner.call( "0xb752bF150542E1ce4756405BAc79f9674f13466f"); 
    console.log(JSON.stringify(  r, null , 2 ) );

  
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
