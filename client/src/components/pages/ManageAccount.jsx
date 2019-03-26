import React from 'react';

import Tag from './Tagify';

import ReactMapGL, { NavigationControl, Popup, Marker } from 'react-map-gl';

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
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

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
  }
});

// const TOKEN = 'pk.eyJ1IjoiYmVja3lhcmF1eiIsImEiOiJjanRpb2kyc3cwbjVkM3luem42bW5ydHJ2In0.4-rDIk32b4VkF9Y_g9oLqg';
const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

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

class ManageAccount extends React.Component {

  state = {
    user: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      company: "something",
      address: "something",
      email: "",
      tags: [],
      phone: '( 49)0000-0000',
      category: "food",
      about: "Write What's your coumpany about, the inspiration and what makes you unique! :D",
      logoUrl: "",
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
    labelWidth: 0,
    image: null,
    imageFS: null,
    message: null,
    valid: false,
    showPassword: false,
  }

  isNotEmpty = (currentValue) => {
    return currentValue instanceof Object || currentValue.length > 0 || currentValue instanceof File;
  }

  componentWillMount() {

    
    (async () => {
      try {
        console.log(this.props.user);
        let user = await this.getUser(this.props.user);
        let password, info;
        ({ password, ...info } = user);

        let stateValues = Object.values(info);

        this.setState(prevState => ({ user, valid: stateValues.every(this.isNotEmpty) }), () => {

          console.log(this.state.user.geolocation);
          // console.log('state User after Mounting:',this.state.user);
          if ((this.state.user.geolocation.latitude === 0 && this.state.user.geolocation.longitude === 0) && "geolocation" in navigator) {
            console.log('geolocation has not been set');
            let self = this;
            navigator.geolocation.getCurrentPosition(function (position) {
              let user = { ...self.state.user };
              let geolocation = { ...user.geolocation };
              // console.log('current State User geolocation',geolocation)
              // console.log('current geolocation',position)

              geolocation.latitude = position.coords.latitude;
              geolocation.longitude = position.coords.longitude;

              user.geolocation = geolocation;

              let viewport = self.state.viewport;
              viewport.latitude = user.geolocation.latitude;
              viewport.longitude = user.geolocation.longitude;

              // this.setState(prevState => ({viewport}))

              self.setState(prevState => ({ user, viewport }), () => {
                console.log('changed user geolocation:', self.state.user.geolocation)
              });
            })
          } else {
            /* geolocation IS NOT available */
            let viewport = this.state.viewport;
            viewport.latitude = this.state.user.geolocation.latitude;
            viewport.longitude = this.state.user.geolocation.longitude;

            this.setState(prevState => ({ viewport }))
          }
        });

      } catch (e) {
        console.log(e.message)
      }
    })()
  }

  handleMarkerDrag = (e) => {
    let user = this.state.user;
    let geolocation = user.geolocation;

    geolocation.longitude = e.lngLat[0];
    geolocation.latitude = e.lngLat[1];

    user.geolocation = geolocation;

    this.setState({ user })
  }

  handleChange = name => event => {
    let info, password, logoUrl, geolocation;
    if (name !== 'logo') {
      if (name === 'tags') {
        console.log(event)
        let user = { ...this.state.user };
        let tags = event;

        user.tags.push(tags);
        
        this.setState({ user })
        return;
      }
      var user = { ...this.state.user }
      user[name] = event.target.value;
      this.setState(currentState => ({ user }), () => {
        ({ password, logoUrl, geolocation, ...info } = this.state.user)

        let stateValues = Object.values(info);
        this.setState({ valid: stateValues.every(this.isNotEmpty) });
      });
    } else if (event.target.files.length > 0) {
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

  submitToServer = async () => {
    if (this.state.imageFS !== undefined && this.state.imageFS !== null) {
      // console.log('new image uploaded')
      let user = { ...this.state.user };
      let url = await api.uploadToS3(this.state.image, 'logo');
      // console.log('Form api response', url.data.Location);
      user.logoUrl = url.data.Location;

      this.setState(currentState => ({ user }), async () => {
        await api.updateUser(this.state.user);
      });
      return;
    }

    let response = await api.updateUser(this.state.user);

    this.setState({ message: response.data.message })
  }
  unvalidFormHandler = () => {
    this.setState({ message: 'fill all the fields!' })
    // console.log('fill all the fields!');
  }

  handleClick = (e) => {
    e.preventDefault()
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }
  getUser = async (username) => {
    let info = await api.getUserInfo(username);
    let user = info.data.user;
    console.log(user);
    return user;
  }
  deleteFile = async (e) => {
    e.preventDefault()
    let deleted = await api.deleteFromS3(this.state.user.logoUrl, 'logo');
    console.log('deleted response:', deleted)
    if (deleted.data.message) {
      this.setState(currentState => ({ message: deleted.data.message, imageFS: null, image: null }))
    }
    let user = { ...this.state.user };
    user.logoUrl = "";
    this.setState({ user })
  }

  handleViewportChange = (viewport) => {
    // console.log('viewport Change:',viewport);
    this.setState(prevState => ({ viewport }));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.message !== this.state.message) {
      setTimeout(() => {
        this.setState(currentState => ({ message: null }))
      }, 3000)
    }
    if (prevState.viewport !== this.state.viewport) {
      // console.log('Component did Udpdate and viewport changed')
      let user = this.state.user;
      let geolocation = user.geolocation;

      geolocation.latitude = this.state.viewport.latitude;
      geolocation.longitude = this.state.viewport.longitude;

      user.geolocation = geolocation;
      // console.log(this.state.viewport.latitude)

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
            <h3>Location</h3>
            <p>Move the pointer to set your bussiness location</p>
            <ReactMapGL
              {...this.state.viewport}
              mapStyle="mapbox://styles/beckyarauz/cjtisim0s272e1fubskpzz1om"
              mapboxApiAccessToken={TOKEN}
              onViewportChange={(viewport) => this.handleViewportChange(viewport)}

            >
              <div style={{ position: 'absolute' }}>
                <NavigationControl onViewportChange={(viewport) => this.setState({ viewport })} />
              </div>
              {this.state.user.geolocation.longitude && <Marker latitude={this.state.user.geolocation.latitude} longitude={this.state.user.geolocation.longitude} offsetLeft={-20} offsetTop={-10} draggable={true} onDragEnd={e => this.handleMarkerDrag(e)}>
                <div ><Icon>location_on</Icon></div>
              </Marker>}
            </ReactMapGL>
            <h2>Company Info</h2>
            {
              (this.state.user.logoUrl &&
                <div className={classes.imageSection}><img src={this.state.user.logoUrl} width="100" height="100" alt="logo from db" /></div>)
              || (this.state.imageFS &&
                <div className={classes.imageSection}><img src={this.state.imageFS} width="100" height="100" alt="company logo" /></div>)
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

            <Tag handleTagChange={this.handleChange('tags')} initialTags={this.state.user.tags} />

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
          </div>
        )}
      </div>
    );
  }
}

ManageAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageAccount);