import { Link, NavLink } from 'react-router-dom';
import React, { Component } from 'react';
import api from '../api';

export default class NavBar extends Component {

  handleLogoutClick = async (e) => {
    await api.logout();
    this.props.inLogout();
  }

  render(){
    return ( <div>
      <NavLink to="/" exact>Home</NavLink>
            <NavLink to="/add-product">Add a Product</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/manage-account">Manage Account</NavLink>
            <NavLink to="/browse">Browse</NavLink>
            {!this.props.isLogged && <NavLink to="/signup">Signup</NavLink>}
            {!this.props.isLogged && <NavLink to="/login">Login</NavLink>}
            {this.props.isLogged && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>}
    </div>)
  }
  
  
};