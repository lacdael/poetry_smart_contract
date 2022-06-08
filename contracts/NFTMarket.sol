//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarket is IERC721Receiver, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; //total number of items ever created
    Counters.Counter private _itemsSold; //total number of items sold
    
    using SafeMath for uint256;

    IERC721[] public approvedContracts;
    
    uint256 public tax = 4;
    
    uint256 public inflationCap = 2;
    
    function getMaxSalePrice() external returns ( uint256 ) {
        return _highest.mul( inflationCap );
    }

    function setInflationCap( uint256 f ) external onlyOwner {
        inflationCap = f;
    }

    uint256 private _highest = 110000000000000000000;

    constructor(){
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller; //person selling the nft
        address payable owner; //owner of the nft
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address  seller,
        address  owner,
        uint256 price,
        bool sold
    );

    function setTax(uint _tax) public returns(uint) {
         if(msg.sender == address(this) ){
             tax = _tax;
         }
         return tax;
    }

    function contractIsApproved( IERC721 _contract ) internal view returns ( bool ) {
        for ( uint256 i = 0; i < approvedContracts.length; i++ ) {
            if ( _contract == approvedContracts[ i ] ) return true;
        }
        return false;
    }

    function addApprovedContract( IERC721 _contract ) external onlyOwner {
        approvedContracts.push( _contract );
    }

    function rmvApprovedContract( IERC721 _contract ) external onlyOwner {
        for ( uint256 i = 0; i < approvedContracts.length ; i++ ) {
            if ( approvedContracts[ i ] == _contract ) {
                approvedContracts[ i ] = approvedContracts[ approvedContracts.length - 1 ];
                approvedContracts.pop();
            }
        }
    }

    function onERC721Received(
            address, 
            address, 
            uint256, 
            bytes calldata
            )external override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    } 

    /// @notice function to create market item
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price) external nonReentrant{
        require( contractIsApproved( IERC721( nftContract ) ), "Contract must be approved" );

        require( price <= _highest.mul(2),"Inflation is capped");
         
        _itemIds.increment(); //add 1 to the total number of items ever created
         uint256 itemId = _itemIds.current();

         idMarketItem[itemId] = MarketItem(
             itemId,
             nftContract,
             tokenId,
             payable(msg.sender), //address of the seller putting the nft up for sale
             payable(address(0)), //no owner yet (set owner to empty address)
             price,
             false
         );

            //transfer ownership of the nft to the contract itself
            IERC721( nftContract ).safeTransferFrom( msg.sender, address(this) , tokenId );

            if ( price > _highest ) _highest = price;

            emit MarketItemCreated(
                itemId,
             nftContract,
             tokenId,
             msg.sender,
             address(0),
             price,
             false);

        }

        function removeMarketItem( address nftContract , uint256 itemId ) external nonReentrant {
            uint tokenId = idMarketItem[itemId].tokenId;
            require( idMarketItem[itemId].seller == msg.sender , "The caller must be the seller");
            require( ! idMarketItem[itemId].sold , "The item must be available");
            
            IERC721( nftContract ).safeTransferFrom(address(this), msg.sender, tokenId);
    
            idMarketItem[itemId].sold = true;
        }

        /// @notice function to create a sale
        function createMarketSale(
            address nftContract,
            uint256 itemId
            ) public payable nonReentrant{
                uint price = idMarketItem[itemId].price;
                uint tokenId = idMarketItem[itemId].tokenId;

                require(! idMarketItem[itemId].sold, "The item has been sold");
                require(msg.value == price, "Please submit the asking price in order to complete purchase");

            uint256 toDev = price.div(100).mul( tax );
            uint256 toSeller = price.sub( toDev );

            idMarketItem[itemId].seller.transfer( toSeller );
            payable( owner() ).transfer( toDev );
           
            //transfer ownership of the nft from the contract itself to the buyer
            IERC721( nftContract ).safeTransferFrom(address(this), msg.sender, tokenId);

            idMarketItem[itemId].owner = payable(msg.sender); //mark buyer as new owner
            idMarketItem[itemId].sold = true; //mark that it has been sold
            _itemsSold.increment(); //increment the total number of Items sold by 1
        }


        /// @notice total number of items unsold on our platform
        function fetchMarketItems() public view returns (MarketItem[] memory){
            uint itemCount = _itemIds.current(); //total number of items ever created
            uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
            uint currentIndex = 0;

            MarketItem[] memory items =  new MarketItem[](unsoldItemCount);

            //loop through all items ever created
            for(uint i = 0; i < itemCount; i++){

                //get only unsold item
                //check if the item has not been sold
                //by checking if the owner field is empty
                if(idMarketItem[i+1].owner == address(0)){
                    //yes, this item has never been sold
                    uint currentId = idMarketItem[i + 1].itemId;
                    MarketItem storage currentItem = idMarketItem[currentId];
                    items[currentIndex] = currentItem;
                    currentIndex += 1;

                }
            }
            return items; //return array of all unsold items
        }

        /// @notice fetch list of NFTS owned/bought by this user
        function fetchMyNFTs() public view returns (MarketItem[] memory){
            //get total number of items ever created
            uint totalItemCount = _itemIds.current();

            uint itemCount = 0;
            uint currentIndex = 0;


            for(uint i = 0; i < totalItemCount; i++){
                //get only the items that this user has bought/is the owner
                if(idMarketItem[i+1].owner == msg.sender){
                    itemCount += 1; //total length
                }
            }

            MarketItem[] memory items = new MarketItem[](itemCount);
            for(uint i = 0; i < totalItemCount; i++){
               if(idMarketItem[i+1].owner == msg.sender){
                   uint currentId = idMarketItem[i+1].itemId;
                   MarketItem storage currentItem = idMarketItem[currentId];
                   items[currentIndex] = currentItem;
                   currentIndex += 1;
               }
            }
            return items;

        }

}
