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

  get axis () {
    let axis;

    switch(this.options.align) {
      case Enums.ANCHOR_TOP:
        axis =  axisTop(this.options.scale)
        break;
      case Enums.ANCHOR_LEFT:
        axis =  axisLeft(this.options.scale)
        break;
      case Enums.ANCHOR_BOTTOM:
        axis =  axisBottom(this.options.scale)
        break;
      case Enums.ANCHOR_RIGHT:
        axis =  axisRight(this.options.scale)
        break;
    }

    axis.ticks(this.options.ticks);
    return axis;
  }

  get axisTranslation () {
    switch(this.options.align) {
      case Enums.ANCHOR_TOP:
        return 'translate(' + this.options.margin.left + ', ' + this.options.margin.top + ')';
      case Enums.ANCHOR_LEFT:
        return 'translate(' + this.options.margin.left + ', ' + this.options.margin.top + ')';
      case Enums.ANCHOR_BOTTOM:
        return 'translate(' + this.options.margin.left + ', ' + this.calculatedHeight + ')';
      case Enums.ANCHOR_RIGHT:
        return  'translate(' + (this.options.width - this.options.margin.right) + ', ' + this.options.margin.top + ')';
    }
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