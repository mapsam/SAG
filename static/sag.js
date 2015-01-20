'use strict';
window.App = window.App || {};

/*
**
**  constructor
**
*/
var sag = function(options) {
  // build scope level paramaters
  this.keys = {
    tiles:       'svmatthews.hf8pfph5',
    js:          'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA',
    geocode:     'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJGdjROaW1nIn0.y3CbgMHEkOCvC6EO6_9WqQ',
    spreadsheet: '15Lxw2fdET9708nKYwYdVZK1RsyjXC8OlfBAJEZCqpMU'
  }
  this.spreadsheet; // reserved for tabletop object
  this.dataLength = 0;
  this.counter = 0;
  this.query = '';
  this.empty; // reserved for addresses that are empty or have zero responses after geocoding
  console.log('[ CONSTRUCTOR ]', this);

  // initiate map
  console.log(this.keys.js);
  this.map.init(this.keys.js, this.keys.tiles);

  // get the spreadsheet
  this.getSpreadsheet();
}

/*
**
**  gets spreadsheet information with tabletop.js
**
*/
sag.prototype.getSpreadsheet = function() {
  Tabletop.init({
    key: this.keys.spreadsheet,
    callback: this.buildQuery.bind(this),
    simpleSheet: true
  });
}

/*
**
**  builds the query for batch geocode call
**
*/
sag.prototype.buildQuery = function(data) {
  console.log('[ SPREADSHEET RESPONSE SUCCESSFUL ]', data);
  this.query = data[1].address;
  for (var i = 1; i < data.length; i++) {
    if (data[i].address.length > 0) this.query += ';' + data[i].address;
  }
  this.map.geocode(this.query, this.keys.geocode);
};

/*
**
**  map object containing all geo functions & initializations
**
*/
sag.prototype.map = {
  
  /*
  **
  **  initiates the map object with the tileset
  **
  */
  init: function (js, tiles) {
    L.mapbox.accessToken = js;
    sag.map = L.mapbox.map('map', tiles).setView([37.7833, -122.4167]);
    console.log( '[ MAP INITIATED ]', sag.map);
  },

  /*
  **
  **  batch geocode via http://api.tiles.mapbox.com/v4/geocode
  **  allows up to 50 queries per call
  **
  */
  geocode: function (query, token) {
    console.log('[ QUERY CONCAT SUCCESSFULL ]', query);
    $.ajax({
      url:'http://api.tiles.mapbox.com/v4/geocode/mapbox.places-permanent/' + query + '.json?access_token=' + token + '&callback=jsonloaded',
      async: true,
      dataType: 'json',
      success: this.addPoints,
      error: function(e) {
        console.error(e);
      }
    });
  },

  /*
  **
  **  add points to sag.map
  **
  */
  addPoints: function (res) {
    console.log( '[ GEOCODING SUCCESSFUL ]', res);
    var addressPoints = L.mapbox.featureLayer();
    for (var a = 0; a < res.length; a++) {
      var address = {
        lng: res[a].features[0].geometry.coordinates[0],
        lat: res[a].features[0].geometry.coordinates[1],
        query: '' // build function to concat query into string for matching against spreadsheet info
      };
      L.marker([address.lat, address.lng]).addTo(addressPoints);
    }
    addressPoints.addTo(sag.map);
    sag.map.fitBounds(addressPoints.getBounds());
    console.log( '[ POINTS ADDED ]', addressPoints);
  }

}