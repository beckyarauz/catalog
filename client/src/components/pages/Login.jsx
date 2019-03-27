


// export default class Login extends PureComponent {
//   constructor(props) {
//     super(props)
//     this.state = {
//       username: "",
//       password: "",
//       message: null
//     }
//     this.handleInputChange = this.handleInputChange.bind(this)
//   }

//   handleInputChange(event) {
//     this.setState({
//       [event.target.name]: event.target.value
//     })
//   }

//   handleClick = async (e) => {
//     e.preventDefault()
//     await api.login(this.state.username, this.state.password)
//     this.props.inLogin();
//   }

//   render() {
//     return (
//       <div className="Login">
//         <h2>Login</h2>
//         <form>
//           Username: <input type="text" value={this.state.username} name="username" onChange={this.handleInputChange} /> <br />
//           Password: <input type="password" value={this.state.password} name="password" onChange={this.handleInputChange} /> <br />
//           <button onClick={this.handleClick}>Login</button>
//         </form>
//         {this.state.message && <div className="info info-danger">
//           {this.state.message}
//         </div>}
//       </div>
//     );
//   }
// }

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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

class LogIn extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        username: "",
        password: "",
        message: null
      }
    }

  handleInputChange = (event) => {
    // console.log(event.target.name)
        this.setState({
          [event.target.name]: event.target.value
        })
      }
    
  handleClick = async () => {
    // e.preventDefault()
    await api.login(this.state.username, this.state.password)
    this.props.inLogin();
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
          Log In
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
           {this.state.message && <div className="info info-danger">
           {this.state.message}
          </div>}
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleClick}
            className={classes.submit}
          >
            Log in
          </Button>
        </form>
      </Paper>
    </main>
  )}
}

LogIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LogIn);
