import React from 'react';
// import ReactDOM from 'react-dom';
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

class ManageAccount extends React.Component {

  state = {
    user:{
      username: "",
      firstName:"",
      lastName:"",
      password: "",
      company: "something",
      address: "something",
      email: "",
      phone: '( 49)0000-0000',
      category: "food",
      about: "Write What's your coumpany about, the inspiration and what makes you unique! :D",
      logoUrl: "",
    }, 
    labelWidth: 0,    
    image: null,
    imageFS: null,
    message: null,
    valid: false,
    showPassword: false,
    
  }

  componentWillMount(){
    (async () =>{
      try{
        await this.getUser();
        let password,info;
        ({password,...info} = this.state.user)

        let stateValues = Object.values(info);
        // console.log(stateValues);
        this.setState({valid: stateValues.every(isNotEmpty)});

            function isNotEmpty(currentValue) {
              //I'm not evaluating the logo yet but I still put the File validation
              return currentValue.length > 0 || currentValue instanceof File;
            }
      }catch(e){
        console.log(e.message)
      }
    })()
    
  }

  // componentDidMount() {
  //   // this.setState({
  //   //   labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
  //   // });
  // }

  handleChange = name => event => {
    let info,password,logoUrl;
    if(name !== 'logo'){
      // console.log(event.target.name)
      var user = {...this.state.user}
      // console.log(user[name]);
      user[name] = event.target.value;
      this.setState(currentState => ({user}), () => {
        // console.log(this.state.user);

        ({password,logoUrl,...info} = this.state.user)

        let stateValues = Object.values(info);

        // console.log('stateValues',stateValues);

        this.setState({valid: stateValues.every(isNotEmpty)});

        function isNotEmpty(currentValue) {
          //I'm not evaluating the logo yet but I still put the File validation
          return currentValue.length > 0 || currentValue instanceof File;
        }
      });

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
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  submitToServer = async ()=>{
    if (this.state.imageFS !== undefined && this.state.imageFS !== null) {
      // console.log('new image uploaded')
      let user = { ...this.state.user};
      let url = await api.uploadToS3(this.state.image, 'logo');
      // console.log('Form api response', url.data.Location);
      user.logoUrl = url.data.Location;

      this.setState(currentState => ({ user }), async () => {
        await api.updateUser(this.state.user);
      });
      return;
    }

    let response = await api.updateUser(this.state.user);

    this.setState({message:response.data.message })
  }
  unvalidFormHandler = ()=>{
    this.setState({message:'fill all the fields!' })
    // console.log('fill all the fields!');
  }

  handleClick = (e) => {
    e.preventDefault()
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }
  getUser = async () => {
    let info = await api.getUserInfo();
    let user = info.data.user;
    this.setState({user});
  }
  deleteFile = async (e) => {
    e.preventDefault()
    let deleted = await api.deleteFromS3(this.state.user.logoUrl,'logo');
    console.log('deleted response:', deleted)
    if(deleted.data.message){
      this.setState(currentState => ({message:deleted.data.message,imageFS:null,image:null}))
    }
    let user = {...this.state.user};
    user.logoUrl = "";
    this.setState({user})
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
    const { phone } = this.state.user;

    return (
      <div>
        <h2>Account</h2>
        {this.state.user.username && <form className={classes.container} noValidate autoComplete="off">
        
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
          id="company"
          label="Company Name"
          className={classNames(classes.margin, classes.textField)}
          value={this.state.user.company}
          onChange={this.handleChange('company')}
          margin="normal"
          variant="outlined"
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
        {
          (this.state.user.logoUrl && 
        <div className={classes.imageSection}><img src={this.state.user.logoUrl} width="100" height="100" alt="logo from db"/></div>) 
        || (this.state.imageFS && 
        <div className={classes.imageSection}><img src={this.state.imageFS} width="100" height="100" alt="company logo"/></div>)
        }
        
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
        <br></br>
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
        <Button variant="contained" component="span" className={classes.button} onClick={this.deleteFile}>Delete</Button>
        
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
                id="outlined-category-simple"
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
          label="About"
          className={classNames(classes.textarea, classes.textField)}
          value={this.state.user.about}
          onChange={this.handleChange('about')}
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
      }
      </div>
      
    );
  }
}

ManageAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageAccount);