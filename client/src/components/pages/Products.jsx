import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';

export default class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products:null,
      open: false,
      selectedProduct:{
        name:'',
        id:''
      }     
    }
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
    if(prevProps.products !== this.props.products){
      this.setState(currentState => ({products: this.props.products}))
    }
  }

  handleClickOpen = (value) => {

    this.setState(currentState => ({
      open: true,
      selectedProduct:value
    }));
  };
  handleClose = (value) => {
    this.setState({ open: false});
  };

  render() {
    return (
      <div className="Products">
        <h2>Products</h2>
        <ProductDetail
          name={this.state.selectedProduct.name}
          dbid={this.state.selectedProduct.id}
          open={this.state.open}
          onClose={this.handleClose}
        />

        {
          this.props.products && (this.props.products.length > 0) && this.props.products.map((product,idx) => {
            return <ProductCard 
                      name={product.name} 
                      dbid={product._id}
                      key={idx}
                      description={product.description} 
                      detailHandler={this.handleClickOpen} 
                      image={product.imageUrl} 
                      price={product.price}/>
          })
        }
      </div>
    );
  }
}
