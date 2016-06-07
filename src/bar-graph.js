'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , base = require('d3by5-base-chart')
  , horizontal = require('./horizontal-graph')
  , vertical = require('./vertical-graph')
;

module.exports = BarGraph;

/**
 * The entrypoint
 * @return {[type]} [description]
 */
function BarGraph () {

  var chart = {
    // enumish
    ANCHOR_LEFT: 'left',
    ANCHOR_RIGHT: 'right',
    ANCHOR_BOTTOM: 'bottom',
    ANCHOR_TOP: 'top',

    options: {
        padding: 2,
        direction: 'left',
        chartClass: 'chart-bar',
    },

    init: function (selection) {

      if (arguments.length) {
        this.selection = selection;
        this.draw();
      }
      return this;
    },

    draw: function () {
      var that = this
        , graphOptions
        // , data
      ;

      // define the anchoring of the graph
      if (this.options.anchor === this.ANCHOR_LEFT || this.options.anchor === this.ANCHOR_RIGHT) {
        graphOptions = this.horizontalOptions();
      }

      else if (this.options.anchor === this.ANCHOR_BOTTOM || this.options.anchor === this.ANCHOR_TOP) {
        graphOptions = this.verticalOptions();
      }

      // merge graphOptions with the default options
      // fill is not dependednt on direction
      graphOptions.fill = function (d, i) {
                            var _data = that.options.data[i];
                            if (_data && _data.color) {
                              return _data.color;
                            }
                            return that.options.fillColor;
                          };



      this.selection.each(function() {

        var dom = d3.select(this);

        // remove old
        if (dom.select('svg')) {
          dom.select('svg').remove();
        }

        var svg = dom.append('svg')
            .attr('class', 'chart barchart')
            .attr('height', that.options.height)
            .attr('width', that.options.width);

        var bars = svg.selectAll('rect.chart__bar')
            .data(data)
            .enter()
            .append('rect')
            .attr(graphOptions);

      });

      // sets a method to allow redrawing
      this.onAnchorChange = function () {
        this.draw();
      };
    },

    /**
     * Sets the direction of the graph
     * @param  {String} value - the direction used, allowed values = ANCHOR_LEFT | ANCHOR_RIGHT | ANCHOR_BOTTOM | ANCHOR_TOP
     * @return {Mixed}        - the value or chart
     */
    anchor: function (value) {
      if (!arguments.length) return this.options.anchor;

      value = String(value).toLowerCase();
      // wrong value supplied
      if (value !== this.ANCHOR_LEFT &&
          value !== this.ANCHOR_RIGHT &&
          value !== this.ANCHOR_TOP &&
          value !== this.ANCHOR_BOTTOM) {
        console.error(value, 'is invalid. Only ', this.ANCHOR_LEFT, ', ', this.ANCHOR_RIGHT, ', ', this.ANCHOR_TOP, ' or ', this.ANCHOR_BOTTOM, 'allowed');
        return this;
      }
      this.options.anchor = value;

      // redraw if the graph has been loaded
      if (typeof this.onAnchorChange === 'function') {
        this.draw();
      }

      return this;
    },

  };

  chart = _.extend(chart, vertical);
  chart = _.extend(chart, horizontal);
  chart = _.extend(chart, base);
  return (chart.init());

}