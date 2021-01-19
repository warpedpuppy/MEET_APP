import React from 'react';
import { shallow } from 'enzyme';
import Event from '../Event';

describe('<Event /> component', () => {

  const event = {
   "kind": "calendar#event",
   "etag": "\"3181159875584000\"",
   "id": "3qtd6uscq4tsi6gc7nmmtpqlct_20200520T120000Z",
   "status": "confirmed",
   "htmlLink": "https://www.google.com/calendar/event?eid=M3F0ZDZ1c2NxNHRzaTZnYzdubW10cHFsY3RfMjAyMDA1MjBUMTIwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
   "created": "2020-05-19T19:14:30.000Z",
   "updated": "2020-05-27T11:45:37.792Z",
   "summary": "React is Fun",
   "description": "Love HTML, CSS, and JS? Want to become a cool front-end developer? \n\nReact is one of the most popular front-end frameworks. There is a huge number of job openings for React developers in most cities. \n\nJoin us in our free React training sessions and give your career a new direction. ",
   "location": "Berlin, Germany",
   "creator": {
    "email": "fullstackwebdev@careerfoundry.com",
    "self": true
   },
   "organizer": {
    "email": "fullstackwebdev@careerfoundry.com",
    "self": true
   },
   "start": {
    "dateTime": "2020-05-20T14:00:00+02:00",
    "timeZone": "Europe/Berlin"
   },
   "end": {
    "dateTime": "2020-05-20T15:00:00+02:00",
    "timeZone": "Europe/Berlin"
   },
   "recurringEventId": "3qtd6uscq4tsi6gc7nmmtpqlct",
   "originalStartTime": {
    "dateTime": "2020-05-20T14:00:00+02:00",
    "timeZone": "Europe/Berlin"
   },
   "iCalUID": "3qtd6uscq4tsi6gc7nmmtpqlct@google.com",
   "sequence": 0,
   "reminders": {
    "useDefault": true
   }
  };
  

  let EventWrapper;
  beforeAll(() => {
    EventWrapper = shallow(<Event event={event}/>);
  });

  test('render the Event component', () => {
    expect(EventWrapper).toHaveLength(1);
  });

  test('render event div', () => {
    expect(EventWrapper.find('.event')).toHaveLength(1);
  });

  test('render summary of event', () => {
    expect(EventWrapper.find('.summary').text()).toBe('React is Fun');
  });

  // test('render description of the event', () => {
  //   expect(EventWrapper.find('.description')).toHaveLength(1);
  // });

  test('render start time of the event', () => {
    expect(EventWrapper.find('.start-time').text()).toBe('2020-05-20T14:00:00+02:00');
  });

  test('render location of the event', () => {
    expect(EventWrapper.find('.location').text()).toBe('Berlin, Germany');
  });

  test('render the hide details button', () => {
    expect(EventWrapper.find('.hide-details')).toHaveLength(1);
  });

  test('the hide details button is collapsed and changes state on click', () => {
    expect(EventWrapper.state('toggleDetails')).toBe(false);
    EventWrapper.find('.hide-details').simulate('click');
    expect(EventWrapper.state('toggleDetails')).toBe(true);
    expect(EventWrapper.find('.description')).toHaveLength(1);
  });

  test('the show details button is displayed and collapses on click', () => {
    expect(EventWrapper.state('toggleDetails')).toBe(true);
    EventWrapper.find('.hide-details').simulate('click');
    expect(EventWrapper.state('toggleDetails')).toBe(false);
  }); 

});