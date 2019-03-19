import React, { Component } from 'react';
// import api from '../../api';

export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secret: null,
      message: null
    }
  }
  render() {
    return (
      <div className="Contact">
        <h2>Contact</h2>
        <p><b>Name:</b></p>
        <p>{this.props.name}</p>
        <p><b>Email:</b></p>
        <p>{this.props.email}</p>
        <p><b>Phone:</b></p>
        <p>{this.props.phone}</p>
        <p><b>Address:</b></p>
        <p>{this.props.address}</p>
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
      </div>
    );
  }
}
