const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer,investor]) => {
  let token, ethSwap

  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    // Transfer all tokens to EthSwap (1 million)
    await token.transfer(ethSwap.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()
      assert.equal(name, 'EthSwap')
    })

    it('contract has a Token Address', async () => {
      const tokens = await ethSwap.token()
      assert.equal(tokens,token.address )
    })

    it('contract has tokens', async () => {
      let balance = await token.balanceOf(ethSwap.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })

  })

  describe('buyTokens()',async()=>{
    let result 

    before(async () => {
      result = await ethSwap.buyTokens({from: investor, value:web3.utils.toWei('1', 'ether')})
      // console.log(await web3.eth.getBalance(ethSwap.address))
      // console.log(await web3.eth.getBalance(investor))
      
  })
    it('Allow user to buy token for a fixed price',async()=>{
      //checking investor balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(),tokens('100'))

      //checking ethswap balance after purchase
      let ethswapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethswapBalance.toString(),tokens('999900'))//1000000-100

      //check for ether in ethswap account
      ethswapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethswapBalance.toString(),web3.utils.toWei('1', 'ether'))


      // console.log(result.logs)
     


      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
 

    })
  })



  describe('sellTokens()',async()=>{
    let result 

    before(async () => {
      await token.approve(ethSwap.address,tokens('100'),{from:investor})
     result = await ethSwap.sellTokens(tokens('100'),{from:investor})
  })
    it('Allow user to sell token to ethSwap for a fixed price',async()=>{
      
       let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(),tokens('0'))

      let ethswapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethswapBalance.toString(),tokens('1000000'))

      ethswapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethswapBalance.toString(),web3.utils.toWei('0', 'ether'))

      //check logs to ensure the data was emitted correctly
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      //Failure
      await ethSwap.sellTokens(tokens('500'),{from:investor}).should.be.rejected;
    })


})
})