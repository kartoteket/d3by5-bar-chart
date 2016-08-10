'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , barOptions = {}
;

module.exports = barOptions;


/**
 * creates and returns a breadth scale, this is the scale that handles the wideness of a bar, irrespective of dimension
 *
 * @return {d3.scale} - a scale to calculate the wideness of a bar
 */
barOptions.getBreadthScale = function () {
  var bRange
    , bDomain
  ;

  //
  // Range
  //
  if (this.isVertical()) {
    bRange = [0 , this.getCalculatedWidth()];
  } else {
    // bRange = [this.options.margin.left, this.options.width - this.options.margin.right];
    bRange = [this.options.margin.top, this.options.height - this.options.margin.bottom]; // if horisontal the "breadth" equals the height and must be caluculad from vertical dimensions
  }

  //
  // Domain
  //
  bDomain = _.map(this.options.data, function (d) {
              return d.label;
            });

  //
  // Scale
  //
  return d3.scale.ordinal()
                  .domain(bDomain)
                  .rangeRoundBands(bRange, 0.1);
};


/**
 * creates and returns a length scale, this is the scale that handles the length of a bar, irrespective of dimension
 *
 * @return {d3.scale} - a scale to calculate the length of a bar
 */
barOptions.getLengthScale = function () {
  var lRange;

  //
  // Range
  //
  if (this.isVertical()) {
    lRange = [0, this.getCalculatedHeight()];
  } else {
    lRange = [0, this.getCalculatedWidth()];
  }

  //
  // Scale
  //
  return d3.scale.linear()
                  .domain([0, this.maxValue])
                  .range(lRange);
};

/**
 * creates and returns a breadth scale for grouped data, this is the scale that handles the wideness of a bar within a group, irrespective of dimension
 *
 * @return {d3.scale} - a scale to calculate the wideness of grouped bar
 */
barOptions.getGroupedBreadthScale = function () {
  var bDomain;

  //
  // Domain
  //
  bDomain = _.map(_.first(this.options.data).values, function (d) {
              return d.label;
            });

  //
  // Scale
  //
  return d3.scale.ordinal()
                  .domain(bDomain)
                  .rangeRoundBands([this.breadthScale.rangeBand(), 0]);
};


/**
 * Returns the max value for a dataset
 * if the dataset is a stacked dataset, the max will then be the max of the sum of all values for a node
 *
 * @return {Number} - The highest value or sum found in the dataset
 */
barOptions.getMaxValue = function () {
  var that = this;

  return d3.max(this.options.data, function (d) {
          // multi dimensional data
          if (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) {
            // grouped data
            if (that.options.barLayout === that.BARLAYOUT_GROUPED) {
              return d3.max(d.values, function (d2) {
                return d2.values;
              });
            }
            // stacked data
            else {
              return d3.sum(d.values, function (d2) {
                return d2.values;
              });
            }
          }
          // uni dimensional data
          return d.values;
      });
};
/**
 * returns a range to be used for the bars length property
 *
 * @return {Array} an array with the start and end points of the range
 */
// barOptions.getLengthRange = function () {
//   if (this.isVertical()) {
//     return [0, this.getCalculatedHeight()];
//   }
//   return [0, this.getCalculatedWidth()];
// };

/**
 * returns a range to be used for the bars breadth property
 *
 * @return {Array} an array with the start and end points of the range
 */
// barOptions.getBreadthRange = function () {
//   if (this.isVertical()) {
//     return [0 , this.getCalculatedWidth()];
//   }
//   return [this.options.margin.left, this.options.width - this.options.margin.right];
// };

barOptions.isHorizontal = function () {
  return (this.options.anchor === this.ANCHOR_LEFT || this.options.anchor === this.ANCHOR_RIGHT);
};

barOptions.isVertical = function () {
  return !this.isHorizontal();
};



