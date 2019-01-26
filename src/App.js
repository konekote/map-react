import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'

export class App extends Component {
  state = {
    showingInfoWindow: false, //Hides or the shows the infoWindow
    activeMarker: {}, //Shows the active marker upon click
    selectedPlace: {} //Shows the infoWindow to the selected place upon a marker
  }


  onMarkerClick = (props, marker, e) => this.setState({
    showingInfoWindow: true,
    activeMarker: marker,
    selectedPlace: props
  });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
    }
  };

  render() {

    return (
      <div className="App">
        <div className="Search">
          <input type="text" name="name" />
        </div>
        <Map
          google={this.props.google}
          zoom={14}
          initialCenter={{
            lat: 44.4314472,
            lng: 26.097429
          }}
        >
  
          <Marker
            onClick={this.onMarkerClick}
            name={'The National Museum of Romanian History'}
            position={{ lat: 44.4314472, lng: 26.097429 }}
          />
          <Marker
            onClick={this.onMarkerClick}
            name={'The National Museum of Art of Romania'}
            position={{ lat: 44.4393759, lng: 26.0957858 }}
          />
          <Marker
            onClick={this.onMarkerClick}
            name={'Palace of Parliament'}
            position={{ lat: 44.4275154, lng: 26.0872672 }}
          />
          <Marker
            onClick={this.onMarkerClick}
            name={'AFI Cotroceni Shopping Mall'}
            position={{ lat: 44.4306195, lng: 26.0521446 }}
          />
          <Marker
            onClick={this.onMarkerClick}
            name={'The Fire Tower'}
            position={{ lat: 44.4402447, lng: 26.1206101 }}
          />

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h3>{this.state.selectedPlace.name}</h3>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBhwsiciOILeNSWQUMYcl9BmI1g0tSy33E'
})(App);
