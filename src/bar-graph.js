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
        anchor: 'right',
        chartClass: 'chart-bar',
        labelPosition: 'none',
        idPrefix: 'bar-'
    },

    init: function (selection) {

      if (arguments.length) {
        this.selection = selection;
        this.draw();
      }
      return this;
    },

    draw: function () {
      var that = this;
      // global accessible max
      this.maxValue = d3.max(this.options.data, function (d) {
                        if (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) {
                          return d3.max(d.values, function (d2) {
                            return d2.values;
                          });
                        }
                        return d.values;
      });

      var lengthRange = this.getLengthRange()
        , breadthRange = this.getBreadthRange()
        , length
        , breadth
        , multiBreadth
        , _labelOptions
        , positions = {}
        , dimensions = {}
      ;

      length = d3.scale.linear()
                        .domain([0, this.maxValue])
                        .range(lengthRange);

      breadth = d3.scale.ordinal()
                        .domain(_.map(that.options.data, function (d) {
                          return d.label;
                        }))
                        .rangeRoundBands(breadthRange, 0.1);


      //
      // Add a sub category for multi-dimensional data
      //
      if (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) {
        multiBreadth = d3.scale.ordinal()
                              .domain(_.map(_.first(that.options.data).values, function (d) {
                                    return d.label;
                                  }))
                              .rangeRoundBands([breadth.rangeBand(), 0]);
      }



      //
      // Set the bar positions to x and y depending on their anchor and the datatype
      //
      if (this.isVertical()) {
        positions.x = function(d) {
                        return that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL ? multiBreadth(d.label) : 0;
                      };
        positions.y = function(d) {
                        return that.options.anchor === that.ANCHOR_TOP ? that.options.margin.top : that.getCalculatedHeight() - length(d.values);
                      };
      } else {
        positions.x = function(d) {
                        return that.options.anchor === that.ANCHOR_LEFT ? 0 : that.getCalculatedWidth() - length(d.values);
                      };
        positions.y = function(d) {
                        return that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL ? multiBreadth(d.label) : 0;
                      };
      }

      //
      // Set dimensions
      //
      if (this.isVertical()) {
        dimensions.width = function (d) {
                              return that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL ? multiBreadth.rangeBand() : breadth.rangeBand();
                            };
        dimensions.height = function(d) {
                              return length(d.values);
                            };
      } else {
        dimensions.width = function (d) {
                              return length(d.values);
                            };
        dimensions.height = function(d) {
                              return that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL ? multiBreadth.rangeBand() : breadth.rangeBand();
                            };
      }

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
             .data(that.options.data)
            .enter()
            .append('g')
            .attr('transform', function (d) {
              var _x = that.isVertical() ? breadth(d.label) : that.options.margin[that.options.anchor]
                , _y = that.isVertical() ? that.options.margin.top : breadth(d.label)
              ;
              return 'translate(' + _x + ',' + _y +')';
            });

        //
        // Supply additional data if multi dimensional
        //
        if (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) {
          bars.selectAll("rect")
            .data(function(d) {
              return d.values;
            })
          .enter().append("rect")
            .attr(dimensions)
            .attr(positions)
            .style("fill", function(d) {
              return d.color;
            });
        }
        //
        // Single dimension just sets the barse
        //
        else {
          bars.append("rect")
              .attr(dimensions)
              .attr(positions)
              .style("fill", function(d) {
                return d.color;
              });
        }

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
    label: function (value) {
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