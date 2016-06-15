'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , base = require('d3by5-base-chart')
  , barOptions = require('./barOptions')
  , labelOptions = require('./labelOptions')
  , barPositions = require('./barPositions')
  , barDimensions = require('./barDimensions')
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

    BARLAYOUT_STACKED: 'stacked',
    BARLAYOUT_GROUPED: 'grouped',

    LABEL_INSIDE: 'inside',
    LABEL_OUTSIDE: 'outside',
    LABEL_FIT: 'fit',
    LABEL_NONE: 'none',

    options: {
        padding: 2,
        anchor: 'right',
        chartClass: 'chart-bar',
        labelPosition: 'none',
        idPrefix: 'bar-',
        barLayout: 'grouped'
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
      ;
      // force a value for the dataType if there is a multi dimensional dataset
      this.options.barLayout = (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) ? this.options.barLayout || this.BARLAYOUT_GROUPED : null;

      this.maxValue = this.getMaxValue();
      this.breadthScale = this.getBreadthScale();
      this.lengthScale = this.getLengthScale();

      //
      // Create a grouped breadth scale and update the dataset 
      //
      if (that.options.dataType === that.DATATYPE_MULTIDIMENSIONAL) {
        this.groupedBreadthScale = this.getGroupedBreadthScale();

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
            .attr('transform', function (d) {
              var _x = that.isVertical() ? that.breadthScale(d.label) : that.options.margin[that.options.anchor]
                , _y = that.isVertical() ? that.options.margin.top : that.breadthScale(d.label)
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

      this.onBarLayoutChange = function () {
        this.draw();
      };

      // sets a method to allow redrawing
      this.onAnchorChange = function () {
        this.draw();
      };
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
      // redraw if the graph has been loaded
      if (typeof this.onBarLayoutChange === 'function') {
        this.onBarLayoutChange();
      }

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
  chart = _.extend(chart, barPositions);
  chart = _.extend(chart, barDimensions);
  chart = _.extend(chart, labelOptions);
// keep the options clean
  chart.options = _.extend(chart.options, base.options);
  base = _.omit(base, 'options');
  chart = _.extend(chart, base);
  return (chart.init());

}