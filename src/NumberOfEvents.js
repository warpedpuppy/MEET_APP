import React, { Component } from "react";
import { ErrorAlert } from './Alert';

class NumberOfEvents extends Component {

  state = {
    numberofevents: 32,
    errorText: ''
  }

  changeEventNumber = (event) => {
    if(event.target.value >= 1 && event.target.value <= 32) {
    this.setState({
      numberofevents: event.target.value,
      errorText: ''
    });
    } else {
      return this.setState({
        numberofevents: null,
        errorText: 'Please select a number from 1 to 32'
      });
    }
    this.props.updateEvents(null, event.target.value);
  };

  render() {
    return (
      <div className="no-of-events">
        <input type="text" className="numberOfEvents"
        value={this.state.numberofevents}
        onChange={this.changeEventNumber}
        ></input>
        <ErrorAlert text={this.state.errorText} />
      </div>
    )
  }

}

export default NumberOfEvents;