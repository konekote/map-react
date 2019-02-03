import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
import escapeRegExp from 'escape-string-regexp'
import foursquareAPI from './FoursquareAPI'

export class App extends Component {
  state = {
    showingInfoWindow: false, //Hides or shows the infoWindow
    activeMarker: null, //Shows the active marker upon click
    selectedPlace: {}, //Shows the infoWindow to the selected place upon a marker
    markers: [
      { id: 1, name: 'The National Museum of Romanian History', position: { lat: 44.4314472, lng: 26.097429 }, location:"", shortUrl:"" },
      { id: 2,name: 'The National Museum of Art of Romania', position: { lat: 44.4393759, lng: 26.0957858 }, location:"", shortUrl:"" },
      { id: 3,name: 'Palace of Parliament', position: { lat: 44.428331, lng: 26.087627 }, location:"", shortUrl:"" },
      { id: 4,name: 'Politechnica Park', position: { lat: 44.4386853, lng: 26.0493431 }, location:"", shortUrl:"" },
      { id: 5,name: 'The Fire Tower', position: { lat: 44.4402447, lng: 26.1206101 }, location:"", shortUrl:"" }
    ],
    results: [],
    query: ''
  }

  //Get the necessary venue information from Foursquare for location and the short URL and update markers information in markers array
  getVenueDetails(id, index, markers) {
    const param = {
      venue_id: id,
    }
    foursquareAPI.getVenue(param, function(error, venue) {
      if (!error) {
          markers[index].location = venue.response.venue.location.formattedAddress.join(', ');
          markers[index].shortUrl = venue.response.venue.shortUrl;
      }
    });
  }

  //Get all information about venues from Foursquare using lat and lng from markers array
  getVenues(marker, index) {
    const param = {
      'll': `${marker.position.lat},${marker.position.lng}`,
      'limit': 1, //limit result to 1
      'radius': 1, //get the most specific results by limiting the radius
    };
    const callback = this.getVenueDetails;
    const markers = this.state.markers;
    foursquareAPI.getVenues(param, function(error, venues) {
      if (!error) {
        callback(venues.response.venues[0].id, index, markers);
      }
    });
  }

  //Use callbacks declared above to get information from Foursquare
  componentDidMount() {
    this.state.markers.map((marker, index) => this.getVenues(marker, index));
  };

  //Make maerker active marker on click and show info window
  onMarkerClick = (props, marker) => this.setState({
    showingInfoWindow: true,
    activeMarker: marker,
    selectedPlace: props
  });

  //Close info window and clear animation and active marker
  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.state.activeMarker.setAnimation(null);
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
    }
  };

  //Render markers for results array if not empty. If empty, render markers for marker array
  renderMarkers = () => {  
    if (this.state.results.length) {
      return this.state.results.map(result =>
        <Marker ref={result.id} key={result.name}
          onClick={this.onMarkerClick}
          name={result.name}
          position={result.position}
        />
      );
    } else {
        return this.state.markers.map(marker =>
          <Marker ref={marker.id} key={marker.name}
            onClick={this.onMarkerClick}
            name={marker.name}
            position={marker.position}
          />
      );
    }
  }

  //Activate marker by clicking on list item button and add animation to marker
  activateMarker = (markerProperties) => {
    const markerToActivate = this.refs[markerProperties.id];
    const animation = window.google ? window.google.maps.Animation.BOUNCE:null;
    markerToActivate.marker.setAnimation(animation);
    
    if(this.state.activeMarker) {
      this.state.activeMarker.setAnimation(null);
    }
    this.setState({
      showingInfoWindow: true,
      activeMarker: markerToActivate.marker,
      selectedPlace: {...markerProperties}
    });
  }

  clearQuery = () => {
    this.setState({ results: [] })
    this.setState({ query: '' })
}

  updateQuery = (query) => {
    this.setState({ query })
  }

  updateQueryResults = () => {
    if (this.state.query.length) {
      this.setState({ results: [] })
      const query = this.state.query;
      const match = new RegExp(escapeRegExp(query), 'i')
      this.setState({ results: this.state.markers.filter((marker) => match.test(marker.name)) });
      this.renderMarkers();
    } else {
      this.setState({ results: [] })
    }
  }

  renderListButtons = (array) => {
    return array.map((marker) => (
      <li key={marker.id}><button onClick={()=>this.activateMarker(marker)}>{marker.name}</button></li>
    ));
  }

  renderList = () => {
    if (this.state.results.length) {
      return this.renderListButtons(this.state.results);
    } else {
      return this.renderListButtons(this.state.markers);
    }
  }
  

  render() {
    const renderedMarkers = this.renderMarkers();
    return (
      <div className="App">
        <div className="container">
          <div className="search">
            <input 
              type="text" 
              name="search" 
              placeholder="Find attraction"
              value={this.state.query}   
              onChange={(event) => this.updateQuery(event.target.value)}           
            />
            <input 
              type="submit" 
              value="Search" 
              onClick={(event) => this.updateQueryResults(event)}
            />
            <button onClick={this.clearQuery}>Show all</button>
            <ul>
              {this.renderList()}
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
              {renderedMarkers}

              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h3>{this.state.selectedPlace.name}</h3>
                  <p>{this.state.selectedPlace.location}</p>
                  <p>{this.state.selectedPlace.shortUrl}</p>
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
