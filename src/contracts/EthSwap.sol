pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap";

    Token public token;

	uint public rate = 100;


	  constructor(Token _token) public {
	    token = _token;
		}


  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

   event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  // ...

  function buyTokens() public payable {
    // Calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    // Transfer tokens to the user
    token.transfer(msg.sender, tokenAmount); 

    // Emit an event
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public payable{

  //user can not  sell more token than they have
  require(token.balanceOf(address(this)) >= _amount);

  //Calculate amount of ether
  uint etherAmount = _amount/rate;

  require(address(this).balance>=etherAmount);

  // Perform sale
  token.transferFrom(msg.sender,address(this),_amount);
  msg.sender.transfer(etherAmount);

  emit TokensSold(msg.sender,address(token),_amount,rate);

  }

	
}

