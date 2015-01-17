'use strict';
window.App = window.App || {};

/*
**
**  constructor
**
*/
var sagController = function(options) {
  // build scope level paramaters
  this.key = '15Lxw2fdET9708nKYwYdVZK1RsyjXC8OlfBAJEZCqpMU';
  this.spreadsheet;
  this.dataLength = 0;
  this.counter = 0;
  this.query = '';
  this.empty;
  console.log('[ CONSTRUCTOR ]', this);

  // get the spreadsheet
  this.getSpreadsheet();
}

/*
**
**  gets spreadsheet information with tabletop.js
**
*/
sagController.prototype.getSpreadsheet = function() {
  Tabletop.init({
    key: this.key,
    callback: this.buildQuery.bind(this),
    simpleSheet: true
  });
}

/*
**
**  builds the query for batch geocode call
**
*/
sagController.prototype.buildQuery = function(data) {
  console.log('[ SPREADSHEET RESPONSE SUCCESSFUL ]', data);
  this.query = data[1].address;
  for (var i = 1; i < data.length; i++) {
    if (data[i].address.length > 0) this.query += ';' + data[i].address;
  }
  this.geocode(this.query);
};

/*
**
**  batch geocode via http://api.tiles.mapbox.com/v4/geocode
**  allows up to 50 queries per call
**
*/
sagController.prototype.geocode = function(query) {
  console.log('[ QUERY CONCAT SUCCESSFULL ]', query);
  $.ajax({
    url:'http://api.tiles.mapbox.com/v4/geocode/mapbox.places-permanent/' + query + '.json?access_token=pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJGdjROaW1nIn0.y3CbgMHEkOCvC6EO6_9WqQ&callback=jsonloaded',
    async: true,
    dataType: 'json',
    success: this.map.bind(this),
    error: function(e) {
      console.error(e);
    }
  });
}

/*
**
**  create map with geocoded addresses
**
*/
sagController.prototype.map = function(res) {
  console.log( '[ GEOCODING SUCCESSFUL ]', res);
};