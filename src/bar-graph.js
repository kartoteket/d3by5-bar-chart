'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , base = require('d3by5-base-chart')
;

module.exports = HorisontalBarGraph;

/**
 * The entrypoint
 * @return {[type]} [description]
 */
function HorisontalBarGraph () {

  var chart = {
    // enumish
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',


    options: {
        padding: 2
    },

    init: function (selection) {

      if (arguments.length) {
        this.draw(selection);
      }
      return this;
    },

    draw: function (selection) {
      var that = this;

      selection.each(function () {

        var data = _.map(that.options.data, function (d) {
              return d.values;
            });

        var barSpacing  = that.options.height / that.options.data.length;
        var barHeight   = barSpacing - that.options.padding;
        var maxValue    = d3.max(data);
        var widthScale  = that.options.width / maxValue;


        var dom = d3.select(this);
        var svg = dom.append('svg')
            .attr('class', 'chart barchart')
            .attr('height', that.options.height)
            .attr('width', that.options.width);

        var bars = svg.selectAll('rect.chart__bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'chart__bar')
            .attr('y', function (d, i) { return i * barSpacing;  })
            .attr('height', barHeight)
            .attr('x', 0)
            .attr('width', function (d) { return d * widthScale; })
            .attr('fill', function (d, i) {
              var data = that.options.data[i];
              if (data && data.color) {
                return data.color;
              }
              return that.options.fillColor;
            });
          });

    },

    /**
     * Sets the direction of the graph
     * @param  {String} value - the direction used, allowed values = this.HORIZONTAL | this.VERTICAL
     * @return {Mixed}        - the value or chart
     */
    direction: function (value) {
      if (!arguments.length) return this.options.directions;
      // wrong value supplied
      if (value !== this.HORIZONTAL && value !== this.VERTICAL) {
        console.error(value, 'is invalid. Only ', this.HORIZONTAL, ' or ', this.VERTICAL, 'allowed');
        return this;
      }
      this.options.directions = value;
      return this;
    }

  };

  chart = _.extend(chart, base);
  return (chart.init());

}