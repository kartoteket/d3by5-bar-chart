/**
 * [Description]
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore','d3'] , factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'),require('d3'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._, root.d3);
    }
}(this, function (_, d3) {

'use:strict';

function barAxis () {
  return {

    options : {
        axis: {
          y: {
            show: true,
            rotate: 0,
            label: '',
            ticks: d3.svg.axis().ticks(),
            align: 'left',
            pos: 'bottom',
          },
          x: {
            show: true,
            rotate: 0,
            label: '',
            ticks: d3.svg.axis().ticks(),
            align: 'bottom',
            pos: 'left',
          }
        }
    },

    /**
     * retuns the correct scale to use for the axis
     * @param  {String} scale - What scale to use ( y | x)
     * @return {d3.scale}     - The correct scale
     */
    axis_getScale: function (scale) {

      // the values, normally y
      if (scale === 'y') {
        if (this.options.anchor === this.ANCHOR_RIGHT || this.options.anchor === this.ANCHOR_BOTTOM) {
          invertedScale = d3.scale.linear()
                            .domain(this.yScale.domain().reverse())
                            .range(this.yScale.range());
          return invertedScale;
        }
        return this.yScale;
      } else {
        if (this.isVertical()) {
          return this.xScale;
        }
        return this.xScale;
      }
    },

    axis_getTransform: function (dir) {
      if (dir === 'y') {
        if (this.isVertical()) {
          return 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')';
        }
        return 'translate(' + this.options.margin.left + ',' + (this.options.axis.y.align === 'top' ? 0 : this.getCalculatedHeight()) + ')';
      }

      if (dir === 'x') {
        if (this.isVertical()) {
          return 'translate(' + this.options.margin.left + ',' + (this.options.axis.y.align === 'top' ? 0 : this.options.height - this.options.margin.bottom ) + ')';
        }
        return 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')';
      }
    },

    /**
     * fuzzy replicating nativd d3 ticks count for x scaled axis
     * @param {int} count number of ticks
     */
    _setTickValues: function(count) {

      var total = this.xScale.domain().length
        , step = Math.ceil(total/count) || 0
        , tickValues;

      if(total === 0)
        return [];

      tickValues = this.xScale.domain().filter(function(item, index) {
        return index % step == 1;
      });

      return tickValues.length ? tickValues : [];
    },

    drawAxis: function(selection) {
      var axis = {}
        , that = this
        , axisOpt = this.options.axis
        , transform
        , _yAxis
        , _xAxis
        , xScale
        , yRotationAttr
      ;





      if(axisOpt.y.show) {

        axis.y = d3.svg.axis()
                    .scale(this.axis_getScale('y'))
                    .orient(axisOpt.y.align)
                    .ticks(axisOpt.y.ticks.count)
                    .tickFormat(axisOpt.y.ticks.format);

          _yAxis = this.svg.append('g')
              .attr('class', 'y axis')
              .attr('transform', that.axis_getTransform('y'))
              .call(axis.y);

          if (axisOpt.y.rotate) {
            yRotationAttr = {};
            //negative rotation needs adjustments
            if(axisOpt.y.rotate < 0) {
              yRotationAttr.y = -7;
              yRotationAttr.x = -7;
            } else {
              yRotationAttr.y = 0;
              yRotationAttr.x = 0;
            }
            yRotationAttr.transform = 'rotate(' + axisOpt.y.rotate + ')';



            _yAxis.selectAll('text')
                        .attr(yRotationAttr)
                        .style('text-anchor', axisOpt.y.rotate < 0 ? 'end' : 'start');
          }

          _yAxis
              .append('text')
                .attr('class', 'y-label')
                // .attr('transform', 'rotate(-90)')
                .attr('y', -20)
                .attr('dy', '.71em')
                .attr('fill', '#777')
                .style('font-size', '0.875rem')
                .style('text-anchor', 'start')
                .text(axisOpt.y.label);
        }

        //yAxis
        if(axisOpt.x.show) {
          xScale = this.axis_getScale('x');
          axis.x = d3.svg.axis()
                    .scale(xScale)
                    .orient(axisOpt.x.align);

          if (axisOpt.x.ticks.count === 0) {
            axis.x.tickValues([]);
          } else if (axisOpt.x.ticks.count > 0) {
            axis.x.tickValues(that._setTickValues(axisOpt.x.ticks.count));
          }

          if (axisOpt.x.ticks.format) {
            axis.x.tickFormat(axisOpt.x.ticks.format);
          }

          _xAxis = this.svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', that.axis_getTransform('x'))
            .call(axis.x);

          if (axisOpt.x.rotate) {
            _xAxis.selectAll('text')
                        .attr('y', axisOpt.x.rotate === 90 ? -6 : 0)
                        .attr('x', 7)
                        // .attr("dy", ".35em")
                        .attr('transform', 'rotate(' + axisOpt.x.rotate + ')')
                        .style('text-anchor', 'start');
          }

          _xAxis
              .append('text')
                .attr('class', 'x-label')
                .attr('transform', 'rotate(-90)')
                .attr('x', 6)
                .attr('y', this.getCalculatedWidth())
                .attr('dy', '.71em')
                .attr('fill', '#777')
                .style('font-size', '0.875rem')
                .style('text-anchor', 'start')
                .text(axisOpt.x.label);



          // axis.y = this.axis()
          //             .show(axisOpt.y.show)
          //             .pos(axisOpt.y.pos)
          //             .align(axisOpt.y.align)
          //             .ticks(axisOpt.y.ticks);


          // _yAxis = this.svg.append('g')
          //     .attr('class', 'y axis')
          //     .attr('transform', 'translate(' + (axis.y.pos() === 'right' ? this.getCalculatedWidth() : this.options.margin.left) + ', 0)')
          //     .call(axis.y());

          // if(y.label) {
          //   _yAxis.append('text')
          //     .attr('transform', 'rotate(-90)')
          //     .attr('y', 6)
          //     .attr('dy', '.71em')
          //     .style('text-anchor', 'end')
          //     .text(y.label);
          // }
        }

    },

    axis: function () {
      var that = this
        , axis = {
          ticks: function (value) {
            if (arguments.length) {
              if(!_.isObject(value)) {
                console.warn('missing value for tick count, allowed is {y OR x}, values: null ("auto"), 0 ("none") or a number ');
                return that;
              }
              if (_.has(value, 'y')) {
                that.options.axis.y.ticks = that.axis_parseTicks(value.y);
              }
              if (_.has(value, 'x')) {
                that.options.axis.x.ticks = that.axis_parseTicks(value.x);
              }
              return that;
            }
            return {y: that.options.axis.y.ticks, x: that.options.axis.x.ticks};
          },
          align: function (value) {
            if (arguments.length) {
              if(!_.isObject(value)) {
                console.warn('missing value for align, allowed is {y OR x}, values: top | bottom | left | right');
                return that;
              }
              if (value.y) {
                that.options.axis.y.align = value.y;
              }
              if (value.x) {
                that.options.axis.x.align = value.x;
              }
              return that;
            }
            return {y: that.options.axis.y.align, x: that.options.axis.y.align};
          },
          rotate: function (value) {
            if (arguments.length) {
              if(!_.isObject(value)) {
                console.warn('missing value for rotate, allowed is {y OR x}, values: -180 to 180');
                return that;
              }
              if (_.isNumber(value.y)) {
                that.options.axis.y.rotate = value.y;
              }
              if (_.isNumber(value.x)) {
                that.options.axis.x.rotate = value.x;
              }
              return that;
            }
            return {y: that.options.axis.y.rotate, x: that.options.axis.x.rotate};
          },
          label: function (value) {
            if (arguments.length) {
              if(!_.isObject(value)) {
                console.warn('missing value for label, allowed is {y OR x}, values: any string');
                return that;
              }

              if(_.has(value, 'y')) {
               that.options.axis.y.label = value.y;
              }

              if(_.has(value, 'x')) {
                that.options.axis.x.label = value.x;
              }

              return that;
            }
            return {y: that.options.axis.y.label, x: that.options.axis.x.label};
          }
        };
      return axis;
    },

    /**
     * Parse tick options before use
     * @param  {object} ticks {count, format}
     * @return {object}       {count, format}
     */
    axis_parseTicks: function(inData) {

      if (!_.isObject(inData)) {
        console.warn('ticks must be an object with one or both properties "count" (auto | none | [0-n]) "format" (auto | d3,time,format)');
        return {count:null, format:null};
      }

      var count = inData.count
        , format = inData.format
      ;

      switch(count) {
        case 'auto':
        case null:
        case undefined:
          count = null;
          break;
        case 'none':
          count = 0;
          break;
        default:
          count = +count;
          break;
      }

      // TODO: Handfe more formats that just date/time
      switch(format) {
        case undefined:
        case null:
        case 'auto':
          format = null;
          break;
        default:
          format = d3.time.format(format);
          break;
      }

      return {count:count, format:format};
    }
  };
}
return barAxis();
}));