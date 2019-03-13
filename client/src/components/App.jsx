import React, { Component } from 'react';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Countries from './pages/Countries';
import FileUpload from './pages/FileUpload';
import AddCountry from './pages/AddCountry';
import Secret from './pages/Secret';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AccountForm from './pages/AccountForm';
import api from '../api';
import logo from '../logo.svg';

import Button from '@material-ui/core/Button';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: []
    }
  }

  handleLogoutClick(e) {
    api.logout()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Button variant="contained" color="primary">Button</Button>
          <h1 className="App-title">MERN Boilerplate</h1>
          <NavLink to="/" exact>Home</NavLink>
          <NavLink to="/countries">Countries</NavLink>
          <NavLink to="/add-country">Add country</NavLink>
          {!api.isLoggedIn() && <NavLink to="/signup">Signup</NavLink>}
          {!api.isLoggedIn() && <NavLink to="/login">Login</NavLink>}
          {api.isLoggedIn() && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>}
          <NavLink to="/secret">Secret</NavLink>
          <NavLink to="/upload">Upload</NavLink>
          <NavLink to="/manage-account">Manage Account</NavLink>
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/countries" component={Countries} />
          <Route path="/add-country" component={AddCountry} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/secret" component={Secret} />
          <Route path="/upload" component={FileUpload} />
          <Route path="/manage-account" component={AccountForm} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}