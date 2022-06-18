// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./NFTLibrary.sol";


contract NFT is ERC721, Ownable {

    mapping(uint256 => string) internal tokenData;
    string public nftBaseURI = "https://www.poetry.me.uk/nfts/";

    constructor() ERC721("Poetry NFTs", "POETRY") { }

    /**
     * @dev Returns the wallet of a given wallet. Mainly for ease for frontend devs.
     * @param _wallet The wallet to get the tokens of.
     */
    function walletOfOwner(address _wallet)
        public
        view
        returns (uint256[] memory)
        {
            
        uint256 tokenCount = balanceOf(_wallet);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_wallet, i);
        }
        return tokensId;
  
        }

    function textBody(string memory _s) public pure returns (string memory){
        string memory _text;
        string memory _tfront = '<text lengthAdjust="spacing" textLength="284" x="8" y="';
        string memory _tend = '</text>';
        bytes memory _b = bytes(_s);
        uint len = _b.length;
        uint count =0;
        uint last = 0;
        for(uint i = 0; i < len ; i++){
            if ( uint8(_b[i]) == (0x0A) || (len-1) == i ) {
                _text = string(abi.encodePacked(_text,_tfront, NFTLibrary.toString(count*20 + 120),'">', NFTLibrary.substring(_s, last , ( i+1 ) ) ,_tend));
                count++;
                last = i+1;
            }
        }
        return _text;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require( _tokenId <= totalSupply() && _tokenId != 0, "ERC721Metadata: URI query for nonexistent token");

        bytes memory _data = bytes( tokenData[_tokenId] );
        string memory _url;
        if ( _data[0] == 0x2D && bytes(nftBaseURI).length > 5 ) _url = string( abi.encodePacked(nftBaseURI, string(_data) ) );
        else {
            for ( uint8 i = 0 ; i < _data.length ; i++ ) {
                if ( _data[ i ] == 0x2D ) _data[i] = 0x20;
                if ( i >0 && _data[i -1] == 0x20 && ( _data[i] >= 0x61 && _data[i] <= 0x7A ) ) _data[i] =  bytes1( uint8(_data[i]) - 0x20);
                if ( _data[ i ] == 0x2E ) {
                    for ( i; i < _data.length; i++ ) _data[i] = 0x20;
                } 
            }

            uint8 bgR = uint8( ( ( block.number & 0xff ) + _tokenId ) % 0xFF );
            uint8 bgB = uint8( ( ( ( block.number>>8)&0xff ) + _tokenId ) % 0xFF );
            uint8 bgG = uint8( ( ( ( block.number>>16)&0xff ) + _tokenId ) % 0xFF );
 
            _url = string(abi.encodePacked(
                        'data:image/svg+xml;base64,',
                        NFTLibrary.encode(bytes(string(abi.encodePacked(
                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="poetryNFT-', NFTLibrary.toString( _tokenId ),'" height="300" width="300" style="background-color:rgba(',
                                        NFTLibrary.toString( bgR ) ,',',NFTLibrary.toString( bgB ) ,',', NFTLibrary.toString( bgG ), ',0.1);">',
                                        textBody( string( _data ) ),'</svg>'
                                        ) ) ) ) ) );
        }
        return
            string(
                    abi.encodePacked(
                        "data:application/json;base64,",
                        NFTLibrary.encode(bytes(
                                string(
                                    abi.encodePacked('{"name":"Poetry NFT#',NFTLibrary.toString( _tokenId ),'","id":"',NFTLibrary.toString(_tokenId),
                                        '","description":"Poetry NFTs","image":"',_url,'"}') ) ) ) ) );

    }

    function setBaseURI(string memory _base) onlyOwner external {
        nftBaseURI = _base;
    }

    function mint( string memory text ) external onlyOwner {
        require( bytes(text).length <= 256, "Data is too long");
        uint256 _tokenId = totalSupply() + 1;

        _mint(msg.sender, _tokenId);
        tokenData[_tokenId] = text;
    }
}
