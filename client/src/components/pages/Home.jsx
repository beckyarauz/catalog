import React, { Component } from 'react';
import api from '../../api';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 0,
        longitude: 0,
        zoom: 13,
        bearing: 0,
        pitch: 0,
        width: 350,
        height: 250,
      }
    };
  }
  componentWillMount(){
    api.bookmarkProduct('5c9b7cee12a4f11b2c95f148');
    if ("geolocation" in navigator) {
      let self = this;
      navigator.geolocation.getCurrentPosition(function(position) {
        let viewport = {...self.state.viewport};
        viewport.latitude = position.coords.latitude
        viewport.longitude = position.coords.longitude

        self.setState({viewport});
      })
    } else {
      /* geolocation IS NOT available */
    }
  }

  handleMarkerDrag = (e) =>{
    let viewport = this.state.viewport;
    viewport.longitude = e.lngLat[0];
    viewport.latitude = e.lngLat[1];

    this.setState({viewport})
  }
  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}
