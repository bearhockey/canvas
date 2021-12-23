var UTILS = (function () {
  var utils = {};

  // ----------------
  // Roll1d6
  //     Simulates rolling one 6-sided dice
  // ----------------
  utils.Roll1d6 = function()
  {
    return Math.floor(Math.random()*6) + 1;
  };

  // ----------------
  // Roll2d6
  //     Simulates rolling two 6-sided dice
  // ----------------
  utils.Roll2d6 = function()
  {
    return utils.Roll1d6() + utils.Roll1d6();
  };

  // ----------------
  // GetRandomDirection
  //     Returns a random cardinal direction
  // ----------------
  utils.GetRandomDirection = function()
  {
    return Math.floor(Math.random()*4);
  };

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

  // ----------------
  // CountWalls
  //     Pass in an array of tiles and get the number of walls (is passible) tiles
  // ----------------
  utils.CountWalls = function(arrTiles, cFloor)
  {
    var iWalls = 0;
    var idx;
    var iLength = arrTiles.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      if (arrTiles[idx] != null && !arrTiles[idx].IsPassable()) { iWalls++; }
    } // end for loop

    return iWalls;
  };

  // ----------------
  // StatPairToText
  //     Feeds in an array of a stat (current, total) and outputs in the standard format X [y]
  // ----------------
  utils.StatPairToText = function(arrStat)
  {
    return arrStat[0].toString() + " [" + arrStat[1].toString() + "]";
  };

  // ----------------
  // GetHealthLevel
  //     Translates the level of health of the enemy into a readible format
  // ----------------
  utils.GetHealthLevel = function(iHealthCurrent, iHealthTotal)
  {
    var str;
    if (iHealthCurrent == iHealthTotal) { str = STRING.HEALTH_UNHARMED; }
    else if (iHealthCurrent > iHealthTotal*0.8) { str = STRING.HEALTH_BRUISED; }
    else if (iHealthCurrent > iHealthTotal*0.5) { str = STRING.HEALTH_INJURED; }
    else if (iHealthCurrent > iHealthTotal*0.2) { str = STRING.HEALTH_SERIOUS; }
    else                                        { str = STRING.HEALTH_CRITICAL; }

    return str;
  };


  return utils;
}());
