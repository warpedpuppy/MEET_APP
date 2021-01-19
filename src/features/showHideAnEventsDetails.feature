Feature: Show/Hide an events details

  Scenario: Additional info of an event is collapsed by default
    Given the list of events is loaded
    When the user looks at the list of events
    Then the additional info is collapsed.

  Scenario: User can expand the event's details
    Given the list of events is loaded
    When the user clicks on show details button
    Then the user should be able to see the additional information of the event.

  Scenario: User can collapse the event's details
    Given the detailed view of the event is loaded
    When the user clicks on the hide details button
    Then the user should see minimal details of the event.
