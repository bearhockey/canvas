var D_ROOM = (function () {
  // consts

  var dr = {};

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
