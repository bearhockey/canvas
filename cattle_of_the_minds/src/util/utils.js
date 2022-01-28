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
  utils.StatPairToText = function(iCurrentValue, iTotalValue)
  {
    return iCurrentValue.toString() + " [" + iTotalValue.toString() + "]";
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

  // ----------------
  // GetCenterCord
  //     Returns the proper x/y cordinate based on the screen size and the size of the side to position it centered
  // ----------------
  utils.GetCenterCord = function(iLength)
  {
    return (GetCanvasWidth()/2)-(iLength/2);
  };

  // ----------------
  // WrapText
  //     Writes out text and wraps it - https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
  // ----------------
  utils.WrapText = function(ctx, strText, x, y, iMaxWidth, iLineHeight)
  {
    var arrWords = strText.split(' ');
    var strLine = '';

    var strTestLine;
    var cMetrics;
    var iTestWidth;

    var idx;
    var iWordsLength = arrWords.length;
    for (idx = 0; idx < iWordsLength; ++idx)
    {
      strTestLine = strLine + arrWords[idx] + " ";
      cMetrics = ctx.measureText(strTestLine);
      iTestWidth =  cMetrics.width;
      if (iTestWidth > iMaxWidth && idx > 0)
      {
        ctx.fillText(strLine, x, y);
        strLine = arrWords[idx] + ' ';
        y += iLineHeight;
      }
      else
      {
        strLine = strTestLine;
      }
    } // end for loop

    ctx.fillText(strLine, x, y);
  };

  // ----------------
  // GetLocation
  //     Translates the current floor to a text string
  // ----------------
  utils.GetLocation = function()
  {
    var iFloorLevel = DUNGEON.GetCurrentFloorIdx();
    var strLabel = (iFloorLevel == 0) ? "Town" : "Dungeon Level " + iFloorLevel.toString();
    return strLabel;
  };

  // ----------------
  // DrawBevel
  //     Draws a bevelled rectangle given a rectangle object and a color object
  //     objColor expects .color .highlight and .shadow
  // ----------------
  utils.DrawBevel = function(ctx, rRect, objColor, iLineWidth=4)
  {
    ctx.fillStyle = objColor.color;
    ctx.fillRect(rRect.x, rRect.y, rRect.width, rRect.height);
    ctx.beginPath();
    ctx.lineWidth = iLineWidth;
    ctx.strokeStyle = objColor.highlight;
    ctx.moveTo(rRect.x, rRect.y + rRect.height);
    ctx.lineTo(rRect.x, rRect.y);
    ctx.lineTo(rRect.x + rRect.width, rRect.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = objColor.shadow;
    ctx.moveTo(rRect.x, rRect.y + rRect.height);
    ctx.lineTo(rRect.x + rRect.width, rRect.y + rRect.height);
    ctx.lineTo(rRect.x + rRect.width, rRect.y);
    ctx.stroke();
    ctx.closePath();
  };

  return utils;
}());
