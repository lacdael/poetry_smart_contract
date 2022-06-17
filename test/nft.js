const NFT = artifacts.require("./NFT.sol");
const Market = artifacts.require("./NFTMarket.sol");

const assertAddress = (address) => {
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
};

contract("NFT", (accounts) => {


  const test00 = it("get name and symbol", async () => {
    let inst = await NFT.deployed();
    console.log(`NFT instance@: ${ inst.address }`);
    assertAddress( inst.address );
    
    let r;
    
    r = await inst.name.call();
    console.log(`name.call()`);  
    console.log(JSON.stringify(  r, null , 2 ) );
    
    r = await inst.symbol.call(); 
    console.log(`symbol.call( )`);
    console.log(JSON.stringify(  r, null , 2 ) );
    
    r = await inst.nftBaseURI.call(); 
    console.log(`baseURI.call( )`);
    console.log(JSON.stringify(  r, null , 2 ) );


  });

  const test01 = it("get baseURI, getWallet, fail on getTokenURI( 1 )", async () => {
    let inst = await NFT.deployed();
    console.log(`NFT instance@: ${ inst.address }`);
    assertAddress( inst.address );
    
    let r;
    
    r = await inst.nftBaseURI.call();
    console.log(`baseURI.call()`);  
    console.log(JSON.stringify(  r, null , 2 ) );
    
    r = await inst.walletOfOwner.call( accounts[0] ); 
    console.log(`walletOfOwner.call( ${accounts[0] } )`);
    console.log(JSON.stringify(  r, null , 2 ) );

    r = await inst.tokenURI.call( "1" ); 
    console.log(`tokenURI( 1 )`);
    console.log(JSON.stringify(  r, null , 2 ) );
  });

  const test02 = it("fail to setBaseURI", async () => {
    let inst = await NFT.deployed();
    console.log(`NFT instance@: ${ inst.address }`);
    assertAddress( inst.address );
    
    await inst.setBaseURI( "http://www.site.com/", { from: accounts[1] } );
  
  });
  
  const test03 = it("fail to mint", async () => {
    let inst = await NFT.deployed();
    console.log(`NFT instance@: ${ inst.address }`);
    assertAddress( inst.address );
    
    await inst.mint( "Try and mint this!!", { from: accounts[1] } );

  });

  const test04 = it("setbaseURI, mint, getWallet, get TokenURI( 1 )", async () => {
    let inst = await NFT.deployed();
    console.log(`NFT instance@: ${ inst.address }`);
    assertAddress( inst.address );
    
    let r;
    r = await inst.setBaseURI( "http://www.site.com/", { from: accounts[0] } );
    console.log(`setBaseURI()`);
     console.log(`transaction: ${ r["tx"] }`);

    r = await inst.mint("This is may new token!", { from:accounts[0] } );
    console.log(`mint()`);
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

    r = await inst.walletOfOwner.call( accounts[0] ); 
    console.log(`walletOfOwner.call( ${accounts[0] } )`);
    console.log(JSON.stringify(  r, null , 2 ) );

    r = await inst.tokenURI.call( r[0] ); 
    console.log(`tokenURI( ${ r[0] } )`);
    console.log(JSON.stringify(  r, null , 2 ) );
      
  });      

});

contract("NFT & NFTMarket", (accounts) => {
  
  const test01 = it("fail get approvedContracts", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await marketInst.approvedContracts.call( "0" );
    console.log(`approvedContracted`);
    console.log(JSON.stringify(  r, null , 2 ) );

  });  
  
  const test02 = it("get tax, fail set Tax", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await marketInst.tax.call();
    console.log(`tax`);
    console.log(JSON.stringify(  r, null , 2 ) );

    r = await marketInst.setTax( 4 , { from : accounts[1] } );
    console.log(`setTax( 4, { from: ${ accounts[1] } } )`);
     console.log(`transaction: ${ r["tx"] }`);
  });

  const test03 = it("fail add approvedContract", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await marketInst.addApprovedContract( nftInst.address , { from : accounts[1] } );
    console.log(`addApprovedContract( ${ nftInst.address }, { from: ${ accounts[1] } } )`);
     console.log(`transaction: ${ r["tx"] }`);
    
  });  
  
  const test04 = it("add approvedContract, get approvedCOntracts, set tax, rmvApprovedContracts", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await marketInst.addApprovedContract( nftInst.address , { from : accounts[0] } );
    console.log(`addApprovedContract( ${ nftInst.address }, { from: ${ accounts[0] } } )`);
     console.log(`transaction: ${ r["tx"] }`);

    r = await marketInst.approvedContracts.call( "0" );
    console.log(`approvedContracted`);
    console.log(JSON.stringify(  r, null , 2 ) );

    r = await marketInst.setTax( 4 , { from : accounts[0] } );
    console.log(`setTax( 4, { from: ${ accounts[1] } } )`);
     console.log(`transaction: ${ r["tx"] }`);
  
    r = await marketInst.rmvApprovedContract( nftInst.address , { from : accounts[0] } );
    console.log(`rmvApprovedContract( ${ nftInst.address }, { from: ${ accounts[0] } } )`);
     console.log(`transaction: ${ r["tx"] }`);

  });  
  

 const test05= it("mint approvedContract, createMarketItem, getBalances, fetchMarketItems, creatMarketSale, fetchMayNFTs, getBalances", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;
    
    r = await nftInst.mint("This is may new token!", { from:accounts[0] } );
    console.log(`mint()`);
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
    let tkn = r["receipt"]["logs"][0]["args"]["tokenId"];
    
    r = await marketInst.addApprovedContract( nftInst.address , { from : accounts[0] } );
    console.log(`addApprovedContract( ${ nftInst.address }, { from: ${ accounts[0] } } )`);
    console.log(`transaction: ${ r["tx"] }`);

    let balance0 = await web3.eth.getBalance( accounts[0] );
    console.log(`account: ${ accounts[0] } ballence: ${ web3.utils.fromWei(balance0,"ether") }`);
    let balance1 = await web3.eth.getBalance( accounts[1] );
    console.log(`account: ${ accounts[1] } ballence: ${ web3.utils.fromWei(balance1,"ether") }`);
    let balance2 = await web3.eth.getBalance( accounts[2] );
    console.log(`account: ${ accounts[2] } ballence: ${ web3.utils.fromWei(balance2,"ether") }`);

     r = await nftInst.approve( marketInst.address , tkn );
     console.log(`approve( ${ marketInst.address } , ${ tkn } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
     
     r = await marketInst.createMarketItem(
     nftInst.address , tkn , web3.utils.toWei( "2", "ether" ) );
     console.log(`createMarketItem( ${ nftInst.address }, ${ tkn }, ${ web3.utils.toWei( "2", "ether" ) } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

     r = await marketInst.fetchMyNFTs.call();
     console.log(`fetchMyNFTs()`);
     console.log(JSON.stringify(  r, null , 2 ) );

     r = await marketInst.fetchMarketItems.call( );
     console.log(`fetchMarketItems()`);
     console.log(JSON.stringify(  r, null , 2 ) );

     r = await marketInst.createMarketSale(
     nftInst.address , tkn , { from: accounts[1] , value: web3.utils.toWei( "2", "ether" ) } );
     console.log(`createMarketSale( ${ nftInst.address }, ${ tkn }, { from : ${ accounts[1] } , value: ${ web3.utils.toWei( "2", "ether" ) } } )`);
     console.log(`transaction: ${ r["tx"] }`);

     balance0 = await web3.eth.getBalance( accounts[0] );
     console.log(`account: ${ accounts[0] } ballence: ${ web3.utils.fromWei(balance0,"ether") }`);
     balance1 = await web3.eth.getBalance( accounts[1] );
     console.log(`account: ${ accounts[1] } ballence: ${ web3.utils.fromWei(balance1,"ether") }`);
     balance2 = await web3.eth.getBalance( accounts[2] );
     console.log(`account: ${ accounts[2] } ballence: ${ web3.utils.fromWei(balance2,"ether") }`);

     //wallet of owner
     r = await nftInst.walletOfOwner.call( accounts[1] ); 
     console.log(`walletOfOwner.call( ${accounts[1] } )`);
     console.log(JSON.stringify(  r, null , 2 ) );

     r = await marketInst.fetchMarketItems.call( );
     console.log(`fetchMarketItems()`);
     console.log(JSON.stringify(  r, null , 2 ) );

  });  
 
  const test06= it("fail to buy, due to not enough funds", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await nftInst.mint("This is may new token!", { from:accounts[0] } );
    console.log(`mint()`);
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
    let tkn = r["receipt"]["logs"][0]["args"]["tokenId"];
    
    r = await marketInst.addApprovedContract( nftInst.address , { from : accounts[0] } );
    console.log(`addApprovedContract( ${ nftInst.address }, { from: ${ accounts[0] } } )`);
    console.log(`transaction: ${ r["tx"] }`);

    let balance0 = await web3.eth.getBalance( accounts[0] );
    console.log(`account: ${ accounts[0] } ballence: ${ web3.utils.fromWei(balance0,"ether") }`);
    let balance1 = await web3.eth.getBalance( accounts[1] );
    console.log(`account: ${ accounts[1] } ballence: ${ web3.utils.fromWei(balance1,"ether") }`);
    let balance2 = await web3.eth.getBalance( accounts[2] );
    console.log(`account: ${ accounts[2] } ballence: ${ web3.utils.fromWei(balance2,"ether") }`);

     r = await nftInst.approve( marketInst.address , tkn );
     console.log(`approve( ${ marketInst.address } , ${ tkn } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
     
     r = await marketInst.createMarketItem(
         nftInst.address , tkn , web3.utils.toWei( "2", "ether" ) );
     console.log(`createMarketItem( ${ nftInst.address }, ${ tkn }, ${ web3.utils.toWei( "2", "ether" ) } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

     r = await marketInst.fetchMarketItems.call( );
     console.log(`fetchMarketItems()`);
     console.log(JSON.stringify(  r, null , 2 ) );

     r = await marketInst.createMarketSale(
         nftInst.address , tkn , { from: accounts[1] , value: web3.utils.toWei( "1", "ether" ) } );
     console.log(`createMarketSale( ${ nftInst.address }, ${ tkn }, { from : ${ accounts[1] } , value: ${ web3.utils.toWei( "2", "ether" ) } } )`);
     console.log(JSON.stringify(  r, null , 2 ) );

  });  

  const test07 = it("fail to set inflationCap", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await marketInst.setInflationCap( 6 , { from : accounts[1] } );
    console.log(`setInflationCap( 6 , { from: ${ accounts[1] } } )`);
     console.log(`transaction: ${ r["tx"] }`);
    
  });  
  
  const test08= it("fail to sell due to above inflation cap", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await nftInst.mint("This is may new token!", { from:accounts[0] } );
    console.log(`mint()`);
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
    let tkn = r["receipt"]["logs"][0]["args"]["tokenId"];
    
    r = await marketInst.addApprovedContract( nftInst.address , { from : accounts[0] } );
    console.log(`addApprovedContract( ${ nftInst.address }, { from: ${ accounts[0] } } )`);
    console.log(`transaction: ${ r["tx"] }`);

    let balance0 = await web3.eth.getBalance( accounts[0] );
    console.log(`account: ${ accounts[0] } ballence: ${ web3.utils.fromWei(balance0,"ether") }`);
    let balance1 = await web3.eth.getBalance( accounts[1] );
    console.log(`account: ${ accounts[1] } ballence: ${ web3.utils.fromWei(balance1,"ether") }`);
    let balance2 = await web3.eth.getBalance( accounts[2] );
    console.log(`account: ${ accounts[2] } ballence: ${ web3.utils.fromWei(balance2,"ether") }`);

    r = await marketInst.getMaxSalePrice.call( );
     console.log(`getMaxSalePrice()`);
     console.log(JSON.stringify(  r, null , 2 ) );

    console.log(` max sell price: 110 one - ${ web3.utils.toWei("110", "ether") }`);

     r = await nftInst.approve( marketInst.address , tkn );
     console.log(`approve( ${ marketInst.address } , ${ tkn } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
     
     r = await marketInst.createMarketItem(
         nftInst.address , tkn , web3.utils.toWei( "221", "ether" ) );
     console.log(`createMarketItem( ${ nftInst.address }, ${ tkn }, ${ web3.utils.toWei( "2", "ether" ) } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

     r = await marketInst.fetchMarketItems.call( );
     console.log(`fetchMarketItems()`);
     console.log(JSON.stringify(  r, null , 2 ) );

     r = await marketInst.createMarketSale(
         nftInst.address , tkn , { from: accounts[1] , value: web3.utils.toWei( "1", "ether" ) } );
     console.log(`createMarketSale( ${ nftInst.address }, ${ tkn }, { from : ${ accounts[1] } , value: ${ web3.utils.toWei( "2", "ether" ) } } )`);
     console.log(JSON.stringify(  r, null , 2 ) );

  });  

  const test09= it("fail to remove someone elses market item", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let marketInst = await Market.deployed();
    console.log(`NFT instance@: ${ marketInst.address }`);
    assertAddress( marketInst.address );
   
    let r;

    r = await nftInst.mint("This is may new token!", { from:accounts[0] } );
    console.log(`mint()`);
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
    let tkn1 = r["receipt"]["logs"][0]["args"]["tokenId"];

    r = await nftInst.mint("This is may new token!", { from:accounts[0] } );
    console.log(`mint()`);
    console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
    let tkn2 = r["receipt"]["logs"][0]["args"]["tokenId"];
     
    r = await marketInst.addApprovedContract( nftInst.address , { from : accounts[0] } );
    console.log(`addApprovedContract( ${ nftInst.address }, { from: ${ accounts[0] } } )`);
    console.log(`transaction: ${ r["tx"] }`);

    let balance0 = await web3.eth.getBalance( accounts[0] );
    console.log(`account: ${ accounts[0] } ballence: ${ web3.utils.fromWei(balance0,"ether") }`);
    let balance1 = await web3.eth.getBalance( accounts[1] );
    console.log(`account: ${ accounts[1] } ballence: ${ web3.utils.fromWei(balance1,"ether") }`);
    let balance2 = await web3.eth.getBalance( accounts[2] );
    console.log(`account: ${ accounts[2] } ballence: ${ web3.utils.fromWei(balance2,"ether") }`);

    r = await marketInst.getMaxSalePrice.call( );
     console.log(`getMaxSalePrice()`);
     console.log(JSON.stringify(  r, null , 2 ) );

    console.log(` max sell price: 110 one - ${ web3.utils.toWei("110", "ether") }`);

     r = await nftInst.approve( marketInst.address , tkn1 );
     console.log(`approve( ${ marketInst.address } , ${ tkn1 } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
     
     r = await marketInst.createMarketItem(
         nftInst.address , tkn1 , web3.utils.toWei( "110", "ether" ) );
     console.log(`createMarketItem( ${ nftInst.address }, ${ tkn1 }, ${ web3.utils.toWei( "2", "ether" ) } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

     r = await nftInst.approve( marketInst.address , tkn2 );
     console.log(`approve( ${ marketInst.address } , ${ tkn2 } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

     r = await marketInst.createMarketItem(
         nftInst.address , tkn2 , web3.utils.toWei( "110", "ether" ) );
     console.log(`createMarketItem( ${ nftInst.address }, ${ tkn2 }, ${ web3.utils.toWei( "2", "ether" ) } )`);
     console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );

     r = await marketInst.fetchMarketItems.call( );
     console.log(`fetchMarketItems()`);
     console.log(JSON.stringify(  r, null , 2 ) );

     r = await marketInst.removeMarketItem( nftInst.address , tkn1 , { from: accounts[0] });
     console.log(`removeMarketItem( ${ nftInst.address }, ${ tkn1 })`);
     console.log(JSON.stringify(  r, null , 2 ) );
  
     r = await marketInst.removeMarketItem( nftInst.address , tkn2 , { from: accounts[1] });
     console.log(`removeMarketItem( ${ nftInst.address }, ${ tkn2 })`);
     console.log(JSON.stringify(  r, null , 2 ) );
  
  });  
    
  const test10= it("mint a bunch", async () => {
    let nftInst = await NFT.deployed();
    console.log(`NFT instance@: ${ nftInst.address }`);
    assertAddress( nftInst.address );
    
    let r;

    const arr = [ '-the-balance-of-power.png', 
          '-choose-your-gods.png',
          'Life giving all powerful one, Light bringer to herald sweet dawn, The father, the sun of heaven, The name for god in countless tongues.',   
          '-born-again.png',
          'Reflected out from the inside, Our Gods can never truly die, Earthly beings here for the ride, Smiled down on by gods who guide.',
          '-lost-way.png',
          "Pull all shadows out of their hides, Face the chaos with open eyes, You don't know without having tried, Never turn back, walk on with pride.",
          '-tamed-monsters.png',
          'Day was destroyed but now reborn, Cold will gradually become warm, Dew and wind act to cool skin, Eyes wake as skies lighten.',
          '-the-eternal-battle.png',
          "Day was set aside from the night, Owing to the creator's might, The artist's blue hour of light, Makes many a magical sight.",
          '-towers-fall.png',
    ];

    let tkn;
    for ( let i =0; i < arr.length; i++) {
        r = await nftInst.mint( arr[i++] , { from:accounts[0] } );
        console.log(`mint()`);
        console.log(JSON.stringify(  r["receipt"]["logs"][0]["args"], null , 2 ) );
        tkn = r["receipt"]["logs"][0]["args"]["tokenId"];

        r = await nftInst.tokenURI.call( tkn ); 
        console.log(`tokenURI( ${1} )`);
        console.log(JSON.stringify(  r, null , 2 ) );
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
