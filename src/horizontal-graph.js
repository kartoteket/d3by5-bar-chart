'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , horizontal = {}
;

module.exports = horizontal;

horizontal.horizontalOptions = function () {
	var that = this
    , baroptions = {}
    , barSpacing  = that.options.height / that.options.data.length
    , barHeight   = barSpacing - that.options.padding
    , maxValue    = d3.max(this.options.data, function (d) {
                      return d.values;
                    })
    , widthScale  = that.options.width / maxValue;

    baroptions = {
      class: this.options.chartClass,
      y: function (d, i) { return i * barSpacing; },
      height: barHeight,
      x: 0,
      width: function (d) {
        return d.values * widthScale;
      }
    };

    if (this.options.anchor === this.ANCHOR_RIGHT) {
      baroptions.x = function (d) {
        return that.options.width - (d.values * widthScale);
      };
    }

    return baroptions;
};