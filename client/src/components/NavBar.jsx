// import Link from 'next/link';
// import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import React, { Component } from 'react';
import api from '../api';

export default class NavBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  isLogged = async (e) => {
    return await api.isLoggedIn();    
  }
  handleLogoutClick = async (e) => {
    await api.logout();
    this.props.inLogout();
  }

  render(){
    return ( <div>
      <NavLink to="/" exact>Home</NavLink>
            <NavLink to="/countries">Countries</NavLink>
            <NavLink to="/add-country">Add country</NavLink>
            {!this.props.isLogged && <NavLink to="/signup">Signup</NavLink>}
            {!this.props.isLogged && <NavLink to="/login">Login</NavLink>}
            {this.props.isLogged && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>}
            <NavLink to="/secret">Secret</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            <NavLink to="/manage-account">Manage Account</NavLink>
            <NavLink to="/form-test">Form Test</NavLink>
    </div>)
  }
  
  
};

// export default Navbar;