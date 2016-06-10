'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , barOptions = {}
;

module.exports = barOptions;

/**
 * Returns the x and y position of bars to be set in the attr section of the bar
 * @return {Object} - {x: (Number or function), y: {Number or function}}
 */
barOptions.getBarPositions = function () {
  var positions = {}
    , that = this
    , horizontalGrid  = this.options.width / this.options.data.length // width available to horizontal bars
    , verticalGrid    = this.options.height / this.options.data.length // width available to vertical bars
    , heightScale     = this.options.height / this.maxValue
    , widthScale      = this.options.width / this.maxValue
  ;


  //
  // y position
  //

  // anchor top
  if (this.options.anchor === this.ANCHOR_TOP) {
    positions.y = 0;
  }
  // anchor bottom
  else if (this.options.anchor === this.ANCHOR_BOTTOM) {
    positions.y = function (d) {
                    return that.options.height - (d.values * heightScale);
                  };
  }
  // horizontal position
  else {
    positions.y = function (d, i) {
                    return i * horizontalGrid;
                  };
  }

  //
  // x position
  //

  // anchor left
  if (this.options.anchor === this.ANCHOR_LEFT) {
    positions.x = 0;
  }
  // anchor right
  else if (this.options.anchor === this.ANCHOR_RIGHT) {
    positions.x = function (d) {
                    return that.options.width - (d.values * widthScale);
                  };
  }
  // vertical position
  else {
    positions.x = function (d, i) {
                    return i * verticalGrid;
                  };
  }

  return positions;
};

/**
 * Returns an object that represents the dimensions of the bar, depending if the bar is vertical or horizontal this will change.
 * the sizes are not dependent on the position of the anchor, only the vertival or horizontal
 * @return {Object} - {height: {Number or function}, width: (Number or function)}
 */
barOptions.getBarDimensions = function () {
  var dimensions
    , that = this
    , horizontalGrid  = this.options.width / this.options.data.length // width available to horizontal bars
    , verticalGrid    = this.options.height / this.options.data.length // width available to vertical bars
    , heightScale     = this.options.height / this.maxValue
    , widthScale      = this.options.width / this.maxValue
  ;

  // Horizontal
  if (this.options.anchor === this.ANCHOR_RIGHT || this.options.anchor === this.ANCHOR_LEFT) {
    dimensions = {
      height: verticalGrid - that.options.padding, // the height is the size of a single grid item (the space that the bar can take in its breadth)
      width: function (d) {
        return d.values * widthScale;
      }
    };
  }
  // Vertical
  else {
    dimensions = {
      height: function (d) {
        return (d.values * heightScale);
      },
      width: horizontalGrid  - that.options.padding // the height is the size of a single grid item (the space that the bar can take in its breadth)
    };
  }

  return dimensions;
};

/**
 * Returns the default options for all bars irrespective of their ANCHOR
 * @return {Object} - {class, fill ...}
 */
barOptions.getBarDefaultOptions = function () {
  var that = this;
  return {
          class: that.options.chartClass,
          fill: function (d, i) {
                                var _data = that.options.data[i];
                                if (_data && _data.color) {
                                  return _data.color;
                                }
                                return that.options.fillColor;
                              }
        };

};




