import React, { Component } from 'react';

import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import ProductEdit from './ProductEdit';
import Confirmation from './Confirmation';

import { withStyles } from '@material-ui/core/styles';

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
  
class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products:null,
      openDetail: false,
      openEdit: false,
      openConfirmation:false,
      delete:{},
      message:'',
      error:'',
      selectedProduct:{}     
    }
  }

  componentDidMount(){
    this.setState(currentState => ({products: this.props.products}))
  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.message !== this.state.message){
      setTimeout(() =>{
        if(this.mounted){this.setState(currentState => ({message: null}))}
      }, 3000)
    }
    if(prevState.error !== this.state.error){
      setTimeout(() =>{
        if(this.mounted){this.setState(currentState => ({error: null}))}
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
  handleClickOpenEdit = (value) => {
    this.setState(currentState => ({
      openEdit: true,
      selectedProduct:value
    }));
  };
  handleClose = (value) => {
    this.setState({ openDetail: false});
  };
  handleCloseConfirmation = (value) => {
    this.setState({ openConfirmation: false});
  };
  handleCloseEdit = (value) => {
    this.setState({ openEdit: false});
  };

  handleDeleteProduct = async (image,id) => {
    this.setState(state => ({openConfirmation:true, delete:{image,id}}));
  }
  handleSaveProduct = async (id) => {
    this.props.handleAdd(id);
  }
  handleContactSeller = async (id) => {
    console.log('contact Seller')
  }
  handleEditProduct = (value) => {
    this.handleClickOpenEdit(value);
  }
  handleConfirmation = async (value) => {
    if(value){
        await this.props.handleDelete(this.state.delete.image,this.state.delete.id);
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
          message={"Are you sure you want to delete this item?"}
          onConfirm={this.handleConfirmation}
        />
        <ProductDetail
          product={this.state.selectedProduct}
          open={this.state.openDetail}
          onClose={this.handleClose}
        />
        <ProductEdit
          product={this.state.selectedProduct}
          open={this.state.openEdit}
          onClose={this.handleCloseEdit}
          onSave={this.props.handleUpdate}
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
                      save={this.handleSaveProduct} 
                      edit={this.handleEditProduct} 
                      contactSeller={this.handleContactSeller}
                      delete={this.handleDeleteProduct} 
                      className={this.props.classes.card}
                      isOwner={this.props.isOwner}
                      // isOwnProduct={true}
                      bookmarked={false}
                      key={product._id}
                      detailHandler={this.handleClickOpen}/>
                      
          })
        }
      </div>
    );
  }
}

export default withStyles(styles)(Products);