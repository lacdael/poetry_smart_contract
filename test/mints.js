const NFT = artifacts.require("./NFT.sol");
const Market = artifacts.require("./NFTMarket.sol");

const assertAddress = (address) => {
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
};

contract("NFT", (accounts) => {

  const test= it("mint a bunch", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let r;

    const arr = [
          'Life giving all powerful one, Light bringer to herald sweet dawn, The father, the sun of heaven, The name for god in countless tongues. ',   
          'Reflected out from the inside, Our Gods can never truly die, Earthly beings here for the ride, Smiled down on by gods who guide. ',
          "Pull all shadows out of their hides, Face the chaos with open eyes, You don't know without having tried, Never turn back, walk on with pride. ",
          'Day was destroyed but now reborn, Cold will gradually become warm, Dew and wind act to cool skin, Eyes wake as skies lighten. ',
          "Day was set aside from the night, Owing to the creator's might, The artist's blue hour of light Ma, kes many a magical sight, ",
    ];

      try{
    let tkn;
    for ( let i =0; i < arr.length; i++) {
        r = await nftInst.textBody( arr[i] , { from:accounts[0] } );
        console.log(`textBody()`);
        console.log(JSON.stringify(  r, null , 2 ) );

        r = await nftInst.mint( arr[i] , { from:accounts[0] } );
        console.log(`mint()`);
        console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
        tkn = r["receipt"]["logs"][0]["args"]["tokenId"];

        r = await nftInst.tokenURI.call( tkn ); 
        console.log(`tokenURI( ${tkn} )`);
        console.log(JSON.stringify(  r, null , 2 ) );
    
    
    
    }
      }catch(e){
        console.log( e );
      }

 });

});

const  assertRevert = async (promise, message) => {
  let noFailureMessage;
  try {
    await promise;

    if (!message) { 
      noFailureMessage = 'Expected revert not received' 
    } else {
      noFailureMessage = message;
    }

    assert.fail();
  } catch (error) {
    if (noFailureMessage) {
      assert.fail(0, 1, message);
    }
    const revertFound = error.message.search('revert') >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};

const advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime()
    }, (err, result) => {
      if (err) { return reject(err) }
      const newBlockHash = web3.eth.getBlock('latest').hash

      return resolve(newBlockHash)
    })
  })
}
