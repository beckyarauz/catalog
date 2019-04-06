import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import api from '../api';

import Home from './pages/Home';
import NavDrawer from './Drawer';
import Header from './Header';
import BottomAppBar from './BottomAppBar';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import ProfileBuyer from './pages/ProfileBuyer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManageAccount from './pages/ManageAccount';
import ManageAccountBuyer from './pages/ManageAccountBuyer';
import Browse from './pages/Browse';
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      right: false,
      mounted:false,
      login:false,
    }
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  }
  isLogged = false;
  isSeller = false;
  user = null;
  async componentWillMount() {
    (async (e) => {
      let response = await api.isLoggedIn();
      if (response !== undefined && response.isLogged) {
        this.isLogged = response.isLogged;
        this.isSeller = response.isSeller;
        this.user = response.user;
        this.setState(state => ({mounted:true}))
      }
    })()
  }
  handleLogin = () => {
    (async (e) => {
      let data = await api.isLoggedIn();
      this.isLogged = data.isLogged;
      this.isSeller = data.isSeller;
      this.user = data.user;
      this.setState(state => ({login:true}))
    })()
  }
  handleLogout = () => {
    this.isLogged = false;
    this.isSeller = false;
    this.user = null;
    this.setState(state => ({login:false}))
  }

  render() {
    return (
      <Router>
        <div className="App">
            <Header user={this.user}/>
            <NavDrawer toggle={this.toggleDrawer} isLogged={this.isLogged} inLogout={this.handleLogout} user={this.user} isSeller={this.isSeller} open={this.state.right} />
            <BottomAppBar toggle={this.toggleDrawer} isLogged={this.isLogged}/>
            <div className="App-content">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/home" exact component={Home} />
                <Route path="/add-product" render={(props) => (
                  (this.isSeller === false) ? (
                    <Redirect to="/" />
                  ) : (
                      <AddProduct {...props} />
                    )
                )} />
                <Route path="/signup" render={(props) => <Signup {...props} inLogin={this.handleLogin} />} />
                <Route path="/login" render={(props) =>
                  this.isLogged ?
                    <Redirect to={`/profile/${this.user}`} /> :
                    <Login {...props} inLogin={this.handleLogin} />
                } />
                {this.isSeller && <Route path={`/profile/${this.user}`} render={(props) => (
                  (!this.isLogged && this.isSeller) ? (
                    <Redirect to="/" />
                  ) : (
                      <Profile {...props} isSeller={this.isSeller} loggedUser={this.user} />
                    )
                )} />}
                {!this.isSeller && <Route path={`/profile/${this.user}`} render={(props) => (
                  (!this.isLogged) ? (
                    <Redirect to="/" />
                  ) : (
                      <ProfileBuyer {...props} loggedUser={this.user} />
                    )
                )} />}
                <Route path={`/profile/company/:user`} render={(props) => (<Profile loggedUser={this.user} {...props} />)} />
                {this.isLogged && <Route path={`/profile/user/:user`} render={(props) => (<ProfileBuyer loggedUser={this.user} {...props} />)} />}

                {this.isSeller && <Route path="/manage-account" render={(props) => (
                  !this.isLogged ? (
                    <Redirect to="/login" />
                  ) : (
                      <ManageAccount {...props} user={this.user} isSeller={this.isSeller} logout={this.handleLogout} />
                    )
                )} />}
                {!this.isSeller && <Route path="/manage-account" render={(props) => (
                  !this.isLogged ? (
                    <Redirect to="/login" />
                  ) : (
                      <ManageAccountBuyer {...props} user={this.user} isSeller={this.isSeller} logout={this.handleLogout}/>
                    )
                )} />}
                <Route path="/browse" component={Browse} />
                <Route render={() => <h2>404</h2>} />
              </Switch>
            </div>
          </div>
      </Router>
    );
  }
}