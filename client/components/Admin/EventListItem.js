import React from 'react';
import { Link } from 'react-router';

export default class EventListItem extends React.Component {

  render() {
    const noWrap = {
      whiteSpace: 'nowrap'
    }
    const { index, event } = this.props;
    const dayOfWeek = event.dayOfWeek;
    const startTime = event.startTime;
    const endTime = event.endTime;

    return (
      <tr>
        <td>{index}</td>
        <td style={noWrap}>{event.location && event.location.name}</td>
        <td style={noWrap}>{dayOfWeek}</td>
        <td style={noWrap}>{startTime}</td>
        <td style={noWrap}>{endTime}</td>
        <td style={noWrap} class="event-actions">
          <Link to={'/admin/event/' + event._id} class="btn btn-raised btn-primary btn-xs">Edit</Link>
          &nbsp;
          <button class="btn btn-raised btn-danger btn-xs" onClick={::this._handleDelete}>Delete</button>
        </td>
      </tr>
    );
  }

  _handleDelete(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this event?')) {
      this.props.onDelete(this.props.event);
    }
  }
}
