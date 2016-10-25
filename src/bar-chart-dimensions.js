/**
 * Dimensions will vary depending on the anchoring and type of bar layout
 * This class will return functions that attempts (and succeed) in getting the options based on type of data, layout and anchoring
 * @type {[type]}
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore','d3'] , factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'),require('d3'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._, root.d3);
    }
}(this, function (_, d3) {

'use:strict';

function barDimensions () {
  var dimensions = {

    /**
     * returns the width of the bar (could be breadth or length depending on dimension)
     * @return {function} - a function to get the width of a bar
     */
    getBarWidth: function () {
      if (this.isVertical()) {
        return this.getBarBreadth();
      }
      return this.getBarLength();
    },

    /**
     * returns the height of the bar (could be breadth or length depending on dimension)
     * @return {function} - a function to get the height of a bar
     */
    getBarHeight: function () {
      if (this.isVertical()) {
        return this.getBarLength();
      }
      return this.getBarBreadth();
    },

    /**
     * Returns a function to get the wideness of a bar
     * @return {function} - function to calculate the wideness of a bar
     */
    getBarBreadth: function () {
      var that = this
        , useGroupedData = (this.options.barLayout === this.BARLAYOUT_GROUPED)
        , value
      ;

      return function (d) {
        value = useGroupedData ? that.groupedordinalScale.rangeBand() : that.ordinalScale.rangeBand();
        return Math.max(value, 1);
      };
    },

    /**
     * Returns a function to get the length of a bar
     * @return {function} - function to calculate the length of a bar
     */
    getBarLength: function () {
      var that = this;

      return function(d) {
        return that.linearScale(d.values);
      };
    }
  };

  return dimensions;
}
return barDimensions();
}));
