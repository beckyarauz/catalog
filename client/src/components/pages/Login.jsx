import React, { PureComponent } from 'react';
import api from '../../api';

export default class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      message: null
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClick = async (e) => {
    e.preventDefault()
    await api.login(this.state.username, this.state.password)
    this.props.inLogin();
  }

  render() {
    return (
      <div className="Login">
        <h2>Login</h2>
        <form>
          Username: <input type="text" value={this.state.username} name="username" onChange={this.handleInputChange} /> <br />
          Password: <input type="password" value={this.state.password} name="password" onChange={this.handleInputChange} /> <br />
          <button onClick={this.handleClick}>Login</button>
        </form>
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
      </div>
    );
  }
}
