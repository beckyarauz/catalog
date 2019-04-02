import React from 'react';

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
import Button from '@material-ui/core/Button';

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
  },
  imageSection: {
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
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

class ManageAccountBuyer extends React.Component {

  state = {
    user: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      address: "something",
      email: "",
      phone: '( 49)0000-0000',
      about: "Write What's your coumpany about, the inspiration and what makes you unique! :D",
      userPictureUrl: "",
      geolocation: {
        latitude: 0,
        longitude: 0
      }
    },
    viewport: {
      latitude: 0,
      longitude: 0,
      zoom: 13,
      bearing: 0,
      pitch: 0,
      width: 200,
      height: 200,
    },
    image: null,
    imageFS: null,
    message: null,
    valid: false,
    showPassword: false,
  }

  isNotEmpty = (currentValue) => {
    return currentValue && (currentValue instanceof Object || currentValue.length > 0 || currentValue instanceof File);
  }
  handleDeleteAccount = async () => {
    if(this.state.user.userPictureUrl){
      console.log('deleting image');
      await this.deleteFile();
    }
    console.log('deleting account')    
    await api.deleteAccount();
    this.props.history.push('/signup')
  }

  componentWillMount() {
    (async () => {
      try {
        let user = await this.getUser(this.props.user);
        let { username, email, firstName, lastName } = user;

        let info = {
          username,
          email,
          firstName,
          lastName,
        }

        let stateValues = Object.values(info);
        let valid = stateValues.every(this.isNotEmpty);
        if ((!user.geolocation && "geolocation" in navigator) || ((user.geolocation.latitude === 0 && user.geolocation.longitude === 0) && "geolocation" in navigator)) {
          let self = this;
          navigator.geolocation.getCurrentPosition(function (position) {
            let geolocation = {};

            geolocation.latitude = position.coords.latitude;
            geolocation.longitude = position.coords.longitude;

            user.geolocation = geolocation;

            let viewport = { ...self.state.viewport };
            viewport.latitude = user.geolocation.latitude;
            viewport.longitude = user.geolocation.longitude;
            self.setState(prevState => ({ user, viewport, valid }), () => {
              console.log('changed user geolocation:', self.state.user.geolocation)
            });
          })
        } else {
          /* geolocation IS NOT available */
          let viewport = { ...this.state.viewport };
          viewport.latitude = user.geolocation.latitude;
          viewport.longitude = user.geolocation.longitude;
          this.setState(prevState => ({ viewport, user, valid }))
        }
      } catch (e) {
        console.error(e.message)
      }
    })()
  }

  validateFields = () => {
    let { username, email, firstName, lastName } = this.state.user;
    let info;
    info = {
      username,
      email,
      firstName,
      lastName
    }
    let stateValues = Object.values(info);

    this.setState({ valid: stateValues.every(this.isNotEmpty) });
  }

  handleChange = name => event => {
    if (name !== 'image') {
      if (name === 'tags') {
        let user = { ...this.state.user };
        let tags = [...event];

        user.tags = tags;

        this.setState({ user })
        return;
      }
      var user = { ...this.state.user }
      user[name] = event.target.value;
      this.setState(currentState => ({ user }), () => {
        this.validateFields();
      });
    } else if (event.target.files.length > 0) {
      var file = event.target.files[0];
      this.setState(state => ({ image: file }), () => {
        this.validateFields();
      });
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

  submitToServer = async () => {
    if (this.state.imageFS !== undefined && this.state.imageFS !== null) {
      await this.deleteFile();
      let user = { ...this.state.user };
      let url = await api.uploadToS3(this.state.image, 'userPicture');
      
      user.userPictureUrl = url.data.Location;
      this.setState(currentState => ({ user }), async () => {
        let data = await api.updateUser(this.state.user);
        if (data.data.message) {
          this.setState(state => ({ message: data.data.message }))
        }
      });
      return;
    }

    let response = await api.updateUser(this.state.user);

    this.setState({ message: response.data.message })
  }
  unvalidFormHandler = () => {
    this.setState({ message: 'fill all the fields!' })
  }

  handleClick = (e) => {
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }
  getUser = async (username) => {
    let info = await api.getUserInfo(username);
    let user = info.data.user;
    return user;
  }
  deleteFile = async (e) => {
    let user = { ...this.state.user };
    if(user.userPictureUrl){
      await api.deleteFromS3(user.userPictureUrl, 'userPicture');
    }
  }

  handleViewportChange = (viewport) => {
    this.setState(prevState => ({ viewport }));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.message !== this.state.message) {
      setTimeout(() => {
        this.setState(currentState => ({ message: null }))
      }, 3000)
    }
    if (prevState.viewport !== this.state.viewport) {
      let user = this.state.user;
      let geolocation = user.geolocation;

      geolocation.latitude = this.state.viewport.latitude;
      geolocation.longitude = this.state.viewport.longitude;

      user.geolocation = geolocation;

      this.setState(currentState => ({ user }))

    }
  }

  render() {
    const { classes } = this.props;
    const { phone } = this.state.user;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Account</h2>
        {this.state.user.username && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <div className={classes.flexContainer}>
              {
                (this.state.user.userPictureUrl &&
                  <div className={classes.imageSection}><img src={this.state.user.userPictureUrl} width="100" height="100" alt="User from DB" /></div>)
                || (this.state.imageFS &&
                  <div className={classes.imageSection}><img src={this.state.imageFS} width="100" height="100" alt="User" /></div>)
              }

              {this.state.message && <div className="info">
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
                onChange={this.handleChange('image')}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" className={classes.button}>
                  Upload Picture
            </Button>
              </label>
              <Button variant="contained" component="span" className={classes.button} onClick={this.deleteFile}>Delete</Button>

            </div>


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
            />
            <TextField
              id="standard-name"
              label="Last Name"
              className={classes.textField}
              value={this.state.user.lastName}
              onChange={this.handleChange('lastName')}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="standard-email"
              label="Email"
              className={classes.textField}
              value={this.state.user.email}
              onChange={this.handleChange('email')}
              margin="normal"
              variant="outlined"
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
            {this.state.message && <div className="info">
            {this.state.message}
            </div>}
            <Button variant="contained" component="span" className={classes.button} onClick={this.handleClick} disabled={!this.state.valid}>Update</Button>
            <Button variant="contained" component="span" className={classes.button} onClick={this.handleDeleteAccount} >Delete Account</Button>
          </div>
        )}
      </div>
    );
  }
}

ManageAccountBuyer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageAccountBuyer);