import React from 'react';
import { mount, shallow } from 'enzyme';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';
import NumberOfEvents from '../NumberOfEvents';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
  test('When user hasn\'t specified a number, then 32 is the default number of events', ({ given, when, then}) => {
    let AppWrapper;
    given('the list of events is loaded', () => {
      AppWrapper = mount(<App />);
      expect(AppWrapper.find('EventList')).toHaveLength(1);
    });
    when('the user hasn\'t specified the number of events', () => {

    });
    then('the number of events must be set to 32 by default', () => {
      expect(AppWrapper.state('numberofevents')).toBe(32);
    });
  });

  test('User can change the number of events', ({ given, when, then }) => {
    let AppWrapper;
    let NumberOfEventsWrapper;
    given('the list of events is loaded', () => {
      AppWrapper = mount(<App />);
      expect(AppWrapper.find('EventList')).toHaveLength(1);      
    });
    when('the user specifies the number of events', () => {
      NumberOfEventsWrapper = shallow(<NumberOfEvents updateEvents={() => {}} />);
      const eventOb = { target: { value: '20' }};
      NumberOfEventsWrapper.find('.numberOfEvents').simulate('change', eventOb);
    });
    then('the user should see a list of specified number of events', () => {
      expect(NumberOfEventsWrapper.state('numberofevents')).toBe('20');
    });
  });

});
