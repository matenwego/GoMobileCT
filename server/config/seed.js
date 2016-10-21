'use strict';

var Location = require('../models/location');
var Event = require('../models/event');
var User = require('../models/user');

var moment = require('moment');

// removes all Locations and Events

// Location.remove({}, function() {
//   console.log('Locations removed.');
// });
//
// Event.remove({}, function() {
//   console.log('Events removed.');
// });


// Locations

var locations = [
  {name: 'Carolyn\'s Place',
    address: '137 Grandview Ave, Waterbury, CT 06708',
    latlng: {lat: 41.5019391, lng: -73.03706460000001},
    description: `Carolyn's Place Pregnancy Care Center is a ministry committed to empowering individuals, through education, comfort and assistance, to make life choices related to their sexuality and child-bearing, consistent with the sanctity of human life.`},
  {name: 'Putnam Library',
    address: '225 Kennedy Drive, Putnam, CT 06260',
    latlng: {lat: 41.90460119999999, lng: -71.86899169999998},
    description: `The Putnam Public Library serves the needs of the community by providing free access to a diversity of ideas, information and experiences with the goal of promoting the love of reading, the joy of lifelong learning and engagement with the arts, sciences and humanities.`},
];

// Adds locations and then an event for each location (for testing)
locations.forEach(function(location, index) {
  Location.find({'name': location.name}, function(err, locations) {
    if (!err && !locations.length) {
      Location.create(location, function(err, newLocation) {
        console.log('Location "%s" was created!', newLocation._id);
        Event.create({
          location: newLocation._id,
          startDateTime: moment(Date.now()).utc().toISOString(),
          endDateTime: moment(Date.now()).utc().add(2, 'hours').toISOString()
        }, function(err, newEvent) {
          if (err) {
            console.log(err);
          } else {
            console.log('New Event created');
          }
        });
      });
    }
  });
});

// Users

var users = [
  {
    email: 'cody.barr@gmail.com',
    password: '$2a$10$iSL/8Y0zvH9N6q9SSI0wSemQZilSl8rS3Oms13cYTdWSOGJe1JvJK', // 'password' with ten salt rounds?
    role: 'Admin'
  }
];

// Delete Users
// User.remove({}, function() {
//   console.log('Users removed!');
// });

users.forEach(function(user, index) {
  User.find({'email': user.email}, function(err, users) {
    if (!err && !users.length) {
      User.create(user, function(err, newUser) {
        console.log('User "%s" was created!', newUser.email);
      });
    }
  });
});