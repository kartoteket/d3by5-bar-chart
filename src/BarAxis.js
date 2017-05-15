import BaseAxis from './BaseAxis';
import Enums from './Enums';
import {isObject as _isObject} from 'lodash';
import {scaleLinear,
        axisTop,
        axisLeft,
        axisBottom,
        axisRight} from 'd3';

export default class BarAxis extends BaseAxis {
	constructor (direction, parent) {
    super();
    this.defaultOptions = {
            show: true,
            scale: null,
            rotate: 0,
            label: '',
          };
    this.parent = parent;
    this.options = Object.assign({}, this.defaultOptions, this.baseOptions);

    if (direction === 'x') {
      this.options.align = Enums.ANCHOR_BOTTOM;
      this.options.pos = Enums.ANCHOR_LEFT;
      this.options.rotate = 70;
    } else {
      this.options.align = Enums.ANCHOR_LEFT;
      this.options.pos = Enums.ANCHOR_BOTTOM;
    }


    this.direction = direction;
  }


  /**
   * Sets the direction of the graph
   * @param  {String} value - the direction used, allowed values = ANCHOR_LEFT | ANCHOR_RIGHT | ANCHOR_BOTTOM | ANCHOR_TOP
   * @return {Mixed}        - the value or chart
   */
  anchor (value) {
    if (!arguments.length) return this.options.anchor;
    value = String(value).toLowerCase();
    // wrong value supplied
    if (value !== Enums.ANCHOR_LEFT &&
        value !== Enums.ANCHOR_RIGHT &&
        value !== Enums.ANCHOR_TOP &&
        value !== Enums.ANCHOR_BOTTOM) {
      console.error(value, 'is invalid. Only ', Enums.ANCHOR_LEFT, ', ', Enums.ANCHOR_RIGHT, ', ', Enums.ANCHOR_TOP, ' or ', Enums.ANCHOR_BOTTOM, 'allowed');
      return this;
    }
    this.options.anchor = value;

    return this;
  }

  scale (value) {
    if (!arguments.length) return this.options.scale;
    this.options.scale = this._getScale(value);
    return this;
  }

  rotate (value) {
    if (!arguments.length) return this.options.rotate;
    this.options.rotate = value;
    return this;
  }

  label (value) {
    if (!arguments.length) return this.options.label;
    this.options.label = value;
    return this;
  }

  /**
   * retuns the correct scale to use for the axis
   * @param  {scaleLinear} scale - a valid d3 scale (passed from parent)
   * @return {scaleLinear}     - The correct scale (reversed if needed)
   */
  _getScale (scale) {
    // the values, normally y
    if (this.direction === 'y' && (this.options.anchor === Enums.ANCHOR_RIGHT || this.options.anchor === Enums.ANCHOR_BOTTOM)) {
      const invertedScale = scaleLinear()
                              .domain(scale.domain().reverse())
                              .range(scale.range());
      return invertedScale;
    }
    return scale;
  }

  _getTransform () {
    if (this.direction === 'y') {
      if (this.isVertical) {
        return 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')';
      }
      return 'translate(' + this.options.margin.left + ',' + (this.options.align === Enums.ANCHOR_TOP ? 0 : this.calculatedHeight) + ')';
    }

    if (this.direction  === 'x') {
      if (this.isVertical) {
        return 'translate(' + this.options.margin.left + ',' + (this.options.align === Enums.ANCHOR_TOP ? 0 : this.options.height - this.options.margin.bottom ) + ')';
      }
      return 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')';
    }
  }


  draw (selection) {
    const that = this
    let axis
      , rotationAttr
      , axisGroup
    ;

    if(this.options.show) {

      axis = d3.svg.axis()
                  .scale(this.options.scale)
                  .orient(this.options.align)
                  .ticks(this.options.ticks.count)
                  .tickFormat(this.options.ticks.format);

      axisGroup = selection.append('g')
          .attr('class', function () {
            return that.direction + ' axis';
          })
          .attr('transform', that._getTransform())
          .call(axis);

      if (this.options.rotate) {
        rotationAttr = {};
        //negative rotation needs adjustments
        if(this.options.rotate < 0) {
          rotationAttr.y = -7;
          rotationAttr.x = -7;
        } else {
          rotationAttr.y = 0;
          rotationAttr.x = this.direction === 'x' ? 8 : 0;
        }
        rotationAttr.transform = 'rotate(' + this.options.rotate + ')';



        axisGroup.selectAll('text')
                    .attr(rotationAttr)
                    .style('text-anchor', this.options.rotate < 0 ? 'end' : 'start');
      }

      axisGroup
          .append('text')
            .attr('class', function () {
              return that.direction + '-label';
            })
            .attr('transform', function () {
              if (that.direction === 'y') {
                return 'rotate(90)';
              }
              return 'rotate(0)';
            })
            .attr('y', -20)
            .attr('x', 10)
            .attr('dy', '.71em')
            .attr('fill', '#777')
            .style('font-size', '0.875rem')
            .style('text-anchor', 'start')
            .text(this.options.label);
      }

      // //yAxis
      // if(axisOpt.x.show) {
      //   xScale = this.axis_getScale('x');
      //   axis = d3.svg.axis()
      //             .scale(this.options.scale)
      //             .orient(this.options.align);

      //   if (axisOpt.x.ticks.count === 0) {
      //     axis.x.tickValues([]);
      //   } else if (axisOpt.x.ticks.count > 0) {
      //     axis.x.tickValues(that._setTickValues(axisOpt.x.ticks.count));
      //   }

      //   if (axisOpt.x.ticks.format) {
      //     axis.x.tickFormat(axisOpt.x.ticks.format);
      //   }

      //   _xAxis = this.svg.append('g')
      //       .attr('class', 'x axis')
      //       .attr('transform', that.axis_getTransform('x'))
      //     .call(axis.x);

      //   if (axisOpt.x.rotate) {
      //     _xAxis.selectAll('text')
      //                 .attr('y', axisOpt.x.rotate === 90 ? -6 : 0)
      //                 .attr('x', 7)
      //                 // .attr("dy", ".35em")
      //                 .attr('transform', 'rotate(' + axisOpt.x.rotate + ')')
      //                 .style('text-anchor', 'start');
      //   }

      //   _xAxis
      //       .append('text')
      //         .attr('class', 'x-label')
      //         .attr('transform', 'rotate(-90)')
      //         .attr('x', 6)
      //         .attr('y', this.getCalculatedWidth())
      //         .attr('dy', '.71em')
      //         .attr('fill', '#777')
      //         .style('font-size', '0.875rem')
      //         .style('text-anchor', 'start')
      //         .text(axisOpt.x.label);



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
      // }

  }

  /**
   * fuzzy replicating nativd d3 ticks count for x scaled axis
   * @param {int} count number of ticks
   */
  _setTickValues (count) {

    var total = this.scale.domain().length
      , step = Math.ceil(total/count) || 0
      , tickValues;

    if(total === 0)
      return [];

    tickValues = this.scale.domain().filter(function(item, index) {
      return index % step == 1;
    });

    return tickValues.length ? tickValues : [];
  }

  /**
   * Parse tick options before use
   * @param  {object} ticks {count, format}
   * @return {object}       {count, format}
   */
  _parseTicks (inData) {

    if (!_isObject(inData)) {
      console.warn('ticks must be an object with one or both properties "count" (auto | none | [0-n]) "format" (auto | d3,time,format)');
      inData = {count:null, format:null};
    }

    var count = inData.count || null
      , format = inData.format || null
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

}