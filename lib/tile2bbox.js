// get bbox from a z/x/y tile
// code gleaned from https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

function tile2long(x, z) {
  return (x/Math.pow(2,z)*360-180)
}

function tile2lat(y, z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z)
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))))
}

module.exports = function tile2bbox(x, y, z) {
  return [
    tile2long(x, z), 
    tile2lat(y, z), 
    tile2long(x + 1, z), 
    tile2lat(y + 1, z)  
  ]
}