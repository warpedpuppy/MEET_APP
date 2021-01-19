import React from 'react';
import { mount, shallow } from 'enzyme';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';
import Event from  '../Event';
import { mockData } from '../mock-data';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  test('Additional info of an event is collapsed by default', ({ given, when, then }) => {
    let AppWrapper;
    let EventWrapper;
    given('the list of events is loaded', () => {
      AppWrapper = mount(<App />);
      expect(AppWrapper.find('EventList')).toHaveLength(1);
    });
    when('the user looks at the list of events', () => {

    });
    then('the additional info is collapsed.', () => {
      EventWrapper = mount(<Event event={mockData[0]} />);
      expect(EventWrapper.state('toggleDetails')).toEqual(false);
    });
  });

  test('User can expand the event\'s details', ({ given, when, then }) => {
    let AppWrapper;
    let EventWrapper;
    given('the list of events is loaded', () => {
      AppWrapper = mount(<App />);
      expect(AppWrapper.find('EventList')).toHaveLength(1);
    });
    when('the user clicks on show details button', () => {
      EventWrapper = shallow(<Event event={mockData[0]} />);
      expect(EventWrapper.state('toggleDetails')).toEqual(false);
      EventWrapper.find('.hide-details').simulate('click');
    });
    then('the user should be able to see the additional information of the event.', () => {
      expect(EventWrapper.state('toggleDetails')).toEqual(true);
    });
  });

  test('User can collapse the event\'s details', ({ given, when, then }) => {
    let EventWrapper;
    given('the detailed view of the event is loaded', () => {
      EventWrapper = shallow(<Event event={mockData[0]} />);
      EventWrapper.find('.hide-details').simulate('click');
      expect(EventWrapper.state('toggleDetails')).toEqual(true);
    });
    when('the user clicks on the hide details button', () => {
      EventWrapper.find('.hide-details').simulate('click');
    });
    then('the user should see minimal details of the event.', () => {
      expect(EventWrapper.state('toggleDetails')).toBe(false);
    });
  });

});
