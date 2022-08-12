const NFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");

module.exports = async function(callback) {
  try {
    const nft = await NFT.deployed()
    const market = await Market.deployed()
    const item = "1";
    console.log(`Removing sale of NFT: ${ item } `)
    let r = await market.removeMarketItem( nft.address , item );
    console.log(JSON.stringify(  r , null , 2 ) );
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
