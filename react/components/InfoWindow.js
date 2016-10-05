import React from 'react';
import moment from 'moment';

export default class InfoWindow extends React.Component {

  constructor() {
    super();
  }

  _getEvents() {
    let events;
    if (this.props.events) {
      return this.props.events.map( (event, index) => {
        return (
          <li key={event._id}>
            {moment(event.startDateTime).format('MMMM D, YYYY h:mm a')} - {moment(event.endDateTime).format('h:mm a')}
          </li>
        );
      });
    }
  }

  render() {
    const { name, address, description } = this.props.info;
    const events = this._getEvents();

    let addressName;
    if (address) {
      addressName = <p><strong>Address:</strong> {address}</p>;
    } else {
      addressName = <p>Please select a location</p>
    }

    return (
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">{name || 'No Location Selected'}</h3>
        </div>
        <div class="panel-body">
          {addressName}
          <p>{description}</p>
        </div>
        <ul>
          {events}
        </ul>
      </div>
    );
  }
}
