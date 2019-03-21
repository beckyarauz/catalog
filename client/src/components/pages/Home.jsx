import React, { Component } from 'react';
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
// import MapGL, {NavigationControl} from 'react-map-gl';
import ReactMapGL, { NavigationControl, Popup, Marker } from 'react-map-gl';
import Icon from '@material-ui/core/Icon';

const TOKEN = 'pk.eyJ1IjoiYmVja3lhcmF1eiIsImEiOiJjanRpb2kyc3cwbjVkM3luem42bW5ydHJ2In0.4-rDIk32b4VkF9Y_g9oLqg';

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
      <div>Hello</div>
      // <ReactMapGL
      //   {...this.state.viewport}
      //   mapStyle="mapbox://styles/beckyarauz/cjtisim0s272e1fubskpzz1om"
      //   mapboxApiAccessToken={TOKEN}
      //   onViewportChange={(viewport) => this.setState({ viewport })}
      // >
      //   <div style={{ position: 'absolute' }}>
      //     <NavigationControl onViewportChange={(viewport) => this.setState({ viewport })} />
      //   </div>
      //   <Marker latitude={this.state.viewport.latitude} longitude={this.state.viewport.longitude} offsetLeft={-20} offsetTop={-10} draggable={true} onDragEnd={e => this.handleMarkerDrag(e)}>
      //     <div ><Icon>location_on</Icon></div>
      //   </Marker>
      // </ReactMapGL>
    );
  }
}
