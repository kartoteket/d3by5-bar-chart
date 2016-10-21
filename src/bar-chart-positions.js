'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , barPositions = {}
;
/**
 * Positions can be tricky as the bars can be anchored from the top, bottom, left and right
 * This class will return functions that attempts (and succeed) in getting the options based on type of data, layout and anchoring
 * @type {[type]}
 */
// define d3by5-base-chart for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = barPositions;

// define d3by5_PieChart as an AMD module
} else if (typeof define === 'function' && define.amd) {

  define(barPositions);

// define the base in a global namespace d3By5
}


barPositions.getBarXPos = function () {
  if (this.isVertical()) {
    return this.getBreadthPos();
  }
  return this.getLengthPos();
};



barPositions.getBarYPos = function () {
  if (this.isVertical()) {
    return  this.getLengthPos();
  }
  return this.getBreadthPos();
};

/**
 * Returns a function used to calculate the length of a bar
 * @return {function} - the length pos function
 */
barPositions.getBreadthPos = function () {
  var that = this
    , useGroupedData = (this.options.barLayout === this.BARLAYOUT_GROUPED);

  return function(d) {
            return useGroupedData ? that.groupedordinalScale(d.label) : 0 ;
          };
};


/**
 * Returns a function used to calculate the length of a bar
 * @return {function} - the length pos function
 */
barPositions.getLengthPos = function () {
  var that = this
    , useStackedData = (this.options.barLayout === this.BARLAYOUT_STACKED);

  return function(d) {
              var len;

              // stacked data needs to use cummulative sizes
              if (useStackedData) {
                if (that.options.anchor === that.ANCHOR_LEFT || that.options.anchor === that.ANCHOR_TOP ) {
                  return that.linearScale(d.lpos) - that.linearScale(d.values);
                }
                return that.getCalculatedHeight() - that.linearScale(d.lpos);
              }

              if (that.options.anchor === that.ANCHOR_TOP || that.options.anchor === that.ANCHOR_LEFT ) {
                return 0;
              }

              if (that.options.anchor === that.ANCHOR_RIGHT ) {
                return that.getCalculatedWidth() - that.linearScale(d.values);
              }

              return that.getCalculatedHeight() - that.linearScale(d.values);
            };
};