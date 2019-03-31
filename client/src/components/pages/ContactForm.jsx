

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
// import InputAdornment from '@material-ui/core/InputAdornment';

// import NumberFormat from 'react-number-format';

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
    width: '80%',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textarea: {
    width: '80%',
  },
  messages:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ContactForm extends React.Component {
  state = {
    mail:{
      to:'',
      from:'',
      subject:'',
      message:'Write your message here',
    },
    message:null,
    error:null,
    user: null,
    product: null,
    labelWidth: 0,
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
      console.log(this.props.product)
      let mail = {...this.state.mail}
      mail.subject = `Product Query: ${this.props.product.name} ${this.props.product.id}`
      if(this.props.sellerMail){
        mail.to = this.props.sellerMail;
      } else {
        mail.to = this.props.product.sellerEmail
      }
      mail.from = this.props.sender;
      this.setState(state => ({product: {...this.props.product},mail}))
    }
  }

  handleClose = () => {
        this.props.onClose();
  };
  handleSend = async () => {
    this.setState(state => ({message:'Sending message...'}))
    let response = await api.sendMessage(this.state.mail);
    if(response.data.message){
      let mail = {
        from:'',
        to:'',
        subject:'',
        message:''
      };
      this.setState(state => ({message:response.data.message,mail}))
      setTimeout(()=> {
        this.props.onClose();
      },2000)
    }
    if(response.data.error){
      this.setState(state => ({error:response.data.error}))
      setTimeout(()=> {
        this.props.onClose();
      },2000)
    }
  };
  handleChange = name => event => {
      let mail = { ...this.state.mail }
      mail[name] = event.target.value;
      this.setState(currentState => ({ mail }))
  };
  
  render() {
    const { classes } = this.props;
    return (
        <Dialog
          fullScreen
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
                Contact Seller
              </Typography>
              <Button color="inherit" onClick={this.handleSend}>
                Send
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
          <div className={classNames(classes.messages)}>
            {this.state.message && <div className="info">
            {this.state.message}
          </div>}
            {this.state.error && <div className="info info-danger">
            {this.state.error}
          </div>}
          </div>
          <TextField
            id="sendTo"
            label="email"
            type='email'
            className={classNames(classes.margin, classes.textField)}
            value={this.state.mail.to}
            onChange={this.handleChange('to')}
            margin="normal"
            variant="outlined"
            disabled={true}
          />
          <TextField
            id="subject"
            label="subject"
            className={classNames(classes.margin, classes.textField)}
            value={this.state.mail.subject}
            // onChange={this.handleChange('subject')}
            margin="normal"
            variant="outlined"
            disabled={true}
          />
          
          <TextField
            id="message"
            label="Message"
            className={classNames(classes.textarea, classes.textField)}
            value={this.state.mail.message}
            onChange={this.handleChange('message')}
            margin="normal"
            variant="outlined"
            multiline={true}
            rows={6}
            rowsMax={10}
          />
            <Divider />
          </div>
          
        </Dialog>
    );
  }
}

ContactForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContactForm);