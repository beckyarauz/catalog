import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import api from '../../api';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Signup extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        username: "",
        password: "",
        message: null
      }
    }

  handleInputChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
      }
    
      handleClick = (e) => {
            let data = {
              username: this.state.username,
              password: this.state.password,
            }
            api.signup(data)
              .then(result => {
                this.props.inLogin();
                this.setState({
                  message: result.data.message
                })
                setTimeout(()=>{
                  this.props.history.push("/manage-account")
                },3000)
              })
              .catch(err => this.setState({ error: err.toString() }))
          }

  render() {
    const { classes } = this.props;
    return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Username</InputLabel>
            <Input id="email" name="username" autoComplete="email" value={this.state.username} onChange={this.handleInputChange} autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" value={this.state.password} onChange={this.handleInputChange} autoComplete="current-password" />
          </FormControl>

           {this.state.message && <div className="info">
          {this.state.message}
        </div>}
        {this.state.error && <div className="info info-danger">
          {this.state.error}
        </div>}
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleClick}
            className={classes.submit}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </main>
  )}
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
