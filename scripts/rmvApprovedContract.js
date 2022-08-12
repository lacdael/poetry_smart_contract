const NFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");

module.exports = async function(callback) {
  try {
    
    const address = "0xee2296E9adecCE936A9F841D4af752455bF28515"  
    const market = await Market.deployed()
    console.log(`Removing contract... ${ address }`)
    let r = await market.rmvApprovedContract( address );
    console.log(`transaction: ${ r["tx"] }`);
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
