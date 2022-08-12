const NFT = artifacts.require("NFT");

module.exports = async function(callback) {
  try {
    const nft = await NFT.deployed()
    
      const wallet = "0xd86F0AA9D8433a80d7b7e7D693e68EF9847A494A"; 
      const burnAddress = "0x000000000000000000000000000000000000dEaD";
      
      const arr = [
      ];

    for( let i = 0; i < arr.length; i++ ){
        console.log(`Burning token... ${ arr[i] }`)
        await nft.transferFrom( wallet , burnAddress , arr[i] );
    };
    console.log("DONE"); 
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
