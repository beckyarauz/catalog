import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Icon from '@material-ui/core/Icon';

import NavBar from './NavBar';

import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManageAccount from './pages/ManageAccount';
import Browse from './pages/Browse';

import api from '../api';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogged: false,
      isSeller: false
    }
  }

  componentWillMount(){

    (async (e) => {
      // console.log('file:app.jsx variable: this.state.isLogged', this.state.isLogged)
      let response = await api.isLoggedIn();
      // console.log(response);
      if(response !== undefined && response.isLogged){
        this.setState({
          isLogged: response.isLogged,
          isSeller: response.isLogged
        })
      }
        
    })()
    
  }

  handleLogin = () =>{
    (async (e) => {
      let data = await api.isLoggedIn();
      this.setState({
            isLogged: data.isLogged,
            isSeller: data.isSeller
      })
    })()
  }
  handleLogout = () =>{
    this.setState({
      isLogged: false,
      isSeller: false
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Icon fontSize='large'>shopping_cart</Icon>
          <h1 className="App-title">Local Market</h1>
          <NavBar isLogged={this.state.isLogged} inLogout={this.handleLogout} />
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/add-product" render={(props) => (
                !this.state.isSeller ? (
                  <Redirect to="/"/>
                ) : (
                  <AddProduct {...props}/>
                )
              )} />
          <Route path="/signup" render={(props) => <Signup {...props} inLogin={this.handleLogin}/>} />
          <Route path="/login" render={(props) => <Login {...props} inLogin={this.handleLogin}/>} />
          {/* <Route path="/profile" component={Profile} /> */}
          <Route path="/profile" render={(props) => (
                !this.state.isLogged ? (
                  <Redirect to="/login"/>
                ) : (
                  <Profile {...props}/>
                )
              )} />
          <Route path="/manage-account" render={(props) => (
                !this.state.isLogged ? (
                  <Redirect to="/login"/>
                ) : (
                  <ManageAccount {...props}/>
                )
              )} />
          {/* <Route path="/manage-account" component={ManageAccount} /> */}
          <Route path="/browse" component={Browse} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}