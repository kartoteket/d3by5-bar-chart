import BarChart from './BarChart';
import d3 from 'd3';
import TestClass from './testclass';

const singleData = [  {"values": 864,"label": "Afghanistan"},
                      {"values": 2,"label": "Albania"},
                      {"values": 36,"label": "Algeria"},
                      {"values": 2,"label": "Azerbaijan"},
                      {"values": 552,"label": "Bangladesh"},
                      {"values": 1,"label": "Benin"},
                      {"values": 4,"label": "Burkina Faso"},
                      {"values": 1,"label": "Cameroon"},
                      {"values": 1,"label": "Chad"},
                      {"values": 5,"label": "Côte D'ivoire"},
                      {"values": 827,"label": "Egypt"},
                      {"values": 1161,"label": "Eritrea"},
                      {"values": 84,"label": "Ethiopia"},
                      {"values": 242,"label": "Gambia"},
                      {"values": 15,"label": "Ghana"},
                      {"values": 25,"label": "Guinea"},
                      {"values": 6,"label": "Guinea-Bissau"},
                      {"values": 74,"label": "India"},
                      {"values": 85,"label": "Iran"},
                      {"values": 124,"label": "Iraq"},
                      {"values": 1,"label": "Jamaica"},
                      {"values": 1,"label": "Latvia"},
                      {"values": 1,"label": "Liberia"},
                      {"values": 20,"label": "Libya"},
                      {"values": 184,"label": "Mali"},
                      {"values": 79,"label": "Morocco"},
                      {"values": 1,"label": "Nepal"},
                      {"values": 3,"label": "Niger"},
                      {"values": 259,"label": "Nigeria"},
                      {"values": 1198,"label": "Pakistan"},
                      {"values": 32,"label": "Palestine"},
                      {"values": 0,"label": "Romania"},
                      {"values": 1,"label": "Russia"},
                      {"values": 48,"label": "Senegal"},
                      {"values": 4,"label": "Sierra Leone"},
                      {"values": 1292,"label": "Somalia"},
                      {"values": 17,"label": "Sudan"},
                      {"values": 393,"label": "Syria"},
                      {"values": 4,"label": "Togo"},
                      {"values": 2147,"label": "Tunisia"},
                      {"values": 48,"label": "Turkey"},
                      {"values": 7,"label": "Ukraine"},
                      {"values": 1,"label": "Zimbabwe"}]

let selection = d3.select('.js-bar-chart');

let testClass = new TestClass();
let barChart = new BarChart();

testClass.first('here').second(20).third();

barChart.width(700)
        .height(500)
        // .valuesPosition('fit')
        .barLayout('stacked')
        .anchor('bottom')
        .margin(0,0,50,50)
        .data(singleData)
        .draw(selection);
