var DEBUG = (function () {
  var dbg = {};

  // ----------------
  // DebugAddGold
  //     Adds some gold to the player's inventory
  // ----------------
  dbg.DebugAddGold = function()
  {
    GetHero().AddToInventory(PAWNUTILS.MakeGoldPile(100));
  };

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

  // ----------------
  // DebugHealHero
  //     Restores the hero health to max
  // ----------------
  dbg.DebugHealHero = function()
  {
    var cHero = GetHero();
    var iHealth = cHero.GetStat(CONST.STAT_HEALTH)[1];
    cHero.SetStat(CONST.STAT_HEALTH, iHealth, true);
  };

  // ----------------
  // DebugRevealMap
  //     Reveals the map
  // ----------------
  dbg.DebugRevealMap = function()
  {
    var arrTiles = GetFloor().GetAllTiles();
    var idx;
    var iLength = arrTiles.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      arrTiles[idx].bIsDiscovered = true;
    }
    Update();
  };

  return dbg;
}());
