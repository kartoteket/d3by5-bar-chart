'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , labelOptions = {}
;
// define d3by5-base-chart for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = labelOptions;

// define d3by5_PieChart as an AMD module
} else if (typeof define === 'function' && define.amd) {

  define(labelOptions);

// define the base in a global namespace d3By5
}

labelOptions.setFormat = function (prop, value) {
  var formatter = d3.time.format(value)
    , output
  ;
  // check it for data format
  // if the format func returns the input, if is messed up
  if (value === formatter(new Date())) {
    this.options[prop] = null;
  } else {
    this.options[prop] = formatter;
  }
};

labelOptions.drawLabels = function () {

  var that = this
    , textAnchorHandler
    , xPosHandler
    , yPosHandler
    , rotationHandler
    , positions = {}
  ;

  // rotate verticals by 90
  rotationHandler = function (d) {
    return (that.options.anchor === that.ANCHOR_TOP || that.options.anchor === that.ANCHOR_BOTTOM) ? 90 : 0;
  };


  xPosHandler = function (prop, d, elem) {
    var _rect
      , _bbox

      if(elem.previousSibling) {
        _bbox = elem.previousSibling.getBBox();
      } else {
        console.log('no x sibling');
        _rect = that.svg.select('#' + d.id).select('rect')
        _bbox  = _rect.node().getBBox();
      }



    if (that.options.anchor === that.ANCHOR_TOP || that.options.anchor === that.ANCHOR_BOTTOM) {
      return _bbox.x + (_bbox.width * 0.5);
    } else {

      // if outside, then force outside
      if(that.options[prop+'Position'] === that.LABEL_OUTSIDE) {
        return that.options[prop+'Align'] === 'left' ? that.options.margin.left * -1 : that.width() - that.options.margin.left;
      }

      if (that.options.anchor === that.ANCHOR_RIGHT) {
        return (d.values > that.maxValue * 0.5) ? _bbox.x + 10 : _bbox.x - 10;
      }

      if (that.options.anchor === that.ANCHOR_LEFT) {
        return (d.values > that.maxValue * 0.5) ? _bbox.width - 10 : _bbox.width + 10;
      }
    }
  };


  yPosHandler = function (prop, d, elem) {
    var _rect
      , _bbox

      if(elem.previousSibling) {
        _bbox = elem.previousSibling.getBBox();
      } else {
        console.log('no y sibling');
        _rect = that.svg.select('#' + d.id).select('rect')
        _bbox  = _rect.node().getBBox();
      }

    if (that.options.anchor === that.ANCHOR_RIGHT || that.options.anchor === that.ANCHOR_LEFT) {
        return  _bbox.height * 0.5;
    } else {

      if(that.options[prop+'Position'] === that.LABEL_OUTSIDE) {
        return that.options[prop+'Align'] === 'top' ? that.options.margin.top * -1 : that.height() - that.options.margin.top;
      }

      if (that.options.anchor === that.ANCHOR_TOP) {
        return (d.values > that.maxValue * 0.5) ?  _bbox.height - 10 :  _bbox.height + 10;
      }
      if (that.options.anchor === that.ANCHOR_BOTTOM) {
        return (d.values > that.maxValue * 0.5) ? _bbox.y + 10 : _bbox.y - 10;
      }
    }
  };


  textAnchorHandler = function (prop, d) {

    // if outside, then force outside
    if(that.options[prop+'Position'] === that.LABEL_OUTSIDE) {
      return (that.options[prop+'Align'] === 'left' || that.options[prop+'Align'] === 'top') ? 'start' : 'end';
    }

    if (that.options.anchor === that.ANCHOR_RIGHT || that.options.anchor === that.ANCHOR_BOTTOM) {
        return (d.values > that.maxValue * 0.5) ? 'start' : 'end';
    }

    if (that.options.anchor === that.ANCHOR_LEFT || that.options.anchor === that.ANCHOR_TOP) {
        return (d.values > that.maxValue * 0.5) ? 'end' : 'start';
    }

  };

  applyLabelFormat = function (text) {
    if (that.options.labelFormat) {
      return that.options.labelFormat(text);
    }
    return text;
  };

  if (that.options.labelPosition !== that.LABEL_NONE) {
    var labels = this.svg.selectAll('g')
                   .data(that.options.data)
                   .append('text')
                   .attr('class', 'label')
                   .text(function (d) {
                      return applyLabelFormat(d.label);
                   })
                   .style('fill', that.options.labelColor )
                   .style('text-anchor', function (d) {return textAnchorHandler('label', d);})
                   .style('font-size', '0.875rem')
                    .attr('transform', function (d) {
                      return 'translate(' + xPosHandler('label',d, this) + ',' +  yPosHandler('label', d, this) + ') rotate (' + rotationHandler() + ', 0 0)';
                    })
                   .attr('dy', '0.35em');
  }

  if (that.options.valuesPosition !== that.LABEL_NONE) {

    if (this.options.dataType === this.DATATYPE_MULTIDIMENSIONAL) {
      var values = this.svg.selectAll('.barItem')
                      .append('text')
                      .attr('class', 'label')
                      .text(function (d, i) {
                        return d.values;
                      })
                      .style('fill', that.options.valuesColor )
                      .style('text-anchor', function (d) {return textAnchorHandler('values', d);})
                      .style('font-size', '0.875rem')
                      .attr('transform', function (d) {
                        return 'translate(' + xPosHandler('values', d, this) + ',' +  yPosHandler('values',d, this) + ') rotate (' + rotationHandler() + ', 0 0)';
                      })
                      .attr('dy', '0.35em');
    } else {
    var values = this.svg.selectAll('g')
                   .data(that.options.data)
                   .append('text')
                   .attr('class', 'label')
                   .text(function (d) {
                      return d.values;
                   })
                   .style('fill', that.options.valuesColor )
                   .style('text-anchor', function (d) {return textAnchorHandler('values', d);})
                   .style('font-size', '0.875rem')
                    .attr('transform', function (d) {
                      return 'translate(' + xPosHandler('values', d, this) + ',' +  yPosHandler('values',d, this) + ') rotate (' + rotationHandler() + ', 0 0)';
                    })
                   .attr('dy', '0.35em');
    }
  }

};
