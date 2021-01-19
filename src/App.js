import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { extractLocations, getEvents } from './api';
import "./nprogress.css";
import { InfoAlert } from './Alert';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import EventGenre from './EventGenre';


class App extends Component {
  state = {
    events: [],
    locations: [],
    numberofevents: 32,
    currentLocation: 'all',
    infoText: ''
  }

  updateEvents = (location, eventCount) => {
    const { currentLocation, numberofevents } = this.state;
    if(location) {
      getEvents().then((events) => {
        const locationEvents = (location === 'all') ?
        events :
        events.filter((event) => event.location === location);
        const filteredEvents = locationEvents.slice(0, numberofevents);
        this.setState({
          events: filteredEvents,
          currentLocation: location,
        });
      });
    }
    else {
      getEvents().then((events) => {
        const locationEvents = (currentLocation === 'all') ?
        events :
        events.filter((event) => event.location === currentLocation);
        const filteredEvents = locationEvents.slice(0, eventCount);
        this.setState({
          events: filteredEvents,
          numberofevents: eventCount,
        });
      });      
    }
  };

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length;
      const city = location.split(',').shift();
      return {city, number};
    });
    return data;
  };

  componentDidMount() {
    this.mounted = true;
    if(!navigator.onLine){
      this.setState({
        infoText: 'You are not connected to the internet. Data has been loaded from cache.'
      });
    }
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ events, locations: extractLocations(events) });
      } 
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <div className="App">
        <h3>Meet App</h3>
        <h5>Choose your nearest city</h5>
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <h5>Number of events</h5>
        <NumberOfEvents numberofevents={this.state.numberofevents} updateEvents={this.updateEvents} />
        <InfoAlert text={this.state.infoText} />
        <h5>Events in each city</h5>
        <div className="data-vis-wrapper">
          <EventGenre events={this.state.events} />
          <ResponsiveContainer height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="category" dataKey="city" name="city" />
              <YAxis type="number" dataKey="number" name="number of events" allowDecimals={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={this.getData()} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>

        </div>

        <EventList events={this.state.events} />
      </div>
    );
  }
}

export default App;
