import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
// import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import api from '../../api';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
// import Select from '@material-ui/core/Select';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    flexBasis: 200,
  },
  imageSection: {
    flexBasis: 200,
    display: 'flex',
    'justify-content': 'center',
    alignItems: 'center'

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
    user: null,
    productId: null,
    image: null,
    imageFS: null,
    labelWidth: 0,
    message: null,
    valid: false,
  }

  componentWillMount() {
    this.setState(currentState =>({redirect:!this.props.isSeller}))
  }


  handleChange = name => event => {
    if (name !== 'image') {
      let product = { ...this.state.product }
      product[name] = event.target.value;
      this.setState(currentState => ({ product }), () => {
        // console.log(this.state.product);
        let info, imageUrl;
        ({ imageUrl,...info } = this.state.product)

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
    // console.log('submition!');
    if (this.state.imageFS !== undefined && this.state.imageFS !== null) {
      // console.log('new image uploaded')
      let product = { ...this.state.product };
      let url = await api.uploadToS3(this.state.image, 'product');
      // console.log('Form api response', url.data.Location);
      product.imageUrl = url.data.Location;

      this.setState(currentState => ({ product }), async () => {
        let data = await api.addProduct(this.state.product);
        this.setState({productId:data.data.product._id,message:data.data.message})
      });
      return;
    }
    let data = await api.addProduct(this.state.product);
    this.setState({productId:data.data.product._id,message:data.data.message})
  }
  unvalidFormHandler = () => {
    this.setState({ message: 'fill all the fields!' })
  }

  handleClick = (e) => {
    e.preventDefault()
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }
  getUser = async () => {
    let info = await api.getUserInfo();
    let user = info.data.user.username;
    this.setState({ user });
  }
  deleteFile = async (e) => {
    e.preventDefault()
    let deleted = await api.deleteFromS3(this.state.product.imageUrl, 'product');
    if(deleted.data.message){
      this.setState(currentState => ({message:deleted.data.message}))
    }
    let product = { ...this.state.product };
    product.imageUrl = "";
    this.setState({ product })
  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.message !== this.state.message){
      setTimeout(() =>{
        this.setState(currentState => ({message: null}))
      }, 3000)
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h2>Add a Product</h2>
        <form className={classes.container} noValidate autoComplete="off">

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
          className={classes.formControl}
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
          <Button variant="contained" component="span" className={classes.button} onClick={this.deleteFile}>Delete</Button>

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
          <Button variant="contained" component="span" className={classes.button} onClick={this.handleClick} disabled={!this.state.valid}>Update</Button>
        </form>
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
      </div>

    );
  }
}

AddProduct.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddProduct);