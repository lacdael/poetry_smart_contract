const NFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");

module.exports = async function(callback) {
  try {
    const nft = await NFT.deployed()
    const market = await Market.deployed()
    console.log(`Approving contract... ${ nft.address }`)
    let r = await market.addApprovedContract( nft.address );
    console.log(`transaction: ${ r["tx"] }`);
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
