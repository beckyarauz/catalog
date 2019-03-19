import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Countries from './pages/Countries';
import FileUpload from './pages/FileUpload';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import Material from './pages/MaterialProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManageAccount from './pages/ManageAccount';
import api from '../api';
import logo from '../logo.svg';
import Icon from '@material-ui/core/Icon';

// import Button from '@material-ui/core/Button';
import NavBar from './NavBar';

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
      console.log(response);
        this.setState({
            isLogged: response.isLogged,
            isSeller: response.isLogged
      })
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
          <Route path="/manage-account" component={ManageAccount} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}