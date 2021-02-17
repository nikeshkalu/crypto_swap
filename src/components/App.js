import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import NavBar from './NavBar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const ethBalance = await web3.eth.getBalance(accounts[0])

    // console.log(accounts[0])
    this.setState({
      accounts : accounts[0],
      ethBalance 
    })

     // Load Token
  const networkId = await web3.eth.net.getId()
  const tokenData = Token.networks[networkId]
  if(tokenData) {

    const token = new web3.eth.Contract(Token.abi, tokenData.address)
    console.log(tokenData.address)
    this.setState({ token })

    let tokenBalance = await token.methods.balanceOf(this.state.accounts).call()

    if(tokenBalance==null){
      tokenBalance = 0
    }
    this.setState({ tokenBalance: tokenBalance.toString() })
  } 
  else {
    window.alert('Token contract not deployed to detected network.')
  }

  //Load EthSwap
  const EthSwapData= EthSwap.networks[networkId]
  if( EthSwapData) {

    const ethSwap = new web3.eth.Contract( EthSwap.abi,  EthSwapData.address)
    // console.log( EthSwapData.address)
    this.setState({ ethSwap })


  } 
  else {
    window.alert('EthSwap contract not deployed to detected network.')
  }

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  buyTokens = (etherAmount) =>{
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({value:etherAmount,from:this.state.accounts}).on('transactionHash',(hash)=>{
       

    setTimeout(function(){   
    alert('Successfully Bought Token !!!!')
     window.location.reload(false)
     }, 10000);

    this.setState({
      loading: false
    }) 

    
  
    })


    
  }

   sellTokens = (tokenAmount) =>{
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address,tokenAmount).send({from:this.state.accounts}).on('transactionHash',(hash)=>{
       
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({from:this.state.accounts}).on('transactionHash',(hash)=>{
      this.setState({
      loading: false
    }) 


    setTimeout(function(){   
    alert('Successfully Sold Token !!!!')
     window.location.reload(false)
     }, 10000);

    
    
  
    })


    })


    
  }

  constructor(props) {
    super(props);
    this.state = { 
      accounts : '',
      token:{},
      ethSwap:{},
      ethBalance : '0',
      tokenBalance: '0',
      loading: false
    };
    
  }


  render() {
    let content
  if(this.state.loading) {

    content = <p id="loader" className="text-center"><br/><br/><br/><br/><br/>Loading...</p>
  } 
  else {
    content = <Main
      ethBalance={this.state.ethBalance}
      tokenBalance={this.state.tokenBalance}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens}
    />
  }

    return (
      <div>
      <NavBar account = {this.state.accounts}/>
      {content}
    
      </div>

      
    );
  }
}

export default App;
