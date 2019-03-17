import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MaskedInput from 'react-text-mask';
import api from '../../api';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'


import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';



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
  imageSection:{
    flexBasis: 200,
    display:'flex',
    'justify-content': 'center',
    alignItems: 'center'

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  button: {
    margin: theme.spacing.unit,
    width:200
  },
  textarea:{
    width:200
  }
});

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};


class TextFields extends React.Component {

  state = {
    user:{
      username: "",
      firstName:"",
      lastName:"",
      password: "",
      email: "",
      phone: '( 49)0000-0000',
      category: "food",
      description: "",
      logo: "",
    }, 
    labelWidth: 0,    
    logo: "",
    message: null,
    valid: false,
    // textmask: '(  )    -    ',
    showPassword: false,
    
  }

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleChange = name => event => {
    let info,password,logo;
    if(name !== 'logo'){
      // console.log(event.target.name)
      var user = {...this.state.user}
      // console.log(user[name]);
      user[name] = event.target.value;
      this.setState(currentState => ({user}), () => {
        // console.log(this.state.user);

        ({password,logo,...info} = this.state.user)

        let stateValues = Object.values(info);

        // console.log('stateValues',stateValues);

        this.setState({valid: stateValues.every(isNotEmpty)});

        function isNotEmpty(currentValue) {
          //I'm not evaluating the logo yet but I still put the File validation
          return currentValue.length > 0 || currentValue instanceof File;
        }
      });

    } else {
      this.setState({
        logo: event.target.files[0]
      });
    }
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  submitToServer = async ()=>{
    console.log('submition!');
    let url;
    let user = {...this.state.user};

    if(this.state.logo && this.state.logo instanceof File){
      console.log('uploaded Logo');
      const stateFile = this.state.logo;
      url = await api.uploadToS3(stateFile);
      console.log('Form api response', url.data.Location);
      user.logo = url.data.Location;
    }

    this.setState(currentState =>({user}),( ) =>{
      api.updateUser(this.state.user)
    });
    
  }
  unvalidFormHandler = ()=>{
    this.setState({message:'fill all the fields!' })
    console.log('fill all the fields!');
  }

  handleClick = (e) => {
    e.preventDefault()
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }
  getUser = (e) => {
    e.preventDefault();
    api.getUserInfo();
  }
  getLogged = (e) => {
    e.preventDefault();
    api.isLoggedIn();
  }

  render() {
    const { classes } = this.props;
    const { phone } = this.state.user;

    return (
      <div>
        <h2>Account</h2>
        <form className={classes.container} noValidate autoComplete="off">
        <Button variant="contained" component="span" className={classes.button} onClick={this.getUser}>UserInfo</Button>
        <Button variant="contained" component="span" className={classes.button} onClick={this.getLogged}>Logged in?</Button>
        <TextField
          id="username"
          label="Username"
          className={classNames(classes.margin, classes.textField)}
          value={this.state.user.username}
          onChange={this.handleChange('username')}
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">@</InputAdornment>,
          }}
        />
        <TextField
          id="standard-firstname"
          label="First Name"
          className={classes.textField}
          value={this.state.user.firstName}
          onChange={this.handleChange('firstName')}
          margin="normal"
          variant="outlined"
          // InputProps={{
          //   startAdornment: <InputAdornment position="start"></InputAdornment>,
          // }}
        />
        <TextField
          id="standard-name"
          label="Last Name"
          className={classes.textField}
          value={this.state.user.lastName}
          onChange={this.handleChange('lastName')}
          margin="normal"
          variant="outlined"
          // InputProps={{
          //   startAdornment: <InputAdornment position="start"></InputAdornment>,
          // }}
        />
        <TextField
          id="outlined-adornment-password"
          className={classNames(classes.margin, classes.textField)}
          variant="outlined"
          type={this.state.showPassword ? 'text' : 'password'}
          label="Password"
          value={this.state.password}
          onChange={this.handleChange('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <h2>Contact Info</h2>
        <TextField
          id="standard-email"
          label="Email"
          className={classes.textField}
          value={this.state.user.email}
          onChange={this.handleChange('email')}
          margin="normal"
          variant="outlined"
          // InputProps={{
          //   startAdornment: <InputAdornment position="start"></InputAdornment>,
          // }}
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="formatted-text-mask-input">Phone Number</InputLabel>
          <Input
            value={phone}
            onChange={this.handleChange('phone')}
            id="formatted-text-mask-input"
            inputComponent={TextMaskCustom}
          />
        </FormControl>
        <h2>Company Info</h2>
        {this.state.user.logo && <div className={classes.imageSection}><img src={this.state.user.logo} alt="company logo"/></div>}
        {/* <div className={classes.imageSection}><img src='https://catalog-beckyarauz.s3.amazonaws.com/logos/1552577053269-physics.png-lg.png' alt="company logo"/></div> */}
        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={this.handleChange('logo')}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" className={classes.button}>
            Upload Logo
          </Button>
        </label> 
        <FormControl variant="outlined" className={classes.formControl}>
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
        </FormControl>
        <TextField
          id="standard-description"
          label="Description"
          className={classNames(classes.textarea, classes.textField)}
          value={this.state.user.description}
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

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);