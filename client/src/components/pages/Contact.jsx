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
        <h2>Contact Info</h2>
        {this.props.name && <div>
        <p><b>Name:</b></p>
        <p>{this.props.name}</p>
        </div>}
        {this.props.email && <div>
        <p><b>Email:</b></p>
        <p>{this.props.email}</p>
        </div>}
        {this.props.phone && <div>
        <p><b>Phone:</b></p>
        <p>{this.props.phone}</p>
        </div>}
        {this.props.address && <div>
        <p><b>Address:</b></p>
        <p>{this.props.address}</p>
        </div>}
        
        {this.state.message && <div className="info info-danger">
          {this.state.message}
        </div>}
      </div>
    );
  }
}
