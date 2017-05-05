import NextClass from './NextClass';

export default class TestClass extends NextClass {
  constructor () {
    super();
    this.whatever = 'whaterver';
  }

  first () {
    console.log('first');
    return this;
  }

  second () {
    console.log('second');
    return this;
  }
}