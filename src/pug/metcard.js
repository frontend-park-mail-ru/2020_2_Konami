const pug = require('pug');

const compiledFunction = pug.compileFile('./metcard.pug');

console.log(compiledFunction.toString());

console.log(compiledFunction({
  id: 5,
  imgSrc: 7,
  text: 5,
  title: 5,
  place: 3,
  tags: [1, 2, 3, 4],
  dateSrc: 4,
}));

function bob() {
  let a;
  console.log(a++);
}
