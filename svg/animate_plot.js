
if (false) {
  var draw = SVG('#svg8')
  //draw.rect(100,100).animate().fill('#f03').move(100,100)

  var rect = SVG('#rect815')
  //rect.fill('#000').animate().fill('#FFF').stroke('#0F0')
  rect.attr({ fill: '#ff0066' }).animate().attr({ x: 20, y: 60, fill: '#ff0066' }).size(20, 30).fill({ color: '#f06', opacity: 0.6 })

  console.log("draw:", draw);

  console.log("rect:", rect);
}

anime({
  targets: '#path821',
  /*
  points: [
    { value: 'm 29.482142,91.380952 c 0,0 15.119046,32.505958 41.577381,39.482138', }
  ],
  */
  //translateX: 250,
  //rotate: '1turn',
  d: 'm 29.482142,91.380952 c 0,0 15.119046,32.505958 41.577381,39.482138',
  //translateX: 25,
  backgroundColor: '#FFF',
  duration: 800
});