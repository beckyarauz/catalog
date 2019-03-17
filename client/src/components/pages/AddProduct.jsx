import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import MaskedInput from 'react-text-mask';
import api from '../../api';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormControl from '@material-ui/core/FormControl';
// import IconButton from '@material-ui/core/IconButton';
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
//       mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/]}
//       placeholderChar={'\u2000'}
//       showMask
//     />
//   );
// }

// TextMaskCustom.propTypes = {
//   inputRef: PropTypes.func.isRequired,
// };

class AddProduct extends React.Component {

  state = {
    product: {
      name: '',
      price: '',
      // category:'',
      description: '',
      // seller: '', //should be userID
      // imageUrl:'',
    },
    user: '',
    image: '',
    imageFS: undefined,
    labelWidth: 0,
    message: null,
    valid: false,
  }

  componentWillMount() {
    // this.getUser();
  }

  // componentDidMount() {
  //   this.setState({
  //     labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
  //   });
  // }

  handleChange = name => event => {


    if (name !== 'image') {
      let product = { ...this.state.product }
      product[name] = event.target.value;
      this.setState(currentState => ({ product }), () => {
        // console.log(this.state.product);
        let info;
        ({ ...info } = this.state.product)

        let stateValues = Object.values(info);
        this.setState({ valid: stateValues.every(isNotEmpty) });

        function isNotEmpty(currentValue) {
          //I'm not evaluating the logo yet but I still put the File validation
          return currentValue.length > 0 || currentValue instanceof File;
        }
      })
    } else {

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
    console.log('submition!');
    if (this.state.imageFS !== undefined) {
      console.log('new image uploaded')
      let product = { ...this.state.product };
      let url = await api.uploadToS3(this.state.image, 'product');
      console.log('Form api response', url.data.Location);
      product.imageUrl = url.data.Location;

      this.setState(currentState => ({ product }), async () => {
        await api.addProduct(this.state.product);
      });
    }


    await api.addProduct(this.state.product);

  }
  unvalidFormHandler = () => {
    this.setState({ message: 'fill all the fields!' })
    console.log('fill all the fields!');
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
            id="productPrice"
            label="Price"
            className={classes.textField}
            value={this.state.product.price}
            onChange={this.handleChange('price')}
            margin="normal"
            variant="outlined"
            InputProps={{
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