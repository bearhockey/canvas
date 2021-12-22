var DEBUG = (function () {
  var dbg = {};

  // ----------------
  // DebugGetIdx
  //     Returns some stats on where the current hero pawn is located
  // ----------------
  dbg.DebugGetIdx = function()
  {
    var idx = GetHero().GetTile().GetIdx();
    var iWidth = GetFloor().GetFloorWidth();
    var str = "IDX: " + idx.toString() + " X: " + (idx % iWidth).toString() + " Y: " + Math.floor(idx / iWidth).toString();
    console.log(str);
    MBOX.AddInfo(str)
  };

  return dbg;
}());
