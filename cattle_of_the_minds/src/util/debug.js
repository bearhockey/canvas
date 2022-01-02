var DEBUG = (function () {
  var dbg = {};

  // ----------------
  // DebugAddGold
  //     Adds some gold to the player's inventory
  // ----------------
  dbg.DebugAddGold = function()
  {
    HERO.Get().AddToInventory(PAWNUTILS.MakeGoldPile(100));
  };

  // ----------------
  // DebugGetIdx
  //     Returns some stats on where the current hero pawn is located
  // ----------------
  dbg.DebugGetIdx = function()
  {
    var idx = HERO.Get().GetTile().GetIdx();
    var iWidth = DUNGEON.GetFloor().GetFloorWidth();
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
    var cHero = HERO.Get();
    var iHealth = cHero.GetStat(CONST.STAT_HEALTH)[1];
    cHero.SetStat(CONST.STAT_HEALTH, iHealth, true);
  };

  // ----------------
  // DebugRevealMap
  //     Reveals the map
  // ----------------
  dbg.DebugRevealMap = function()
  {
    var arrTiles = DUNGEON.GetFloor().GetAllTiles();
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
