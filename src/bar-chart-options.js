/*!
 * Base charts
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'd3'] , factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('d3'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._, root.d3);
    }
}(this, function (_, d3) {

'use:strict';

/**
 * The entrypoint
 * @return {[type]} [description]
 */
function BarChartOptions () {


  var opt = {

    /**
     * creates and returns a breadth scale, this is the scale that handles the wideness of a bar, irrespective of dimension
     *
     * @return {d3.scale} - a scale to calculate the wideness of a bar
     */
    getXScale: function () {
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
    },


    /**
     * creates and returns a length scale, this is the scale that handles the length of a bar, irrespective of dimension
     *
     * @return {d3.scale} - a scale to calculate the length of a bar
     */
    getYScale: function () {
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
    },

    /**
     * creates and returns a breadth scale for grouped data, this is the scale that handles the wideness of a bar within a group, irrespective of dimension
     *
     * @return {d3.scale} - a scale to calculate the wideness of grouped bar
     */
    getGroupedXScale: function () {
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
                      .rangeRoundBands([this.xScale.rangeBand(), 0]);
    },


    /**
     * Returns the max value for a dataset
     * if the dataset is a stacked dataset, the max will then be the max of the sum of all values for a node
     *
     * @return {Number} - The highest value or sum found in the dataset
     */
    getMaxValue: function () {
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
    },
    /**
     * returns a range to be used for the bars length property
     *
     * @return {Array} an array with the start and end points of the range
     */
    // getLengthRange = function () {
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
    // getBreadthRange = function () {
    //   if (this.isVertical()) {
    //     return [0 , this.getCalculatedWidth()];
    //   }
    //   return [this.options.margin.left, this.options.width - this.options.margin.right];
    // };

    isHorizontal: function () {
      return (this.options.anchor === this.ANCHOR_LEFT || this.options.anchor === this.ANCHOR_RIGHT);
    },

    isVertical: function () {
      return !this.isHorizontal();
    },

  };

  return opt;
}
return BarChartOptions();
}));

