import React, { Component } from 'react';
import api from '../../api';
import { instanceOf } from 'prop-types';

export default class AccountForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user:{
        username: "",
        firstName:"",
        lastName:"",
        password: "",
        email: "",
        phone: "",
        category: "food",
        description: "",
        logo: "",
      },     
      logo: "",
      message: null,
      valid: false,
      
    }
    // this.form = React.createRef();
    // this.validate = this.validate.bind(this);
    // this.handleInputChange = this.handleInputChange.bind(this)
  }

  // validate() {
  //   this.form.current.reportValidity();
  // }

  handleInputChange = (event) => {
    // console.log(event.target.name);
    let info,password,logo;
    if(event.target.name !== 'logo'){
      // console.log(event.target.name)
      var user = {...this.state.user}
      user[event.target.name] = event.target.value;
      this.setState(currentState => ({user}), () => {
        console.log(this.state.user);

        ({password,logo,...info} = this.state.user)

        let stateValues = Object.values(info);

        console.log('stateValues',stateValues);

        this.setState({valid: stateValues.every(isNotEmpty)});

        function isNotEmpty(currentValue) {
          //I'm not evaluating the logo yet but I still put the File validation
          return currentValue.length > 0 || currentValue instanceof File;
        }
      });

    } else {
      this.setState({
        logo: event.target.files[0]
      });
    }
  }

  submitToServer = async ()=>{
    console.log('submition!');
    let url;
    let user = {...this.state.user};

    if(this.state.logo && this.state.logo instanceof File){
      console.log('uploaded Logo');
      const stateFile = this.state.logo;
      url = await api.uploadToS3(stateFile);
      console.log('Form api response', url.data.Location);
      user.logo = url.data.Location;
    }

    this.setState(currentState =>({user}),( ) =>{
      api.updateUser(this.state.user)
    });
    
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
        {this.state.user.logo && <img src={this.state.user.logo} alt="company logo"/>}
        <form id="account" >
          <h2>User Info</h2>
          Username: <input type="text" value={this.state.user.username} name="username" onChange={this.handleInputChange} /> <br />
          First Name: <input type="text" value={this.state.user.firstName} name="firstName" onChange={this.handleInputChange} /> <br />
          Last Name: <input type="text" value={this.state.user.lastName} name="lastName" onChange={this.handleInputChange} /> <br />
          <h2>Contact Info</h2>
          email: <input type="email" value={this.state.user.email} name="email" onChange={this.handleInputChange} /> <br />
          phone: <input type="text" className="field" pattern="\d{8}" value={this.state.phone} name="phone" onChange={this.handleInputChange} /> <br />
          <h2>Company Info</h2>
          Logo: <input accept=".jpg,.jpeg,.png" type="file" name="logo" onChange={this.handleInputChange} /> <br />
          description: <textarea rows="4" form="account" name="description" onChange={this.handleInputChange}></textarea> <br />
          category: <select name="category" value={this.state.user.category} onChange={this.handleInputChange}>
                      <option value="beauty">Beauty</option>
                      <option value="food">Food</option>
                      <option value="gifts">Gift</option>
                      <option value="linen">Linen</option>
                      <option value="clothing">Clothing</option>
                    </select> <br />
          Password: <input type="password" value={this.state.user.password} name="password" onChange={this.handleInputChange} /> <br />
          <button onClick={this.handleClick} disabled={!this.state.valid}>Update</button>
          
          
        </form>
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
      </div>
    );
  }
}