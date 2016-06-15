'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , barDimensions = {}
;
/**
 * Dimensions will vary depending on the anchoring and type of bar layout
 * This class will return functions that attempts (and succeed) in getting the options based on type of data, layout and anchoring
 * @type {[type]}
 */
module.exports = barDimensions;

/**
 * returns the width of the bar (could be breadth or length depending on dimension)
 * @return {function} - a function to get the width of a bar
 */
barDimensions.getBarWidth = function () {
  if (this.isVertical()) {
    return this.getBarBreadth();
  }
  return this.getBarLength();
};

/**
 * returns the height of the bar (could be breadth or length depending on dimension)
 * @return {function} - a function to get the height of a bar
 */
barDimensions.getBarHeight = function () {
  if (this.isVertical()) {
    return this.getBarLength();
  }
  return this.getBarBreadth();
};

/**
 * Returns a function to get the wideness of a bar
 * @return {function} - function to calculate the wideness of a bar
 */
barDimensions.getBarBreadth = function () {
  var that = this
    , useGroupedData = (this.options.barLayout === this.BARLAYOUT_GROUPED)
  ;

  return function (d) {
            return useGroupedData ? that.groupedBreadthScale.rangeBand() : that.breadthScale.rangeBand();
          };
};

/**
 * Returns a function to get the length of a bar
 * @return {function} - function to calculate the length of a bar
 */
barDimensions.getBarLength = function () {
  var that = this;

  return function(d) {
            return that.lengthScale(d.values);
          };
};