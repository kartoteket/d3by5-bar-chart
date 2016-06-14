# d3by5-bar-graph
The d3by5-bar-graph is part of the d3by5 graph tools, this specific package will draw a pie chart based on Mike Bostocks [Towards Reusable Charts](https://bost.ocks.org/mike/chart/)

## NOTE
This is an internal project, you are probably better off using somethin like [C3](https://github.com/c3js/c3). That said, just give it a try and contact us back if you have any issues (no capslock please).

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
Theree dependencies in package.json
* Underscore
* d3
* d3by5-base-chart. The base-chart is not an npm module, get it [here](https://github.com/kartoteket/d3by5-base-chart) The package json looks for it in the sibling repo, and attempts for link it, You can change that in the Package json
```json
"scripts": {
    "preinstall": "npm link ../d3by5-base-chart",
    "preupdate": "npm link ../d3by5-base-chart"
}
```

After updating linkage
```
npm install
```
will get you everything else you need

## API
The bar chart uses the [Base chart](https://github.com/kartoteket/d3by5-base-chart) for all getters and setters, and adds the following methods for manipulating view and state.
* **anchor** - {String} - the direction of the graph from where it is achored ('top' | 'bottom' | 'left' | 'right') (defaults to ('bottom'))
* **label** - {String} - where to position the labels ('fit' | 'none' | 'axis')


## EXAMPLE
All methods are chained, you can simply instanciate a new bar graph like this

```javascript
var bar = require('d3by5-bar-graph');

var bargraph = bargraph()
                    .width(500)
                    .height(400)
                    .data([{label:'coffee', values: 509}, {label:'tea', values: 1}]);
var caller = _.bind(bargraph.init, bargraph);

d3.select('.js-bar-graph')
    .call(caller);

// alternate syntax
var selection =) d3.select('.js-bar-graph');
bargraph.init(selection)
```

## LICENCE
[MIT](https://opensource.org/licenses/MIT)