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


const groupedData = [{"label":"Jan 2008","values":[
                                                  {"label":"Syria","values":428},
                                                  {"label":"Afghanistan","values":488}
                                                  ]},
                    {"label":"Feb 2008","values":[
                                                  {"label":"Syria","values":472},
                                                  {"label":"Afghanistan","values":372}
                                                  ]},
                    {"label":"Mar 2008","values":[
                                                  {"label":"Syria","values":368},
                                                  {"label":"Afghanistan","values":184}
                                                  ]},
                    {"label":"Apr 2008","values":[
                                                  {"label":"Syria","values":428},
                                                  {"label":"Afghanistan","values":260}
                                                  ]},
                    {"label":"May 2008","values":[
                                                  {"label":"Syria","values":352},
                                                  {"label":"Afghanistan","values":244}
                                                  ]},
                    {"label":"Jun 2008","values":[
                                                  {"label":"Syria","values":372},
                                                  {"label":"Afghanistan","values":308}
                                                  ]},
                    {"label":"Jul 2008","values":[
                                                  {"label":"Syria","values":516},
                                                  {"label":"Afghanistan","values":332}
                                                  ]},
                    {"label":"Aug 2008","values":[
                                                  {"label":"Syria","values":484},
                                                  {"label":"Afghanistan","values":620}
                                                  ]},
                    {"label":"Sep 2008","values":[
                                                  {"label":"Syria","values":476},
                                                  {"label":"Afghanistan","values":836}
                                                  ]},
                    {"label":"Oct 2008","values":[
                                                  {"label":"Syria","values":528},
                                                  {"label":"Afghanistan","values":688}
                                                  ]},
                    {"label":"Nov 2008","values":[
                                                  {"label":"Syria","values":372},
                                                  {"label":"Afghanistan","values":604}
                                                  ]},
                    {"label":"Dec 2008","values":[
                                                  {"label":"Syria","values":384},
                                                  {"label":"Afghanistan","values":800}
                                                  ]},
                    {"label":"Jan 2009","values":[
                                                  {"label":"Syria","values":436},
                                                  {"label":"Afghanistan","values":1648}
                                                  ]},
                    {"label":"Feb 2009","values":[
                                                  {"label":"Syria","values":532},
                                                  {"label":"Afghanistan","values":1204}
                                                  ]},
                    {"label":"Mar 2009","values":[
                                                  {"label":"Syria","values":372},
                                                  {"label":"Afghanistan","values":1024}
                                                  ]},
                    {"label":"Apr 2009","values":[
                                                  {"label":"Syria","values":384},
                                                  {"label":"Afghanistan","values":872}
                                                  ]},
                    {"label":"May 2009","values":[
                                                  {"label":"Syria","values":404},
                                                  {"label":"Afghanistan","values":1052}
                                                  ]},
                    {"label":"Jun 2009","values":[
                                                  {"label":"Syria","values":368},
                                                  {"label":"Afghanistan","values":1276}
                                                  ]},
                    {"label":"Jul 2009","values":[
                                                  {"label":"Syria","values":504},
                                                  {"label":"Afghanistan","values":1804}
                                                  ]},
                    {"label":"Aug 2009","values":[
                                                  {"label":"Syria","values":436},
                                                  {"label":"Afghanistan","values":2024}
                                                  ]},
                    {"label":"Sep 2009","values":[
                                                  {"label":"Syria","values":484},
                                                  {"label":"Afghanistan","values":2188}
                                                  ]},
                    {"label":"Oct 2009","values":[
                                                  {"label":"Syria","values":708},
                                                  {"label":"Afghanistan","values":2284}
                                                  ]},
                    {"label":"Nov 2009","values":[
                                                  {"label":"Syria","values":568},
                                                  {"label":"Afghanistan","values":2580}
                                                  ]},
                    {"label":"Dec 2009","values":[
                                                  {"label":"Syria","values":428},
                                                  {"label":"Afghanistan","values":2320}
                                                  ]},
                    {"label":"Jan 2010","values":[
                                                  {"label":"Syria","values":512},
                                                  {"label":"Afghanistan","values":2768}
                                                  ]},
                    {"label":"Feb 2010","values":[
                                                  {"label":"Syria","values":456},
                                                  {"label":"Afghanistan","values":2544}
                                                  ]},
                    {"label":"Mar 2010","values":[
                                                  {"label":"Syria","values":520},
                                                  {"label":"Afghanistan","values":2416}
                                                  ]},
                    {"label":"Apr 2010","values":[
                                                  {"label":"Syria","values":452},
                                                  {"label":"Afghanistan","values":2056}
                                                  ]},
                    {"label":"May 2010","values":[
                                                  {"label":"Syria","values":540},
                                                  {"label":"Afghanistan","values":1844}
                                                  ]},
                    {"label":"Jun 2010","values":[
                                                  {"label":"Syria","values":624},
                                                  {"label":"Afghanistan","values":2248}
                                                  ]},
                    {"label":"Jul 2010","values":[
                                                  {"label":"Syria","values":612},
                                                  {"label":"Afghanistan","values":2960}
                                                  ]},
                    {"label":"Aug 2010","values":[
                                                  {"label":"Syria","values":832},
                                                  {"label":"Afghanistan","values":3416}
                                                  ]},
                    {"label":"Sep 2010","values":[
                                                  {"label":"Syria","values":684},
                                                  {"label":"Afghanistan","values":2284}
                                                  ]},
                    {"label":"Oct 2010","values":[
                                                  {"label":"Syria","values":648},
                                                  {"label":"Afghanistan","values":2268}
                                                  ]},
                    {"label":"Nov 2010","values":[
                                                  {"label":"Syria","values":520},
                                                  {"label":"Afghanistan","values":1988}
                                                  ]},
                    {"label":"Dec 2010","values":[
                                                  {"label":"Syria","values":604},
                                                  {"label":"Afghanistan","values":2384}
                                                  ]}];

// create
new BarChart().width(700)
              .height(500)
              .barLayout('stacked')
              .anchor('bottom')
              .margin(0,10,70,70)
              .color({'Afghanistan': '#e94f37', 'Syria': '#21c5c1'})
              .data(groupedData)
              .axis.x.show(true)
                      .rotate(70)
                      .exit() // call exit to return control to barchart
              .axis.y.show(true)
                      .label('number of people')
                      .ticks({count: 5})
                      .exit() // call exit to return control to barchart
              .draw(document.getElementById('chart1'));