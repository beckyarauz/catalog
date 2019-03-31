import React, { Component } from 'react';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Confirmation from './Confirmation';
import { withStyles } from '@material-ui/core/styles';

import api from '../../api';

const styles = {
  productContainer :{
    marginTop:'20px',
    display:'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card :{
    flex: 1,
  },
}
  
class Bookmarks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products:null,
      openDetail: false,
      openConfirmation:false,
      delete:{},
      message:'',
      error:'',
      selectedProduct:{},
      isOwnProduct:false,
      isLogged:false    
    }
  }

  async componentWillMount(){
    let data = await api.isLoggedIn();
    this.setState(stata => ({isLogged: data.isLogged}))
  }
  componentDidMount(){
    this.setState(currentState => ({products: this.props.products}))
  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.message !== this.state.message){
      setTimeout(() =>{
        this.setState(currentState => ({message: null}))
      }, 3000)
    }
    if(prevState.error !== this.state.error){
      setTimeout(() =>{
        this.setState(currentState => ({error: null}))
      }, 3000)
    }
    if(prevProps.products !== this.props.products){
      this.setState(currentState => ({products: this.props.products}))
    }
  }
  handleClickOpen = (value) => {
    this.setState(currentState => ({
      openDetail: true,
      selectedProduct:value
    }));
  };
  handleClose = (value) => {
    this.setState({ openDetail: false});
  };
  handleCloseConfirmation = (value) => {
    this.setState({ openConfirmation: false});
  };
  handleOpenConfirmation = (id) => {
    this.setState(state => ({openConfirmation:true, delete:{id}}));
  };
  handleCloseEdit = (value) => {
    this.setState({ openEdit: false});
  };
  handleContactSeller = async (product) => {
    console.log('Bookmarks contact',product)
    this.props.handleClickOpenContact(product)
  }
  handleConfirmation = async (value) => {
    if(value){
        await this.props.handleRemove(this.state.delete.id);
        this.props.handleUpdate();
    } else {
      console.log('you said no')
    }
  }

  render() {
    return (
      <div className={this.props.classes.productContainer}>
      
        <Confirmation
          open={this.state.openConfirmation}
          onClose={this.handleCloseConfirmation}
          product={this.state.delete}
          message={`Are you sure you want to remove from Bookmarks?`}
          onConfirm={this.handleConfirmation}
        />
        <ProductDetail
          product={this.state.selectedProduct}
          open={this.state.openDetail}
          onClose={this.handleClose}
        />
        {this.state.message && <div className="info">
          {this.state.message}
        </div>}
        {this.state.error && <div className="info info-danger">
          {this.state.error}
        </div>}
        {
          this.state.products && (this.state.products.length > 0) && this.state.products.map((product,idx) => {
            return <ProductCard 
                      product={product}
                      contactSeller={this.handleContactSeller}
                      remove={this.handleOpenConfirmation} 
                      className={this.props.classes.card}
                      isOwner={this.props.isOwner}
                      isLogged={this.state.isLogged}
                      key={product._id}
                      bookmarked={true}
                      detailHandler={this.handleClickOpen}/>
                      
          })
        }
      </div>
    );
  }
}

export default withStyles(styles)(Bookmarks);