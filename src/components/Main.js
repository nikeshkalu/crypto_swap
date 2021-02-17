import React,{Component} from 'react'
import BuyToken from './BuyToken'
import SellToken from './SellToken'


class Main extends Component{

constructor(props) {
    super(props);
    this.state = { 
      currentForm: 'buy'

    };
    
  }


	render(){
		let content
		if(this.state.currentForm==='buy'){
			content = <BuyToken
				           ethBalance={this.props.ethBalance}
      					   tokenBalance={this.props.tokenBalance}
      					   buyTokens={this.props.buyTokens}/>
		}
		else{
      	content = <SellToken
      	ethBalance={this.props.ethBalance}
      					   tokenBalance={this.props.tokenBalance}
      					   sellTokens={this.props.sellTokens}/>
		}
		
		return(
			<div>
			<br/><br/>
			<div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px'}}>
              <div className="content mr-auto ml-auto">
				       <div id="content">

						<div className="d-flex justify-content-between mb-3">
					          <button
					              className="btn btn-light"
					              onClick={(event) => {
					                this.setState({ currentForm: 'buy' })
					              }}
					            >
					            Buy
					          </button>
					          <span className="text-muted"></span>
					          <button
					              className="btn btn-light"
					              onClick={(event) => {
					                this.setState({ currentForm: 'sell' })
					              }}
					            >
					            Sell
					          </button>
					        </div>



				        <div className="card mb-4" >

				          <div className="card-body">

				          {content}


				          </div>

				        </div>

				      </div>
 
              </div>
            </main>
          </div>
        </div>
        </div>
			)
	}
}

export default Main