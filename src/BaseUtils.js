import Enums from './Enums';
import {timeFormat,
        select as d3_select,
        format as d3_format} from 'd3';
// import _ from 'lodash'
import {isFunction,
        isNumber,
        isArray,
        isString,
        isObject,
        has,
        uniqueId,
        uniq} from 'lodash';

export default class BaseUtils {

    /**
     * Base utils contains utility methods used by the base class and classes extending it
     */

    /**
     * Removes the toplevel svg if present
     */
    remove  () {
      if (this.svg) {
        this.svg.remove();
      }
    }


    get isHorizontal () {
      return (this.options.anchor === Enums.ANCHOR_LEFT || this.options.anchor === Enums.ANCHOR_RIGHT);
    }

    get isVertical () {
      return !this.isHorizontal;
    }

    /**
     * returns the width calculated and adjusted for margins
     * @return {Number} - The width - margins
     */
    get calculatedWidth () {
      return this.options.width - this.options.margin.left - this.options.margin.right;
    }

    /**
     * returns the height calculated and adjusted for margins
     * @return {Number} - The height - margins
     */
    get calculatedHeight () {
      return this.options.height - this.options.margin.top - this.options.margin.bottom;
    }


    /**
     * Created the margins based on the input from base.margin()
     *
     * @param  {Mixed} v1  - a margin fragment or complete margin object
         *                             Number - a single number, used for margin top, or matched as below
         *                             Object - a valid margins object {top, right, bottom, left}
     * @param  {Number} v2 - number describing right or horizontal margin
     * @param  {Number} v3 - number describing bottom margin
     * @param  {Number} v4 - number describing left margin
     *
     * @return {[type]}    [description]
     */
    _createMargins  (v1, v2, v3, v4) {
      var margin;
        // valid margins object
      if (isObject(v1) &&
                has(v1, 'top') &&
                has(v1, 'right') &&
                has(v1, 'bottom') &&
                has(v1, 'left')
                ) {

        // sanitice undefines. enforce number
        v1 = {
          'top'     : v1.top    || 0,
          'right'   : v1.right  || 0,
          'bottom'  : v1.bottom || 0,
          'left'    : v1.left   || 0,
        };

        return v1;
      }

      if (!isNumber(v1)) {
        console.error('Could not match ', arguments ,' to any valid margin');
        return;// this.options.margin;
      }

      //
      // Arguments are any combination of numbers
      //
      if (arguments.length === 1) {
        margin = [+v1, +v1, +v1, +v1];
      }

      else if (arguments.length === 2) {
        margin = [v1, v2, v1, v2];
      }

      else if (arguments.length === 3) {
        margin = [v1, v2, v3, v2];
      }

      else if (arguments.length === 4) {
        margin = [v1, v2, v3, v4];
      }

      // optimise for es6
      return {'top': margin[0], 'right': margin[1], 'bottom': margin[2], 'left': margin[3] };
    }

    /**
     * Parser entrypoint with default operations
     * The parser will create a color accessor to be used to fetch colors wnhen mapping the data
     * The parser will set the datatype options to DATATYPE_UNIDIMENSIONAL or DATATYPE_MULTIDIMENSIONAL
     * Parser will map data using a method _mapData in this scope
     *
     * @param  {Array} inData - data origination from base.data()
     * @return {[type]}       - A parsed and normalized data Array
     */
    _parseData  (inData) {
      this.options.color = this._getColorAccessor(inData, this.options.color);
      this.options.dataSchema = this._getDataSchema(inData);
      this.options.dataType = this._getDataDimensions(inData);

      return this._mapData(inData);

    }

    /**
     * Performs a lazy simple lookup for events that may match a pattern (or really its a substring)
     * @param  {Mixed}  pattern  - The pattern to look for, just a substring that may match, could be a simple, or an array of patterns
     *                             The String 'mouse', 'Over' and 'MOusEOV' will match the event 'mouseover' and return this
     * @return {Array}           - A unique list of matching events
     */
    getEventsOfType  (pattern) {
      let list = [];
      const that = this;

      if (isString(pattern)) {
        pattern = [pattern];
      }

      for(let p of pattern) {
        if (this._isValidArray(that.options.on)) {
          // optimise for es6
          list = list.concat(that.options.on.filter(function (e) {
            return e.action.indexOf(p) !== -1;
          }));
        }
      };
      return uniq(list);
    }


    /**
     * Utility that updates the data by adding colors and a unique id
     * @param  {Array} inData - an array of objects
     *                          data can have two distinct layouts
     *                          unidimensional:
     *                            [{label, values},{labels, values}]
     *                          multidimensionsal: (key is a definition, label, for the values)
     *                            [
     *                              {label, key, values: [value, value, value]},
     *                              {label, key, values: [value, value, value]},
     *                              }
     *                            ]
     *                           or: (no key treat the data as a series of numbers)
     *                            [
     *                              {label, values: [value, value, value]},
     *                              {label, values: [value, value, value]},
     *                              }
     *                            ]
     * @return {Array}        - an array sanitized to ensure the props label, values, color and id is present
     */
    _mapData  (inData) {
      const idPrefix = this.options.idPrefix;

      const data = inData.map(function (d, i) {
        if (isArray(d.values)) {
          d.values = d.values.map(function(value, index) {
                     return {
                              label: value.label,
                              values: value.values,
                              id: uniqueId(idPrefix + i + '-')
                            };
                    });
        }
        d.id = d.id || uniqueId(idPrefix);
        return d;
      });

      return data;
    }


    /**
     * Returns an accessor function for retrieving the color based on the index of the data-node
     * @return {function} - a linear accessorfunction
     */
    _getColorAccessor  (inData, color) {
      const that = this;

      // check if the color is a function (accessor), return it if so
      if(isFunction(color)) {
        return color;
      }
      // if the colors are a range, check the length
      // if the size is bigger or equal to the data, use this accessor
      // if not, use a modulo opeartor in the accessor
      if (isArray(color) && color.length) {

        if(color.length > inData.length) {
          return function (i) {
            return color[i];
          };
        }
        let l = color.length;
        return function (i) {
          let _index = i % l;
          return color[_index];
        };
      }

      // if the color is an object with a key value
      // use it as teh accessor
      if (isObject(color)) {
        return function (l) {
          if (has(color, l)) {
            return color[l];
          }
          return '#007AFF';
        }
      }
      //
      // color is a single color
      // create an accessor function
      if (color) {
        return function (x) {return color;};
      }

      return function (x) {return '#007AFF';}; 
    }

    /**
     * GetDataDimensions will inspect indata and see if the values section is an array, if so the data has multiple dimensions
     * @param  {Array} inData - The data that was set in the chart.data() getter (base.data())
     * @return {String}       - Description of type of data dimenstions DATATYPE_MULTIDIMENSIONAL | DATATYPE_UNIDIMENSIONAL
     */
    _getDataDimensions  (inData) {
      var firstDataNode;

      if (isArray(inData)) {
        firstDataNode = !!inData.length ? inData[0] : [];
        if (has(firstDataNode, 'values') && isArray(firstDataNode.values)) {
          return Enums.DATATYPE_MULTIDIMENSIONAL;
        }
      }
      return Enums.DATATYPE_UNIDIMENSIONAL;
    }


    /**
     * GetDataSchema extracts schema from inData
     * @param  {Array} inData - The data that was set in the chart.data() getter (base.data())
     * @return {String}       - object with schema that describes data columns
     */
    _getDataSchema  (inData) {
      if (this._isValidArray(inData)) {
        return inData[0].columns;
      } else {
        return inData.columns;
      }
    }

    _isValidArray (inData) {
      return isArray(inData) && inData.length;
    }


    /**
     * A simple first iteration type caster.
     * @param  {object}   d   data object ({key: value})
     * @return {object}   d   data object ({key: value})
     */
    _typeCast (d) {
      var dateFormat
        , formatDate
        , schema = this.options.dataSchema;

        // loop trough schema column by column
      for(let column of schema) {

        // set date format
        if(column.type === 'date') {
          dateFormat = schema.find( function(column){ return column.type === 'date' && column.format; }).format;
          formatDate = timeFormat(dateFormat);
          d[column.label] = formatDate.parse(d[column.label]);
        }

        // force number
        else if(column.type === 'number') {
          d[column.label] = +d[column.label];
        }
      };

      return d;
    }

    // wrapper for d3.format() -> https://github.com/mbostock/d3/wiki/Formatting
    formatNumber (value, format) {
      // so that we can use convenience aliases
      switch(format) {
        case 'commaSeparator':
          format = ',';
          break;
        default:
          format = format;
      }

      const formatter = d3_format(format);
      return formatter(value);
    }

    // ref: https://bl.ocks.org/mbostock/7555321
    wrapText (width, padding) {
      return function() {
        var text = d3_select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.3, // ems
            x = text.attr('x') || 0,
            y = text.attr("y") || 0,
            dy = text.attr("dy") ? parseFloat(text.attr("dy")) : 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        width = width || 120;
        padding = padding || 5;
        /*jshint -W084 */
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > (width - 2 * padding)) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      };
    }

}