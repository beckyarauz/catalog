import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
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
  
class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products:null,
      open: false,
      message:'',
      error:'',
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
      open: true,
      selectedProduct:value
    }));
  };
  handleClose = (value) => {
    this.setState({ open: false});
  };

  handleDeleteProduct = async (image,id) => {
    await this.props.handleDelete(image,id);
  }
  handleSaveProduct = async (id) => {
    // await this.props.handleSave(id);
  }
  handleEditProduct = async (id) => {
    // await this.props.handleEdit(id);
  }

  render() {
    return (
      <div className={this.props.classes.productContainer}>
        <ProductDetail
          name={this.state.selectedProduct.name}
          dbid={this.state.selectedProduct.id}
          open={this.state.open}
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
                      name={product.name} 
                      save={this.handleSaveProduct} 
                      edit={this.handleEditProduct} 
                      contactSeller={this.handleContactSeller}
                      delete={this.handleDeleteProduct} 
                      className={this.props.classes.card}
                      isOwner={this.props.isOwner}
                      
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

export default withStyles(styles)(Products);