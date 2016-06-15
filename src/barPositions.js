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
module.exports = barPositions;


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
            return useGroupedData ? that.groupedBreadthScale(d.label) : 0 ;
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
                  return that.lengthScale(d.lpos) - that.lengthScale(d.values);
                }
                return that.getCalculatedHeight() - that.lengthScale(d.lpos);
              }

              if (that.options.anchor === that.ANCHOR_TOP || that.options.anchor === that.ANCHOR_LEFT ) {
                return 0;
              }

              return that.getCalculatedHeight() - that.lengthScale(d.values);
            };
};