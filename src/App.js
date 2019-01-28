import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'

export class App extends Component {
  state = {
    showingInfoWindow: false, //Hides or the shows the infoWindow
    activeMarker: {}, //Shows the active marker upon click
    selectedPlace: {}, //Shows the infoWindow to the selected place upon a marker
    markers: [
      { id: 1, name: 'The National Museum of Romanian History', position: { lat: 44.4314472, lng: 26.097429 } },
      { id: 2,name: 'The National Museum of Art of Romania', position: { lat: 44.4393759, lng: 26.0957858 } },
      { id: 3,name: 'Palace of Parliament', position: { lat: 44.4275154, lng: 26.0872672 } },
      { id: 4,name: 'AFI Cotroceni Shopping Mall', position: { lat: 44.4306195, lng: 26.0521446 } },
      { id: 5,name: 'The Fire Tower', position: { lat: 44.4402447, lng: 26.1206101 } }
    ],
    query: ''
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

  renderMarkers = () => {
    if (!this.state.query.length) {
      return this.state.markers.map(marker =>
        <Marker key={marker.name}
          onClick={this.onMarkerClick}
          name={marker.name}
          position={marker.position}
        />
      );
    }
  }

  render() {

    return (
      <div className="App">
        <div className="container">
          <div className="search">
            <input type="text" name="search" placeholder="Find attraction"/>
            <input type="submit" value="Search" />
            <ul>
              {this.state.markers.map(marker => (
                <li key={marker.id}>{marker.name}</li>
              ))}
            </ul>
          </div>
          <div className="MapContainer">

            <Map
              className="Map"
              google={this.props.google}
              zoom={14}
              initialCenter={{
                lat: 44.4314472,
                lng: 26.097429
              }}
            >
              {this.renderMarkers()}

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
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBhwsiciOILeNSWQUMYcl9BmI1g0tSy33E'
})(App);
