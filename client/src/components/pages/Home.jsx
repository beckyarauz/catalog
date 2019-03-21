import React, { Component } from 'react';

export default class Home extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  componendDidMount(){
    if ("geolocation" in navigator) {
      console.log('geolocation is available')
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log('geolocation is NOT available')
    }
  }

  render() {                
    return (
      <div className="Home">
        <h2>Home</h2>
        <p>This is a sample project with the MERN stack</p>
      </div>
    );
  }
}
