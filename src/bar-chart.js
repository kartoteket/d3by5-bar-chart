/*!
 * Bar chart
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore',
                'd3',
                './bar-chart-options',
                './bar-chart-label-options',
                './bar-chart-positions',
                './bar-chart-dimensions',
                './bar-chart-axis',
                './base-chart'] , factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.

        module.exports = factory( require('underscore'),
                                  require('d3'),
                                  require('./bar-chart-positions'),
                                  require('./bar-chart-label-options'),
                                  require('./bar-chart-positions'),
                                  require('./bar-chart-dimensions'),
                                  require('./base-chart'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._, root.d3, root.barChartPositions, root.barChartLabelOptions, root.barChartPositions, root.barChartDimensions, root.baseChart);
    }
}(this, function (_, d3, barOptions, labelOptions, barPositions, barDimensions, barAxis, base) {

'use:strict';


/**
 * The entrypoint
 * @return {[type]} [description]
 */
function BarChart () {

  var chart = {
    // enumish
    ANCHOR_LEFT: 'left',
    ANCHOR_RIGHT: 'right',
    ANCHOR_BOTTOM: 'bottom',
    ANCHOR_TOP: 'top',

    BARLAYOUT_STACKED: 'stacked',
    BARLAYOUT_GROUPED: 'grouped',

    LABEL_INSIDE: 'inside',
    LABEL_OUTSIDE: 'outside',
    LABEL_FIT: 'fit',         // TODO: Not in use ??!?
    LABEL_NONE: 'none',

    options: {
        padding: 2,
        anchor: 'right',
        chartClass: 'chart-bar',
        labelPosition: 'none',
        labelAlign: 'left',
        labelColor: '#000',
        labelFormat: null,
        valuesPosition: 'fit',
        valuesAlign: 'left',
        valuesColor: '#000',
        // valuesFormat: null,
        idPrefix: 'bar-',
        barLayout: 'grouped',
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
        , positions = {}
        , dimensions = {}
        // , axis = {}
        // , axisopt = this.options.axis // shorthand for axis options
      ;
      // force a value for the dataType if there is a multi dimensional dataset
      this.options.barLayout = (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) ? this.options.barLayout || this.BARLAYOUT_GROUPED : null;

      this.maxValue = this.getMaxValue();
      this.ordinalScale = this.getOrdinalScale();
      this.linearScale = this.getLinearScale();

      //
      // Create a grouped breadth scale and update the dataset
      //
      if (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) {
        this.groupedordinalScale = this.getGroupedordinalScale();

        if (that.options.barLayout === this.BARLAYOUT_STACKED) {
          var lpos;
          _.each(that.options.data, function (data) {
            lpos = 0;
            data.values = _.map(data.values, function (d) {
                            lpos +=  d.values;
                            d.lpos = lpos;
                            return d;
                          });
          });
        }
      }


      positions.x = this.getBarXPos();
      positions.y = this.getBarYPos();
      dimensions.width = this.getBarWidth();
      dimensions.height = this.getBarHeight();



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
                        .attr("id", function(d){return d.id;})
                        .attr('transform', function (d) {
                          var _x = that.options.margin.left + (that.isVertical() ? that.ordinalScale(d.label) : 0)
                            , _y = that.isVertical() ? that.options.margin.top : that.ordinalScale(d.label)
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
          .enter()
            .append('g')
            .attr('class', 'barItem')
            .append("rect")
            .attr(dimensions)
            .attr(positions)
            .style("fill", function(d) {
              return that.options.fillColor(d.label);
            });
        }
        //
        // Single dimension just sets the bars
        //
        else {
          bars.append("rect")
              .attr(dimensions)
              .attr(positions)
              .style("fill", function(d) {
                return that.options.fillColor(d.label);
              });
        }

        // Draw labels if required
        if (that.options.labelPosition !== that.LABEL_NONE || that.options.valuesPosition !== 'none') {
          that.drawLabels();
        }

        that.drawAxis();


      });


    this.svg.selectAll(".axis text")
          .attr('fill', '#777')
          .style('font-size', '0.875rem');

    this.svg.selectAll('.axis line, .axis path')
          .attr('fill', 'none')
          .attr('stroke', '#777')
          .attr('stroke-width', '1');
    },

    /**
     * Sets the layout of the chart
     * @param  {String} value - the type of layout to use allowed values = BARLAYOUT_GROUPED | BARLAYOUT_STACKED
     * @return {Mixed}        - the value or chart
     */
    barLayout: function (value) {
      if (!arguments.length) return this.options.barLayout;

      value = String(value).toLowerCase();
      // wrong value supplied
      if (value !== this.BARLAYOUT_GROUPED &&
          value !== this.BARLAYOUT_STACKED) {
        console.error(value, 'is invalid. Only ', this.BARLAYOUT_STACKED, ' OR ', this.BARLAYOUT_GROUPED, ' allowed');
        return this;
      }
      this.options.barLayout = value;

      return this;
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

      return this;
    },


    /**
     * Turns the labels on and off by fixin them
     * @param  {String} value - the position of labels or null (this.LABEL_INSIDE| this.LABEL_OUTSIDE | this.LABEL_FIT | this.LABEL_NONE)
     *                          labels will be positioned separately on the
     * @return {Mixed}        - the value or chart
     */
    labelPosition: function (value) {
      if (!arguments.length) return this.options.labelPosition;

      this.validateOption('labelPosition', value, [this.LABEL_INSIDE, this.LABEL_OUTSIDE, this.LABEL_FIT , this.LABEL_NONE]);

      return this;
    },

    labelFormat: function (value) {
      return arguments.length ? (this.setFormat('labelFormat', value), this) : this.options.labelFormat;
    },
    labelAlign: function (value) {
      return arguments.length ? (this.validateOption('labelAlign', value, ['left', 'right', 'top', 'bottom']), this) : this.options.labelAlign;
    },
    labelColor: function(value) {
      return arguments.length ? (this.options.labelColor = value, this) : this.options.labelColor;
    },
    valuesPosition: function(value) {
      return arguments.length ? (this.validateOption('valuesPosition', value, ['inside', 'outside', 'fit', 'none']) , this) : this.options.valuesPosition;
    },
    valuesAlign: function(value) {
      return arguments.length ? (this.validateOption('valuesAlign', value, ['left', 'right']), this) : this.options.valuesAlign;
    },
    valuesColor: function(value) {
      return arguments.length ? (this.options.valuesColor = value, this) : this.options.valuesColor;
    },

    // Svale, seems like this is a ghost. Never implemented ??!? Moved to base.
    // valuesFormat: function () {
    //   return arguments.length ? (this.options.valuesFormat = value, this) : this.options.valuesFormat;
    // },


    /**
     * TODO: IF this shit works and is useful, move to base utils or somwhere like that
     * A validator that checks if input to option setter is valid. Aborts with console error if not
     * @param  {string} option  the option to be set
     * @param  {string} value   the value to be set
     * @param  {array}  domain  options valid domain of values
     * @return {bool}           returns true or false
     */
    validateOption: function(option, value, domain) {

      value = String(value).toLowerCase();

      if(_.contains(domain, value)) {
        this.options[option] = value;
        return true;
      }
      console.error('Error setting ' + option +': "' + value, '" is invalid. Valid input is: "' + domain.join('", "') +'"');
      return false;
    }

  };



  chart = _.extend(chart, barOptions, barPositions, barDimensions, labelOptions);


// keep the options clean
  chart.options = _.extend(chart.options, base.options, barAxis.options);
  chart = _.extend(chart, _.omit(base, 'options'), _.omit(barAxis, 'options'));

  return (chart.init());
  }
return BarChart;
}));