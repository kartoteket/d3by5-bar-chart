import Enums from './Enums';
import BaseUtils from './BaseUtils';

export default class BaseAxis extends BaseUtils {
	constructor () {
    super();
    const that = this;
    this.baseOptions = {
      show: true,
      margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              },
      ticks: this._parseTicks(['auto','auto'])
    }

  }

  /**
   * getter/setters
   */
  show (value) {
    return arguments.length ? (this.options.show = value, this) : this.options.show;
  }

  ticks (value) {
    console.log(value);
    return arguments.length ? (this.options.ticks = this._parseTicks(value), this) : this.options.ticks;
  }

  align (value) {
    return arguments.length ? (this.options.align = value, this) : this.options.align;
  }

  height (value) {
    return arguments.length ? (this.options.height = value, this) : this.options.height;
  }

  width (value) {
    return arguments.length ? (this.options.width = value, this) : this.options.width;
  }

  exit () {
    return this.parent;
  }


  /**
   * Sets the marging of a chart, this can be a single value or an object/array
   * @param  {Mixed} argument[0]  - a margin fragment or complete margin object
       *                             Number - a single number, used for margin top, or matched as below
       *                             Object - a valid margins object {top, right, bottom, left}
   * @param  {Number} argument[1] - number describing right or horizontal margin
   * @param  {Number} argument[2] - number describing bottom margin
   * @param  {Number} argument[3] - number describing left margin
   *
   * @return {Mixed}       - the margin object or chart
   */
  margin (...rest) {
    if (!arguments.length) return this.options.margin;
    this.options.margin = this._createMargins.apply(this, arguments);
    return this;
  }


  /**
   * Parse tick options before use
   * @param  {object} ticks {count, format}
   * @return {object}       {count, format}
   */
  _parseTicks(ticks){

    let count = ticks[0]
     , format = ticks[1];

    switch(count) {
      case 'auto':
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