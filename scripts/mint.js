const NFT = artifacts.require("NFT");

module.exports = async function(callback) {
  try {
    const nft = await NFT.deployed()
    const arr = [
          '-tamed_monsters.png',
          "Day was set aside from the night,\nOwing to the creator's might,\nThe artist's blue hour of light,\nMakes many a magical sight.",
    ];  
    
    /*
          [ '-the-balance-of-power.png', 
          '-choose-your-gods.png',
          'Life giving all powerful one,\nLight bringer to herald sweet dawn,\nThe father, the sun of heaven,\nThe name for god in countless tongues.',   
          '-born-again.png',
          'Reflected out from the inside,\nOur Gods can never truly die,\nEarthly beings here for the ride,\nSmiled down on by gods who guide.',
          '-lost-way.png',
          "Pull all shadows out of their hides,\nFace the chaos with open eyes,\nYou don't know without having tried,\nNever turn back, walk on with pride.",
          '-tamed-monsters.png',
          'Day was destroyed but now reborn,\nCold will gradually become warm,\nDew and wind act to cool skin,\nEyes wake as skies lighten.',
          '-the-eternal-battle.png',
          "Day was set aside from the night,\nOwing to the creator's might,\nThe artist's blue hour of light,\nMakes many a magical sight.",
          '-towers-fall.png',
    ];*/

    
    for( let i = 0; i < arr.length; i++ ){
        console.log(`Minting token... ${ arr[i] }`)
        await nft.mint( arr[i] )
            .on('receipt', async function(receipt) {
                console.log('Token address: ', receipt.logs[0].address)
                console.log('Token owner: ', receipt.logs[0].args.to)
                console.log('Token ID: ', Number(receipt.logs[0].args.tokenId))
            });
    };
  
  } catch(error) {
    console.log(error)
  }
  
    callback()
}
