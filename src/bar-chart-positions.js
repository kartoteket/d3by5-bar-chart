/**
 * Positions can be tricky as the bars can be anchored from the top, bottom, left and right
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

function barPositions () {
  var positions = {

    /**
     * [getBarXPos description]
     * @return {[type]} [description]
     */
    getBarXPos: function () {
      if (this.isVertical()) {
        return this.getBreadthPos();
      }
      return this.getLengthPos();
    },


    /**
     * [getBarYPos description]
     * @return {[type]} [description]
     */
    getBarYPos: function () {
      if (this.isVertical()) {
        return  this.getLengthPos();
      }
      return this.getBreadthPos();
    },


    /**
     * Returns a function used to calculate the length of a bar
     * @return {function} - the length pos function
     */
    getBreadthPos: function () {
      var that = this
        , useGroupedData = (this.options.barLayout === this.BARLAYOUT_GROUPED);

      return function(d) {
        return useGroupedData ? that.groupedXScale(d.label) : 0 ;
      };
    },


    /**
     * Returns a function used to calculate the length of a bar
     * @return {function} - the length pos function
     */
    getLengthPos: function () {
      var that = this
        , useStackedData = (this.options.barLayout === this.BARLAYOUT_STACKED);

      return function(d) {
        var len;

        // stacked data needs to use cummulative sizes
        if (useStackedData) {
          if (that.options.anchor === that.ANCHOR_LEFT || that.options.anchor === that.ANCHOR_TOP ) {
            return that.yScale(d.lpos) - that.yScale(d.values);
          }
          return that.getCalculatedHeight() - that.yScale(d.lpos);
        }

        if (that.options.anchor === that.ANCHOR_TOP || that.options.anchor === that.ANCHOR_LEFT ) {
          return 0;
        }

        if (that.options.anchor === that.ANCHOR_RIGHT ) {
          return that.getCalculatedWidth() - that.yScale(d.values);
        }

        return that.getCalculatedHeight() - that.yScale(d.values);
      };
    }
  };
  return positions;
}
return barPositions();
}));