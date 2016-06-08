'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , base = require('d3by5-base-chart')
  , barOptions = require('./barOptions')
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
        labelPosition: 'none'
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
        , barPositions = this.getBarPositions()
        , barDimensions = this.getBarDimensions()
        , barDefaultOptions = this.getBarDefaultOptions()
      ;




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
            .attr(_.extend(barPositions, barDimensions, barDefaultOptions));
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
        this.onAnchorChange();
      }

      return this;
    },

  };

  chart = _.extend(chart, barOptions);
  chart = _.extend(chart, base);
  return (chart.init());

}