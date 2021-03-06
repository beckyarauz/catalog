import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

import api from '../../api';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button'

const styles = theme => ({
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
    width: 200
  },
  textarea: {
    width: 200
  }
});

// function TextMaskCustom(props) {
//   const { inputRef, ...other } = props;

//   return (
//     <MaskedInput
//       {...other}
//       ref={ref => {
//         inputRef(ref ? ref.inputElement : null);
//       }}
//       mask={[ /\d/,/\d/, /\d/, /\d/, '.', /\d/, /\d/]}
//       placeholderChar={'\u2000'}
//       showMask
//     />
//   );
// }

// TextMaskCustom.propTypes = {
//   inputRef: PropTypes.func.isRequired,
// };

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

class AddProduct extends React.Component {

  state = {
    product: {
      name: '',
      price: '',
      description: '',
      imageUrl:'',
    },
    productId: null,
    image: null,
    imageFS: null,
    labelWidth: 0,
    message: null,
    valid: false,
  }

  handleChange = name => event => {
    if (name !== 'image') {
      let product = { ...this.state.product }
      product[name] = event.target.value;
      this.setState(currentState => ({ product }), () => {
        let { name,price,description } = this.state.product;
        let info = {name,price,description};

        let stateValues = Object.values(info);
        this.setState({ valid: stateValues.every(isNotEmpty) });

        function isNotEmpty(currentValue) {
          //I'm not evaluating the logo yet but I still put the File validation
          return currentValue.length > 0 || currentValue instanceof File;
        }
      })
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

  submitToServer = async () => {
    if (this.state.imageFS !== undefined && this.state.imageFS !== null) {
      let product = { ...this.state.product };
      let url = await api.uploadToS3(this.state.image, 'product');
      product.imageUrl = url.data.Location;

      this.setState(currentState => ({ product }), async () => {
        let data = await api.addProduct(this.state.product);
        let product = {name:'',description:'',imageUrl:'',price:''};
        this.setState({message:data.data.message,product, imageFS: null, image:null})
      });
      return;
    }

    let data = await api.addProduct(this.state.product);
    let product = {name:'',description:'',imageUrl:'',price:''};
    this.setState(state => ({message:data.data.message, product}))
  }
  unvalidFormHandler = () => {
    this.setState({ message: 'fill all the fields!' })
  }

  handleClick = (e) => {
    e.preventDefault()
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }
  deleteFile = async (e) => {
    this.setState({imageFS:null,image:null})
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
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h2>Add a Product</h2>
        <form className={classes.form} noValidate autoComplete="off">

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
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={this.handleChange('image')}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" className={classes.button}>
              Upload Image
          </Button>
          </label>
          <Button variant="contained" component="span" className={classes.button} onClick={this.deleteFile} disabled={!this.state.image}>Delete</Button>

          {/* <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-category-simple"
          >
            Category
          </InputLabel>
          <Select
            value={this.state.user.category}
            onChange={this.handleChange('category')}
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="category"
                id="outlined-age-simple"
              />
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'beauty'}>Beauty</MenuItem>
            <MenuItem value={'clothing'}>Clothing</MenuItem>
            <MenuItem value={'food'}>Food</MenuItem>
          </Select>
        </FormControl> */}
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
          <Button variant="contained" component="span" className={classes.button} onClick={this.handleClick} disabled={!this.state.valid}>Save Product</Button>
        </form>
        
      </div>

    );
  }
}

AddProduct.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddProduct);