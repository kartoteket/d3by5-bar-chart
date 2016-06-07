'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , vertical = {}
;

module.exports = vertical;

vertical.verticalOptions = function () {
	var that = this
    , barSpacing  = that.options.width / that.options.data.length
    , barWidth    = barSpacing - that.options.padding
    , maxValue    = d3.max(this.options.data, function (d) {
                      return d.values;
                    })
    , heightScale = that.options.height / maxValue
    , baroptions
  ;

  baroptions = {
      'class': this.options.chartClass,
      x: function (d, i) {
        return i * barSpacing;
      },
      width: barWidth,
      y: 0,
      height: function (d) {
        return (d.values * heightScale);
      }
    };

  if (this.options.anchor === this.ANCHOR_BOTTOM) {
    baroptions.y = function (d) {
        return that.options.height - (d.values * heightScale);
      };
  }

  return baroptions;





};