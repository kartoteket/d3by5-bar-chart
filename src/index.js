import BarChart from './BarChart';

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
                      {"values": 1,"label": "Zimbabwe"}];


const groupedData = [{"label":"Jan","values":[
                                                  {"label":"Syria","values":512},
                                                  {"label":"Afghanistan","values":2768}
                                                  ]},
                    {"label":"Feb","values":[
                                                  {"label":"Syria","values":456},
                                                  {"label":"Afghanistan","values":2544}
                                                  ]},
                    {"label":"March","values":[
                                                  {"label":"Syria","values":520},
                                                  {"label":"Afghanistan","values":2416}
                                                  ]},
                    {"label":"Apr","values":[
                                                  {"label":"Syria","values":452},
                                                  {"label":"Afghanistan","values":2056}
                                                  ]},
                    {"label":"May","values":[
                                                  {"label":"Syria","values":540},
                                                  {"label":"Afghanistan","values":1844}
                                                  ]},
                    {"label":"June","values":[
                                                  {"label":"Syria","values":624},
                                                  {"label":"Afghanistan","values":2248}
                                                  ]},
                    {"label":"July","values":[
                                                  {"label":"Syria","values":612},
                                                  {"label":"Afghanistan","values":2960}
                                                  ]},
                    {"label":"Aug","values":[
                                                  {"label":"Syria","values":832},
                                                  {"label":"Afghanistan","values":3416}
                                                  ]},
                    {"label":"Sept","values":[
                                                  {"label":"Syria","values":684},
                                                  {"label":"Afghanistan","values":2284}
                                                  ]},
                    {"label":"Oct","values":[
                                                  {"label":"Syria","values":648},
                                                  {"label":"Afghanistan","values":2268}
                                                  ]},
                    {"label":"Nov","values":[
                                                  {"label":"Syria","values":520},
                                                  {"label":"Afghanistan","values":1988}
                                                  ]},
                    {"label":"Dec","values":[
                                                  {"label":"Syria","values":604},
                                                  {"label":"Afghanistan","values":2384}
                                                  ]}];
const chart1 = document.getElementById('chart1');
const chart2 = document.getElementById('chart2');

// create simple chart
new BarChart().width(520)
              .height(300)
              .margin(0,10,20,60)
              .data(groupedData)
              .draw(chart1);

// create chart with options
new BarChart().width(520)
              .height(300)
              .barLayout('stacked')
              .anchor('left')
              .margin(0,60,20,10)
              .color({'Afghanistan': '#e94f37', 'Syria': '#21c5c1'})
              .data(groupedData)
              .axis.x.show(true)
                      .align('right')
                      .exit() // call exit to return control to barchart
              .axis.y.show(true)
                      .label('number of people')
                      .ticks(3)
                      .align('bottom')
                      .exit() // call exit to return control to barchart
              .draw(chart2);