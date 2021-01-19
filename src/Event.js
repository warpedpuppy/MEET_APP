import React, { Component } from "react";

class Event extends Component {
  state = {
    toggleDetails: false,
  }

  hideDetails = () => {
    if(!this.state.toggleDetails) {
      this.setState({
        toggleDetails: true,
      })
    }
    else {
      this.setState({
        toggleDetails: false,
      })
    }
  }

  render() {
    const { event } = this.props;
    const { toggleDetails } = this.state;

    if(!toggleDetails) {
      return (<div className="event">
        <p className="summary">{event.summary}</p>
        {/* <p className="description">{event.description}</p> */}
        <p className="start-time">{event.start.dateTime}</p>
        <p className="location">{event.location}</p>
        <button className="hide-details" onClick={() => this.hideDetails()}>
          Show Details
        </button>
      </div>
      )
    }
    else{
      return(
        <div className="event">
          <p className="summary">{event.summary}</p>
          <p className="description">{event.description}</p>
          <p className="start-time">{event.start.dateTime}</p>
          <p className="location">{event.location}</p>
          <a href={event.htmlLink} className="event-detail-link" target="_blank" rel="noreferrer">
            See event on Google Calendar <br></br>
          </a>
          
          <button className="hide-details" onClick={() => this.hideDetails()}>
            Hide Details
          </button>
        </div>
      )
    }
    
  }
}
export default Event;