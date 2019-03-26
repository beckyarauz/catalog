import { Link, NavLink } from 'react-router-dom';
import React, { Component } from 'react';
import api from '../api';

export default class NavBar extends Component {

  handleLogoutClick = async (e) => {
    this.props.inLogout();
    await api.logout();
  }

  render(){
    return ( 
    <div style={{ textAlign: 'center' }}>
      <NavLink to="/" exact>Home</NavLink>
      {this.props.isLogged &&<NavLink to="/add-product">Add a Product</NavLink>}
      {this.props.isLogged &&<NavLink to={`/profile/${this.props.user}`} >Profile</NavLink>}
      {this.props.isLogged &&<NavLink to="/manage-account" >Manage Account</NavLink>}
      <NavLink to="/browse">Browse</NavLink>
      {!this.props.isLogged && <NavLink to="/signup">Signup</NavLink>}
      {!this.props.isLogged && <NavLink to="/login">Login</NavLink>}
      {this.props.isLogged && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>}
    </div>
    )
  }
  
  
};