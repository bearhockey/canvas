var UTILS = (function () {
  var utils = {};

  // ----------------
  // GetIdxFromTiles
  //     Pass in an array of tiles and get an array of the idx values of each
  // ----------------
  utils.GetIdxFromTiles = function(arrTiles)
  {
    var arrIndicies = [];
    var idx;
    var cTile;
    var iLength = arrTiles.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      cTile = arrTiles[idx];
      if (cTile != null && typeof cTile.GetIdx === 'function')
      {
        arrIndicies.push(cTile.GetIdx());
      }
    } // end for loop

    return arrIndicies;
  };

  return utils;
}());
