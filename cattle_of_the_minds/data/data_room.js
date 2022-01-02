var D_ROOM = (function () {
  // consts

  var dr = {};

  // ----------------
  // RandomPregenRoomRoom
  //     Builds one of the random pregen rooms
  // ----------------
  dr.RandomPregenRoom = function(cFloor, x, y, bLit=false)
  {
    var iResult = UTILS.Roll1d6();
    var iExit = -1;
    switch (iResult)
    {
      case 1:
      {
        iExit = dr.CrossRoom(cFloor, x, y, bLit);
        break;
      }
      default: break;
    } // end of switch

    return iExit;
  };

  // ----------------
  // CrossRoom
  //     Builds a room in the shape of a 9x9 cross
  // ----------------
  dr.CrossRoom = function(cFloor, x, y, bLit=false)
  {
    if (cFloor == null) { return -1; }

    var strRoomColor = (bLit) ? CONST.TILE_LIT : CONST.TILE_EMPTY;
    var cFloorTile = new TILE(-1, true, bLit, CONST.SHAPE_SQUARE, strRoomColor);
    cFloor.FillFloorSection(x+3, y, 3, 9, cFloorTile);
    cFloor.FillFloorSection(x, y+3, 9, 3, cFloorTile);

    var arrExits = [cFloor.GetIdxFromCords(x+4, y),
                    cFloor.GetIdxFromCords(x+4, y+8),
                    cFloor.GetIdxFromCords(x, y+4),
                    cFloor.GetIdxFromCords(x+8, y+4)];

    return arrExits[Math.floor(Math.random()*arrExits.length)];
  };

  return dr;
}());
