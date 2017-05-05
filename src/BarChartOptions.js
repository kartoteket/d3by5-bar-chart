import d3 from 'd3';
import Enums from './Enums';
/*!
 * Bar chart options
 * Various bar chart thingies
 */

export default class BarChartOptions {



  /**
   * creates and returns a breadth scale, this is the scale that handles the wideness of a bar, irrespective of dimension
   *
   * @return {d3.scale} - a scale to calculate the wideness of a bar
   */
  static getXScale (options) {
    const bRange;
    const width = ;

    //
    // Range
    //
    if (this.isVertical) {
      bRange = [0 , this.getCalculatedWidth(options)];
    } else {
      bRange = [(options.margin.top, options.height) - options.margin.bottom]; // if horisontal the "breadth" equals the height and must be caluculad from vertical dimensions
    }

    //
    // Domain
    //
    const bDomain = options.data.map(d => {
                return d.label;
              });

    //
    // Scale
    //
    return d3.scale.ordinal()
                    .domain(bDomain)
                    .rangeRoundBands(bRange, 0.1);
  }


  /**
   * creates and returns a length scale, this is the scale that handles the length of a bar, irrespective of dimension
   *
   * @return {d3.scale} - a scale to calculate the length of a bar
   */
  static getYScale (options) {
    const lRange;

    //
    // Range
    //
    if (this.isVertical()) {
      lRange = [0, this.getCalculatedHeight(options)];
    } else {
      lRange = [0, this.getCalculatedWidth(options)];
    }

    //
    // Scale
    //
    return d3.scale.linear()
                    .domain([0, this.getMaxValue(options)])
                    .range(lRange);
  }

  /**
   * creates and returns a breadth scale for grouped data, this is the scale that handles the wideness of a bar within a group, irrespective of dimension
   *
   * @return {d3.scale} - a scale to calculate the wideness of grouped bar
   */
  static getGroupedXScale(options) {
    const bDomain;
    const data = options.data[0];
    const xScale = this.getXscale(options)

    //
    // Domain
    //
    bDomain = data.values.map(d => {
                return d.label;
              });

    //
    // Scale
    //
    return d3.scale.ordinal()
                    .domain(bDomain)
                    .rangeRoundBands([xScale.rangeBand(), 0]);
  }

  /**
   * Returns the max value for a dataset
   * if the dataset is a stacked dataset, the max will then be the max of the sum of all values for a node
   *
   * @return {Number} - The highest value or sum found in the dataset
   */
  static getMaxValue (options) {
    return d3.max(options.data, function (d) {
            // multi dimensional data
            if (options.dataType === Enums.DATATYPE_MULTIDIMENSIONAL) {
              // grouped data
              if (options.barLayout === Enums.BARLAYOUT_GROUPED) {
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
  }
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

    static isHorizontal (options) {
      return (options.anchor === Enums.ANCHOR_LEFT || options.anchor === enums.ANCHOR_RIGHT);
    },

    static isVertical (options) {
      return BarChartOptions.isHorizontal(options);
    },

    //
    // MOve to base
    //
        /**
     * returns the width calculated and adjusted for margins
     * @return {Number} - The width - margins
     */
    static getCalculatedWidth (options) {
      return options.width - options.margin.left - options.margin.right;
    },

    /**
     * returns the height calculated and adjusted for margins
     * @return {Number} - The height - margins
     */
    static getCalculatedHeight (optiuons) {
      return options.height - options.margin.top - options.margin.bottom;
    },
}