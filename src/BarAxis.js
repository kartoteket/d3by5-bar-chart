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
    this.defaultOptions.width = parent.width();
    this.defaultOptions.height = parent.height();

    this.options = Object.assign({}, this.defaultOptions, this.baseOptions);

    if (direction === 'x') {
      this.options.align = Enums.ANCHOR_BOTTOM;
      this.options.pos = Enums.ANCHOR_LEFT;
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
    let axis = this.axis
      , axisGroup
      , x
      , y
    ;

    axisGroup = selection.append('g')
                          .attr('class', '.axis text')
                          .attr('transform', this.axisTranslation)
                          .style('font-size', '0.875rem')
                          .call(axis);

    if (this.options.rotate) {

      //negative rotation needs adjustments
      if(this.options.rotate < 0) {
        y = -7;
        x = -7;
      } else {
        y = 0;
        x = this.direction === 'x' ? 8 : 0;
      }

      axisGroup.selectAll('text')
                  .attr('x', x)
                  .attr('y', y)
                  .attr('transform', 'rotate(' + this.options.rotate + ')')
                  .style('text-anchor', this.options.rotate < 0 ? 'end' : 'start');
    }
  }


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

}