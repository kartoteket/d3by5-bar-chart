# d3by5-horisontal-bar-graph
The d3by5-horisontal-bar-graph is part of the d3by5 graph tools, this specific package will draw a pie chart based on Mike Bostocks [Towards Reusable Charts](https://bost.ocks.org/mike/chart/)

## NOTE
This is an internal project, you are probably better off using somethin like [C3](https://github.com/c3js/c3). That said, just give it a try and contact us back (no capslock please).

## USAGE
Build the project by running
```bash
npm run build
```

When building two versions are built in the dist folder.
use the [version] version if you want to keep a specific version, use submodules or symlinks (or download) of the one without version if you want to update the lib without updating your code.

#### dist/
A browserified and uglified version with all dependencies included. Use this if you only want a simple graph to test.
* bar-graph-[version].min.js    // uglified and minified with version
* bar-graph.min.js              // uglified and minified without version

## DEPENDENCIES
Two dependencies in package.json
* Underscore
* d3

```
npm install
```
will get you all you need

## API
### Required
* width  - Number: the height of the chart
* height - Number: the width of the chart
* data   - Array: the data that produces the chart, [{label: String, value: Number}, {xx}]

### Optional
* fillColor - String/hex: the fillcolor (defaults to 'coral')
* padding - Number: the padding to use (detaults to 2)


## EXAMPLE
All methods are chained, you can simply instanciate a new bar graph like this

```javascript
var bar = require('d3by5-horisontal-bar-graph');

var bargraph = bargraph()
                    .width(500)
                    .height(400)
                    .data([{label:'coffee', values: 509}, {label:'tea', values: 1}]);

d3.select('.js-bar-graph')
    .call(bargraph);
```

## LICENCE
[MIT](https://opensource.org/licenses/MIT)