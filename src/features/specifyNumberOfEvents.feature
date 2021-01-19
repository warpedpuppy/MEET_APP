Feature: Specify number of events

  Scenario: When user hasn't specified a number, then 32 is the default number of events
    Given the list of events is loaded
    When the user hasn't specified the number of events
    Then the number of events must be set to 32 by default

  Scenario: User can change the number of events
    Given the list of events is loaded
    When the user specifies the number of events
    Then the user should see a list of specified number of events