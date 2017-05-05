export default class NextClass {
	constructor () {
    this.defaultStuff = {
      one: 1,
      two: 2,
      random: 5
    };
  }

  third () {
    console.log('third');
    return this;
  }

}