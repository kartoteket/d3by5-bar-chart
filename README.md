# d3by5-bar-chart
The d3by5-bar-chart is part of the d3by5 graph tools, this specific package will draw a pie chart based on Mike Bostocks [Towards Reusable Charts](https://bost.ocks.org/mike/chart/)

## NOTE
This is an internal project, you are probably better off using somethin like [C3](https://github.com/c3js/c3). That said, just give it a try and contact us back if you have any issues (no capslock please).

## USAGE

### Building

set up all dependencies
```bash
npm install
```

`Tree Shaking`
If you want to minimise import sizes for lodash, create ES6 modules first, running from project root
```bash
./node_modules/lodash-cli/bin/lodash modularize exports=es -o ./node_modules/lodash-es/
```


Build the project by running
```bash
npm run build
```
This will output to the docs folder `js/app.js` is the application code

### Running

The project is built with webpack and is bundled with webpack-dev-server.

run the server by issuing
```bash
npm start
```
This will start the server on `http://localhost:8080` and serve files from docs



## API
The bar chart uses the [Base chart](https://github.com/kartoteket/d3by5-base-chart) for all getters and setters, and adds the following methods for manipulating view and state.
* **anchor** - {String} - the direction of the graph from where it is achored ('top' | 'bottom' | 'left' | 'right') (defaults to ('bottom'))
* **label** - {String} - where to position the labels ('fit' | 'none' | 'axis')
* **barLayout** - {String} - how to display multiple series ('stacked' | 'grouped')


## EXAMPLE
All methods are chained, you can simply instanciate a new bar graph like this

```javascript
import barchart from 'BarChart'

const chart = document.getElementById('.chart')
// create simple chart
new BarChart().width(520)
              .height(300)
              .margin(0,10,20,60)
              .data([{label:'coffee', values: 509}, {label:'tea', values: 1}])
              .draw(chart);

```

see the exaples in docs/index.html

Just run the app.

## LICENCE
[MIT](https://opensource.org/licenses/MIT)