import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import EventList from '../EventList';
import CitySearch from '../CitySearch';
import NumberOfEvents from '../NumberOfEvents';
import { mockData } from '../mock-data';
import { extractLocations, getEvents } from '../api';

// unit test scope
describe('<App /> component', () => {

  let AppWrapper;

  beforeAll(() => {
    AppWrapper = shallow(<App />);
  });
  
  test('render list of events', () => {
    expect(AppWrapper.find(EventList)).toHaveLength(1);
  });

  test('render CitySerch', () => {
    expect(AppWrapper.find(CitySearch)).toHaveLength(1);
  });

  test('render number of events', () => {
    expect(AppWrapper.find(NumberOfEvents)).toHaveLength(1);
  });

});

// integration test scope
describe('<App /> integration', () => {
  test('App passes "events" state as a prop to EventList', () => {
    const AppWrapper = mount(<App />);
    const AppEventsState = AppWrapper.state('events');
    expect(AppEventsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppEventsState);
    AppWrapper.unmount();
  });

  test('App passes "locations" state as a prop to CitySearch', () => {
    const AppWrapper = mount(<App />);
    const AppLocationsState = AppWrapper.state('locations');
    expect(AppLocationsState).not.toEqual(undefined);
    expect(AppWrapper.find(CitySearch).props().locations).toEqual(AppLocationsState);
    AppWrapper.unmount();
  });

  test('get list of events matching the city selected by the user', async () => {
    const AppWrapper = mount(<App />);
    const CitySearchWrapper = AppWrapper.find(CitySearch);
    const locations = extractLocations(mockData);
    CitySearchWrapper.setState({ suggestions: locations });
    const suggestions = CitySearchWrapper.state('suggestions');
    const selectedIndex = Math.floor(Math.random() * (suggestions.length));
    const selectedCity = suggestions[selectedIndex];
    await CitySearchWrapper.instance().handleItemClicked(selectedCity);
    const allEvents = await getEvents();
    const eventsToShow = allEvents.filter(event => event.location === selectedCity);
    expect(AppWrapper.state('events')).toEqual(eventsToShow);
    AppWrapper.unmount();
  });

  test('get list of all events when user selects "See all cities"', async () => {
    const AppWrapper = mount(<App />);
    const suggestionItems = AppWrapper.find(CitySearch).find('.suggestions li');
    await suggestionItems.at(suggestionItems.length - 1).simulate('click');
    const allEvents = await getEvents();
    expect(AppWrapper.state('events')).toEqual(allEvents);
    AppWrapper.unmount();
  });

  test('App passes "numberofevents" as a prop to NumberOfEvents Component', () => {
    const AppWrapper = mount(<App />);
    const AppNoOfEvents = AppWrapper.state('numberofevents');
    expect(AppWrapper.find(NumberOfEvents).props().numberofevents).toEqual(AppNoOfEvents);
    AppWrapper.unmount();
  });

  test('change number of events displayed after user updates number', () => {
    const AppWrapper = mount(<App />);
    const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
    AppWrapper.instance().updateEvents = jest.fn();
    AppWrapper.instance().forceUpdate();
    NumberOfEventsWrapper.setState({ numberofevents: 32 });
    const eventOb = { target: { value: 1 }};
    NumberOfEventsWrapper.find('.numberOfEvents').simulate('change', eventOb);
    expect(NumberOfEventsWrapper.state('numberofevents')).toBe(1);
    expect(AppWrapper.instance().updateEvents).toHaveBeenCalledWith(null, 1);
    AppWrapper.unmount();  
  });

});