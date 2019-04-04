import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';

import Home from './pages/Home';
import NavDrawer from './Drawer';
import BottomAppBar from './BottomAppBar';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import ProfileBuyer from './pages/ProfileBuyer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManageAccount from './pages/ManageAccount';
import ManageAccountBuyer from './pages/ManageAccountBuyer';
import Browse from './pages/Browse';

import api from '../api';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogged: false,
      isSeller: false,
      user: null,
      right: false,
    }
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  }
  componentWillMount() {
    (async (e) => {
      let response = await api.isLoggedIn();
      if (response !== undefined && response.isLogged) {
        this.setState({
          user: response.user,
          isLogged: response.isLogged,
          isSeller: response.isSeller
        })
      }
    })()
  }

  handleLogin = () => {
    (async (e) => {
      let data = await api.isLoggedIn();
      this.setState({
        user: data.user,
        isLogged: data.isLogged,
        isSeller: data.isSeller
      })
    })()
  }
  handleLogout = () => {
    this.setState({
      isLogged: false,
      isSeller: false,
      user: null
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-bod">
            <header className="App-header" style={{ textAlign: 'center' }}>
              <div className="App-headerItems">
                <h1 className="App-title">Local Market</h1>
                {this.state.user && (
                  <Link to={`/profile/${this.state.user}`} >
                    <Chip
                      avatar={
                        <Avatar>
                          <FaceIcon />
                        </Avatar>
                      }
                      label={this.state.user}
                      style={{ marginTop: '10px' }}
                    />
                  </Link>)}
              </div>
              <NavDrawer toggle={this.toggleDrawer} isLogged={this.state.isLogged} inLogout={this.handleLogout} user={this.state.user} isSeller={this.state.isSeller} open={this.state.right} />
              <BottomAppBar toggle={this.toggleDrawer} isLogged={this.state.isLogged}/>
            </header>
            <div className="App-content">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/home" exact component={Home} />
                <Route path="/add-product" render={(props) => (
                  (this.state.isSeller === false) ? (
                    <Redirect to="/" />
                  ) : (
                      <AddProduct {...props} />
                    )
                )} />
                <Route path="/signup" render={(props) => <Signup {...props} inLogin={this.handleLogin} />} />
                <Route path="/login" render={(props) =>
                  this.state.isLogged ?
                    <Redirect to={`/profile/${this.state.user}`} /> :
                    <Login {...props} inLogin={this.handleLogin} />
                } />
                {this.state.isSeller && <Route path={`/profile/${this.state.user}`} render={(props) => (
                  (!this.state.isLogged && this.state.isSeller) ? (
                    <Redirect to="/" />
                  ) : (
                      <Profile {...props} isSeller={this.state.isSeller} />
                    )
                )} />}
                {!this.state.isSeller && <Route path={`/profile/${this.state.user}`} render={(props) => (
                  (!this.state.isLogged) ? (
                    <Redirect to="/" />
                  ) : (
                      <ProfileBuyer {...props} />
                    )
                )} />}
                <Route path={`/profile/company/:user`} render={(props) => (<Profile loggedUser={this.state.user} {...props} />)} />
                <Route path={`/profile/user/:user`} render={(props) => (<ProfileBuyer {...props} />)} />

                {this.state.isSeller && <Route path="/manage-account" render={(props) => (
                  !this.state.isLogged ? (
                    <Redirect to="/login" />
                  ) : (
                      <ManageAccount {...props} user={this.state.user} isSeller={this.state.isSeller} />
                    )
                )} />}
                {!this.state.isSeller && <Route path="/manage-account" render={(props) => (
                  !this.state.isLogged ? (
                    <Redirect to="/login" />
                  ) : (
                      <ManageAccountBuyer {...props} user={this.state.user} isSeller={this.state.isSeller} />
                    )
                )} />}
                <Route path="/browse" component={Browse} />
                <Route render={() => <h2>404</h2>} />
              </Switch>
            </div>
          </div>

        </div>
      </Router>
    );
  }
}