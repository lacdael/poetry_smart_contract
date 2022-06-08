const NFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");

module.exports = async function(deployer) {
  await deployer.deploy(NFT);
  const nft = await NFT.deployed()
  console.log( `NFT contract is deployed @ ${ nft.address }` );
  await deployer.deploy(Market);
  const market = await Market.deployed()
  console.log( `NFTMarket contract is deployed @ ${ market.address }` );

};

