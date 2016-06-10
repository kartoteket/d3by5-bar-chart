'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , labelOptions = {}
;

module.exports = labelOptions;


labelOptions.drawLabels = function () {

  var that = this
    , textAnchorHandler
    , xPosHandler
    , yPosHandler
    , rotationHandler
    , positions = {}
  ;


  //
  // The horizontal anchors share some common featiures
  // The rotation and y position will be the same for both
  //
  // the text anchors and x-pos wil differ in how they are extracted
  //
  if (this.options.anchor === this.ANCHOR_RIGHT || this.options.anchor === this.ANCHOR_LEFT) {

    // will look for the bar with the same id as the data node
    // extract the y-pos and height of the bar to determine the correct y pos
    yPosHandler = function (d) {
      var _parent = that.svg.select('#' + d.id)
        , _n = _parent.node()
        , _y = parseInt(_n.getAttribute('y'))
        , _height = parseInt(_n.getAttribute('height'))
      ;

      return _y + (_height * 0.5);
    };

    // no rotation for horisontals
    rotationHandler = function (d) {
      return 0;
    };

    //
    // The right anchored items will position x by bar xpos
    //
    if (this.options.anchor === this.ANCHOR_RIGHT) {
      // if bar covers more than half the width, set text-anchor to start, else set it to end
      textAnchorHandler = function (d) {
        return (d.values > that.maxValue * 0.5) ? 'start' : 'end';
      };

      // will look for the bar with the same id as this datanode id
      // will extract the x-pos of this node and use it as the xpos
      // if the anchor is end, subtract 10, else add 10
      xPosHandler = function (d) {
        var _parent = that.svg.select('#' + d.id)
          , _n = _parent.node()
          , _x = parseInt(_n.getAttribute('x'))
        ;

        return (d.values > that.maxValue * 0.5) ? _x + 10 : _x - 10;
      };
    }
    //
    // The left anchored items will position by bar width
    //
    else if (this.options.anchor === this.ANCHOR_LEFT) {
      // if bar covers more than half the width, set text-anchor to end, else set it to start
      textAnchorHandler = function (d) {
        return (d.values > that.maxValue * 0.5) ? 'end' : 'start';
      };

      // will look for the bar with the same id as this datanode id
      // will extract the xwidth of this node and use it as the xpos
      // if the anchor is start, subtract 10, else add 10
      xPosHandler = function (d) {
        var _parent = that.svg.select('#' + d.id)
          , _n = _parent.node()
          , _x = parseInt(_n.getAttribute('width'))
        ;

        return (d.values > that.maxValue * 0.5) ? _x - 10 : _x + 10;
      };
    }

  }

  //
  // The vertical anchors share some properties.
  // Both will rotate by 90 degrees
  // both will get their x pos from the x of the corresponding bar
  //
  // text anchors and y-pos will differ for both
  //
  else if (this.options.anchor === this.ANCHOR_TOP || this.options.anchor === this.ANCHOR_BOTTOM) {

    // rotate verticals by 90
    rotationHandler = function () {
      return 90;
    };

    // will look for the bar with the same id as this datanode id
    // will extract the xwidth of this node and use it as the xpos
    // if the anchor is start, subtract 10, else add 10
    xPosHandler = function (d) {
      var _parent = that.svg.select('#' + d.id)
        , _n = _parent.node()
        , _x = parseInt(_n.getAttribute('x'))
        , _width = parseInt(_n.getAttribute('width'))
      ;

      return _x + (_width * 0.5);
    };

    //
    // Top anchored items will be anchored by
    //
    if (this.options.anchor === this.ANCHOR_TOP) {

      // if bar covers more than half the width, set text-anchor to end, else set it to start
      textAnchorHandler = function (d) {
        return (d.values > that.maxValue * 0.5) ? 'end' : 'start';
      };

      // will look for the bar with the same id as the data node
      // extract the y-pos and height of the bar to determine the correct y pos
      yPosHandler = function (d) {
        var _parent = that.svg.select('#' + d.id)
          , _n = _parent.node()
          , _height = parseInt(_n.getAttribute('height'))
        ;

        return (d.values > that.maxValue * 0.5) ? _height - 10 : _height + 10;
      };
    }
    else if (this.options.anchor === this.ANCHOR_BOTTOM) {
      // if bar covers more than half the width, set text-anchor to end, else set it to start
      textAnchorHandler = function (d) {
        return (d.values > that.maxValue * 0.5) ? 'start' : 'end';
      };

      // will look for the bar with the same id as the data node
      // extract the y-pos and height of the bar to determine the correct y pos
      yPosHandler = function (d) {
        var _parent = that.svg.select('#' + d.id)
          , _n = _parent.node()
          , _y = parseInt(_n.getAttribute('y'))
        ;

        return (d.values > that.maxValue * 0.5) ? _y + 10 : _y - 10;
      };
    }
  }

  var labels = this.svg.selectAll('.labels')
                 .data(this.options.data)
                 .enter()
                 .append('text')
                 .text(function (d) {
                    return d.label;
                 })
                 .style('text-anchor', textAnchorHandler)
                  .attr('transform', function (d) {
                    return 'translate(' + xPosHandler(d) + ',' + yPosHandler(d) + ') rotate (' + rotationHandler() + ', 0 0)';
                  })
                 .attr('dy', '0.35em');



};



