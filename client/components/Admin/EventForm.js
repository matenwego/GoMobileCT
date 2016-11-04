import React from 'react';
import moment from 'moment';

export default class EventForm extends React.Component {

  constructor() {
    super();

    this.state = {
      locations: []
    }
  }

  componentWillMount() {
    this._fetchLocations();
  }

  componentDidUpdate() {
    $('.datepicker').datepicker({
      orientation: 'bottom auto',
      autoclose: true,
      todayBtn: true,
      todayHighlight: true,

    });

    $('.timepicker').timepicker({
      timeFormat: 'h:i A'
    });

    this._setInitialValues();
  }

  // Fetch Location Names and Ids
  _fetchLocations() {
    $.ajax({
      async: true,
      method: 'GET',
      url: '/api/locations/names',
      success: (data) => {
        this.setState( { locations: data.locations });
      }
    });
  }

  _getLocations() {
    return this.state.locations.map((location, index) => {
      return (
        <option key={location._id} value={location._id}>{location.name}</option>
      )
    });
  }

  _setInitialValues() {
    const { event } = this.props;
    // const dateFormat='YYYY-MM-DD\Thh\:mm';
    const dateFormat='MM/DD/YYYY';
    const timeFormat='hh:mm A'

    this._location.value = event.location._id;
    this._startDate.value = moment(event.startDateTime).format(dateFormat);
    this._startTime.value = moment(event.startDateTime).format(timeFormat);
    $('#startDate').datepicker('setDate', moment(event.startDateTime).format(dateFormat));

    this._endDate.value = moment(event.endDateTime).format(dateFormat);
    this._endTime.value = moment(event.endDateTime).format(timeFormat);
    $('#endDate').datepicker('setDate', moment(event.endDateTime).format(dateFormat));

    // this._startDate.value = moment(event.startDateTime).format(dateFormat);
    // this._endDate.value = moment(event.endDateTime).format(dateFormat);
  }

  _getErrors() {
    let errors = [];
    // var order = ["location", "startDateTime", "endDateTime"];

    if (this.state.errors) {
      errors = this.state.errors.map( (error, index) => {
        return (
          <li key={index}>{error}</li>
        );
      });

      return (
        <div class="alert alert-danger col-sm-10 col-sm-offset-2">
          <ul>{errors}</ul>
        </div>
      );
    } else {
      return null;
    }

    // if (this.props.errors) {
    //   console.log('Errors', this.props.errors);
    //   console.log('Object.keys', Object.keys(this.props.errors));
    //   errors = Object.keys(this.props.errors).sort( (a, b) => {
    //     return order.indexOf(a) - order.indexOf(b);
    //   }).map( (error) => {
    //     return (<li key={error}>{this.props.errors[error].message}</li>);
    //   });
    //
    //
    // } else {
    //   return null;
    // }
  }

  render() {
    const { title } = this.props;
    const locations = this._getLocations();
    const errors = this._getErrors();

    return (
      <div class="eventForm">
        <h2>{title} Event</h2>

        {errors}

        <form class="form-horizontal" onSubmit={::this._handleSubmit}>
          <div class="form-group">
            <label for="locationInput" class="col-sm-2 control-label">Location</label>
            <div class="col-sm-6">
              <select class="form-control" id="locationInput" ref={(location) => this._location = location}>
                <option value=""> - None - </option>
                {locations}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-2 control-label">Start Date / Time:</label>
            <div class="col-sm-5">
              <input type="text" class="form-control datepicker" id="startDate" ref={(startDate) => this._startDate = startDate}/>
            </div>
            <div class="col-sm-5">
              <input type="text" class="form-control timepicker" id="startTime" ref={(startTime) => this._startTime = startTime}/>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-2 control-label">End Date / Time:</label>
            <div class="col-sm-5">
              <input type="text" class="form-control datepicker" id="endDate" ref={(endDate) => this._endDate = endDate}/>
            </div>
            <div class="col-sm-5">
              <input type="text" class="form-control timepicker" id="endTime" ref={(endTime) => this._endTime = endTime}/>
            </div>
          </div>

          <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
              <button type="submit" class="btn btn-primary">{title} Event</button>
            </div>
          </div>

        </form>
      </div>
    );
  }

  _handleSubmit(event) {
    event.preventDefault();
    let error = false;
    let errors = [];

    const dateTimeFormat = 'MM/DD/YYYY hh:mm A';

    let startDate = moment(this._startDate.value + ' ' + this._startTime.value, dateTimeFormat);
    // if (!startDate.isValid()) startDate = '';

    let endDate = moment(this._endDate.value + ' ' + this._endTime.value, dateTimeFormat);
    // if (!endDate.isValid()) endDate = '';

    console.log('location', this._location.value);


    // TODO: Currently error handling for events is all client side
    // I wasn't able to figure out how to handle exception errors for ObjectId
    // and ISODate fields, if you pass an empty string as a date to your model,
    // it'll only return a single Object with a CastError...
    if (this._location.value === '') {
      errors.push('Please select a location');
      error = true;
    }

    if (!startDate.isValid()) {
      errors.push('Start Date / Time is Invalid');
      error = true;
    }

    if (!endDate.isValid()) {
      errors.push('End Date / Time is Invalid');
      error = true;
    }

    let newEvent = {
      location: this._location.value,
      startDateTime: startDate.isValid() ? startDate.utc().format() : '',
      endDateTime: endDate.isValid() ? endDate.utc().format() : ''
    };

    if (error) {
      // TODO: Need to have the view render the new event here, currently it's still pulling from props
      this.setState({ errors: errors, event: newEvent });
    } else {
      this.props.submitMethod(newEvent);
    }

  }
}