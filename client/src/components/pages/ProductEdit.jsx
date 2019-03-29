

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import NumberFormat from 'react-number-format';

import classNames from 'classnames';

import api from '../../api';

const styles = theme => ({
  container:{
    padding: '15px 15px',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
    fontSize: 14
  },
  root: {
    width:'100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center'
  },
  form:{
    width:'100%',
    display: 'flex',
    flexDirection:'column',
    alignItems:'center'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  imageSection: {
    display: 'flex',
    'justify-content': 'center',
    alignItems: 'center'

  },
  priceField:{
    margin: theme.spacing.unit,
    maxWidth:150,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textarea: {
    width: 200
  },
  imageActions:{
    display:'flex',
    justifyContent:'space-between'
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalScale={2}
      // prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

class ProductEdit extends React.Component {
  state = {
    product: {
      name: '',
      price: '',
      description: '',
      imageUrl:'',
      tags:'',
    },
    user: null,
    productId: null,
    image: null,
    imageFS: null,
    labelWidth: 0,
    message: null,
    valid: false,
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
    if(prevProps.product !== this.props.product){
      this.setState(state => ({product: {...this.props.product.product}}))
    }
  }

  handleClose = () => {
        this.props.onClose();
  };
  handleSave = async () => {
    let data = await this.submitToServer();
    console.log(data)
    this.props.onSave();
    this.props.onClose();
  };

  submitToServer = async () => {
        if (this.state.imageFS !== undefined && this.state.imageFS !== null) {
          let product = { ...this.state.product };
          //delete current product image and then upload the new one api.deleteFromS3(this.state.product.imageUrl, 'product');
          if(this.state.image){
          let deletedImage = await api.deleteFromS3(this.state.product.imageUrl, 'product',this.state.product._id);
          console.log('deleted image data:', deletedImage)
          }

          let url = await api.uploadToS3(this.state.image, 'product');
          product.imageUrl = url.data.Location;
    
          this.setState(currentState => ({ product }), async () => {
            let data = await api.editProduct(this.state.product);
            this.setState({productId:data.data.product._id,message:data.data.message})
          });
          return;
        }
        let data = await api.editProduct(this.state.product);
        this.setState({productId:data.data.product._id,message:data.data.message});
        return data;
  }    

  handleChange = name => event => {
    if (name !== 'image') {
      let product = { ...this.state.product }
      product[name] = event.target.value;
      this.setState(currentState => ({ product }))
    } else if(event.target.files.length > 0){
      var file = event.target.files[0];
      this.setState({ image: file });
      var reader = new FileReader();
      const scope = this;
      reader.onload = function () {
        scope.setState({
          imageFS: reader.result
        })
      }
      reader.readAsDataURL(file);
    }
  };
  
  render() {
    const { classes } = this.props;
    return (
        <Dialog
          // fullScreen
          open={this.props.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Edit Product Details
              </Typography>
              <Button color="inherit" onClick={this.handleSave}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
          <TextField
            id="productName"
            label="Product Name"
            className={classNames(classes.margin, classes.textField)}
            value={this.state.product.name}
            onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
          <TextField
          className={classes.priceField}
          label="Price"
          value={this.state.product.price}
          onChange={this.handleChange('price')}
          id="formatted-numberformat-input"
          variant="outlined"
          InputProps={{
            inputComponent: NumberFormatCustom,
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
          
          {this.state.imageFS && <div className={classes.imageSection}><img src={this.state.imageFS} width="100" height="100" alt="product sample" /></div>}
          {(this.state.product.imageUrl && !this.state.imageFS) && <div className={classes.imageSection}><img src={this.state.product.imageUrl} width="100" height="100" alt="product sample" /></div>}
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={this.handleChange('image')}
          />
          <div className={classNames(classes.imageActions)}>
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" className={classes.button}>
                Select Image
              </Button>
            </label>
            {/* <Button variant="contained" component="span" className={classes.button} color='secondary' onClick={this.deleteFile}>Delete</Button> */}
          </div>

          <TextField
            id="productDescription"
            label="Product Description"
            className={classNames(classes.textarea, classes.textField)}
            value={this.state.product.description}
            onChange={this.handleChange('description')}
            margin="normal"
            variant="outlined"
            multiline={true}
            rows={4}
            rowsMax={4}
            InputProps={{
              startAdornment: <InputAdornment position="start"> </InputAdornment>,
            }}
          />
          {this.state.message && <div className="info">
          {this.state.message}
        </div>}
          {this.state.error && <div className="info info-danger">
          {this.state.error}
        </div>}
            <Divider />
          </div>
          
        </Dialog>
    );
  }
}

ProductEdit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductEdit);