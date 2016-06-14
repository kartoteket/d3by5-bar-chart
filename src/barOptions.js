'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , barOptions = {}
;

module.exports = barOptions;

/**
 * returns a range to be used for the bars length property
 *
 * @return {Array} an array with the start and end points of the range
 */
barOptions.getLengthRange = function () {
  if (this.isVertical()) {
    return [0, this.getCalculatedHeight()];
  }
  return [0, this.getCalculatedWidth()];
};

/**
 * returns a range to be used for the bars breadth property
 *
 * @return {Array} an array with the start and end points of the range
 */
barOptions.getBreadthRange = function () {
  if (this.isVertical()) {
    return [0 , this.getCalculatedWidth()];
  }
  return [this.options.margin.left, this.options.width - this.options.margin.right];
};

barOptions.isHorizontal = function () {
  return (this.options.anchor === this.ANCHOR_LEFT || this.options.anchor === this.ANCHOR_RIGHT);
};

barOptions.isVertical = function () {
  return !this.isHorizontal();
};



