const Market = artifacts.require("NFTMarket");

module.exports = async function(callback) {
  try {
    const market = await Market.deployed()
    let r = await market.fetchMarketItems.call( );
    console.log(JSON.stringify(  r, null , 2 ) );
  
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
