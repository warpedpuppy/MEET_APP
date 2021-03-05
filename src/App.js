import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { extractLocations, getEvents, checkToken } from './api';
import './nprogress.css';
import Login from './Login';
import { WarningAlert } from './Alert';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import EventGenre from './EventGenre';


class App extends Component {
  constructor() {
    super()
    this.state = {
      events: [],
      locations: [],
      numberOfEvents: 12,
      currentLocation: 'all',
      tokenCheck: false,
      warningText: '',
      showCharts: true
    }
  }

  updateEvents = (location, eventCount) => {

    // offline warning
    if(!navigator.onLine) {
      this.setState({
        warningText: 'You are offline and using old search results, the events loaded may not be the most up to date!'
      });
    } else {
      this.setState({
        warningText: ''
      })
    }

    const {currentLocation, numberOfEvents} = this.state;
    if (location) {
      getEvents().then((events) => {
        const locationEvents = 
          location === 'all'
            ? events
            : events.filter((event) => event.location === location);
        const filteredEvents = locationEvents.slice(0, numberOfEvents);
        this.setState({
          events: filteredEvents,
          currentLocation: location
        });
      });
    } else {
      getEvents().then((events) => {
        const locationEvents = 
          currentLocation === 'all'
            ? events
            : events.filter((event) => event.location === currentLocation);
        const filteredEvents = locationEvents.slice(0, eventCount);
        this.setState({
          events: filteredEvents,
          numberOfEvents: eventCount
        });
      });
    }
  }

  async componentDidMount() {
    // google verification PDF task
    const accessToken = localStorage.getItem('access_token');
    const validToken = accessToken !== null 
      ? await checkToken(accessToken)
      : false;
    this.setState({ tokenCheck: validToken });
    if(validToken === true) 
      this.updateEvents();
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
    this.mounted = true;
    if (code && this.mounted === true && validToken === false){
      this.setState({ tokenCheck: true });
      this.updateEvents()
    }


    this.mounted = true;
    getEvents().then((events) => {
      if(this.mounted) {
      this.setState({ events, locations: extractLocations(events) });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getData = () => {
    const {locations, events} = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length
      const city = location.split(',').shift()
      return {city, number};
    })
    return data;
  }

  handleShowCharts = () => {
    if(this.state.showCharts === false){
      this.setState({showCharts: true});
    } else {
      this.setState({showCharts: false})
    }
  };


  render() {
    let {tokenCheck} = this.state;
    const {locations, numberOfEvents, events} = this.state;
    const showCharts = this.state.showCharts;

    return {tokenCheck} === false ? (
      <div className='App'>
        <Login />
      </div>
    ) : (
      <div className='App'>
        <Navbar variant='dark'  expand='md' fixed='top' className='color-nav'>
          <Navbar.Brand className='brand' href='https://ksflynn007.github.io/meet-app/'>
            Code Club
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse>
            <Nav>
              <Nav.Item>
                <Nav.Link className='justify-content-end' href='https://ksflynn007.github.io/meet-app/privacy-policy.html'>Privacy Policy</Nav.Link>
              </Nav.Item>
              <Nav.Item className='header-welcome'>Welcome to the Code Club, please select a city below to find an event:</Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <WarningAlert text={this.state.warningText}/>

        <CitySearch 
          locations={locations} 
          updateEvents={this.updateEvents}
          />
        <NumberOfEvents 
          numberOfEvents={numberOfEvents}
          updateEvents={this.updateEvents}
          />
        
        <div className='data-vis-wrapper'>
          <div className='charts-collapsed'>
          <p>Your search results at a glance:</p>
          {!showCharts && (
            <button className='charts-btn' onClick={this.handleShowCharts}>
              See charts
            </button>
          )}
          {showCharts && (
            <button className='charts-btn' onClick={this.handleShowCharts}>
              Hide charts
            </button>
          )}
          </div>

          {showCharts && (
            <div className='charts-expanded'>
            <EventGenre events={events} />

          <ResponsiveContainer height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />

            <XAxis type='category' dataKey='city' name='City'/>
            <YAxis type='number' dataKey='number' name='Number of Events' allowDecimals={false}/>

            <Tooltip/>
            <Scatter data={this.getData()} fill='#ea21a2'/>
          </ScatterChart>
          </ResponsiveContainer>

            </div>
          )}
        </div>


        <EventList events={events}/>
      </div>
    )
  };
}

export default App;
