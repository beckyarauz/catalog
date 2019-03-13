import React, { Component } from 'react';

import api from '../../api';

export default class AccountForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      firstName:"",
      lastName:"",
      password: "",
      email: "",
      phone: "",
      category: "food",
      description: "",
      logo: "",
      message: null,
      valid: false
    }
    this.form = React.createRef();
    this.validate = this.validate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  validate() {
    this.form.current.reportValidity();
  }

  handleInputChange(event) {
    if(event.target.name !== 'logo'){
      this.setState({
        [event.target.name]: event.target.value
      });
    } else {
      this.setState({
        logo: event.target.files[0]
      });
    }

    let message,password,valid, rest;

    ({message,password,valid, ...rest} = this.state);
    
    let stateValues = Object.values(rest);
    console.log(stateValues);

    this.validate();

    this.setState({valid: stateValues.every(isNotEmpty)});

    function isNotEmpty(currentValue) {
      return currentValue.length > 0 || currentValue instanceof File;
    }
  }

  submitToServer = ()=>{
    console.log('submition!');
    // api.submitFile(this.state.logo);
    // e.preventDefault();
    const stateFile = this.state.logo;
    api.uploadToS3(stateFile);
  }
  unvalidFormHandler = ()=>{
    this.setState({message:'fill all the fields!' })
    console.log('fill all the fields!');
  }

  handleClick = (e) => {
    e.preventDefault()
    this.state.valid ? this.submitToServer() : this.unvalidFormHandler();
  }

  render() {
    return (
      <div className="AccountForm" >
        <h2>Account</h2>
        <form id="account" ref={this.form}>
          <h2>User Info</h2>
          Username: <input type="text" value={this.state.username} name="username" onChange={this.handleInputChange} /> <br />
          First Name: <input type="text" value={this.state.firstName} name="firstName" onChange={this.handleInputChange} /> <br />
          Last Name: <input type="text" value={this.state.lastName} name="lastName" onChange={this.handleInputChange} /> <br />
          <h2>Contact Info</h2>
          email: <input type="email" value={this.state.email} name="email" onChange={this.handleInputChange} /> <br />
          phone: <input type="text" className="field" pattern="\d{8}" value={this.state.phone} name="phone" onChange={this.handleInputChange} /> <br />
          <h2>Company Info</h2>
          Logo: <input accept=".jpg,.jpeg,.png" type="file" name="logo" onChange={this.handleInputChange} /> <br />
          description: <textarea rows="4" form="account" name="description" onChange={this.handleInputChange}></textarea> <br />
          category: <select name="category" value={this.state.category} onChange={this.handleInputChange}>
                      <option value="beauty">Beauty</option>
                      <option value="food">Food</option>
                      <option value="gifts">Gift</option>
                      <option value="linen">Linen</option>
                      <option value="clothing">Clothing</option>
                    </select> <br />
          Password: <input type="password" value={this.state.password} name="password" onChange={this.handleInputChange} /> <br />
          <button onClick={this.handleClick} disabled={!this.state.valid}>Update</button>
          
          
        </form>
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
      </div>
    );
  }
}