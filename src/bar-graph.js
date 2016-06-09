'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , base = require('d3by5-base-chart')
  , barOptions = require('./barOptions')
  , labelOptions = require('./labelOptions')
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

    LABEL_INSIDE: 'inside',
    LABEL_OUTSIDE: 'outside',
    LABEL_FIT: 'fit',
    LABEL_NONE: 'none',

    options: {
        padding: 2,
        direction: 'left',
        chartClass: 'chart-bar',
        labelPosition: 'fit'
    },

    init: function (selection) {

      if (arguments.length) {
        this.selection = selection;
        this.draw();
      }
      return this;
    },

    draw: function () {

      // global accessible max
      this.maxValue = d3.max(this.options.data, function (d) {
                        return d.values;
                      });

      var that = this
        , _barPositions = this.getBarPositions()
        , _barDimensions = this.getBarDimensions()
        , _barDefaultOptions = this.getBarDefaultOptions()
        , _labelOptions
      ;




      this.selection.each(function() {

        var dom = d3.select(this);

        // remove old
        if (that.svg) {
          that.svg.remove();
        }

        //
        // The main svg element
        //
        that.svg = dom.append('svg')
            .attr('class', 'chart barchart')
            .attr('height', that.options.height)
            .attr('width', that.options.width);

        // The actual bars
        var bars = that.svg.selectAll('rect.chart__bar')
            .data(data)
            .enter()
            .append('rect')
            .attr(_.extend(_barPositions, _barDimensions, _barDefaultOptions))
            .attr('id', function (d) {
              return d.id;
            });


        // Draw labels if required
        if (that.options.labelPosition !== that.LABEL_NONE) {
          that.drawLabels();
        }
      });







        //                   
        //                   
    // getLabelOptions: function () {

    // },







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

    /**
     * Turns the labels on and off by fixin them
     * @param  {String} value - the position of labels or null (this.LABEL_INSIDE| this.LABEL_OUTSIDE | this.LABEL_FIT | this.LABEL_NONE)
     *                          labels will be positioned separately on the 
     * @return {Mixed}        - the value or chart
     */
    label: function () {
      if (!arguments.length) return this.options.labelPosition;

      value = String(value).toLowerCase();
      // wrong value supplied
      if (value !== this.LABEL_INSIDE &&
          value !== this.LABEL_OUTSIDE &&
          value !== this.LABEL_FIT  &&
          value !== this.LABEL_NONE) {
        console.error(value, 'is invalid. Only ', this.LABEL_INSIDE, ', ', this.LABEL_OUTSIDE, ', ', this.LABEL_FIT, ' or ', this.LABEL_NONE, 'allowed');
      }
      this.options.labelPosition = value;

      // redraw if the graph has been loaded
      if (typeof this.onLabelChange === 'function') {
        this.onLabelChange();
      }
      return this;
    }
  };

  chart = _.extend(chart, barOptions);
  chart = _.extend(chart, labelOptions);
  chart = _.extend(chart, base);
  return (chart.init());

}