const NFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");

module.exports = async function(callback) {
  try {
    const nft = await NFT.deployed()
    const market = await Market.deployed()
    const tkn = "3";
    console.log(`Selling NFT: ${ tkn } `)
    let r = await market.createMarketItem( nft.address , tkn, web3.utils.toWei( "1", "ether") );
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
