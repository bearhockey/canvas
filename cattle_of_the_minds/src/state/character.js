var CHARACTER = (function () {
  // consts
  const STAT_FONT = "20px sans";
  const STAT_SPACE = 100;
  var character = {};
  character.m_cStatBlock = null;
  character.m_mapStatPositions =
  {
    1 : [150, 150],
    2 : [150, 200],
    3  : [150, 250]
  };

  // ----------------
  // Init
  //     Inits the character renderer
  // ----------------
  character.Init = function()
  {

  };

  // ----------------
  // Update
  //     Updates the character for drawing later
  // ----------------
  character.Update = function()
  {

  };

  // ----------------
  // Draw
  //     Draws the character screen
  // ----------------
  character.Draw = function(ctx)
  {
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(100, 100, 760, 760);

    ctx.font = STAT_FONT;
    ctx.fillStyle = "#111122";

    character.m_cStatBlock = GetHero().cTotalStats; // put this in update probably
    character.DrawStat(ctx, CONST.STAT_LEVEL, "Level");
    character.DrawStat(ctx, CONST.STAT_HEALTH, "Health");
    character.DrawStat(ctx, CONST.STAT_MANA, "Mana");

  };

  // ----------------
  // DrawStat
  //     Draws a specified stat to the screen
  // ----------------
  character.DrawStat = function(ctx, iStat, strName)
  {
    var iX = character.m_mapStatPositions[iStat][0];
    var iY = character.m_mapStatPositions[iStat][1];
    ctx.fillText(strName, iX, iY);
    ctx.fillText(UTILS.StatPairToText(character.m_cStatBlock.GetStat(iStat)), iX + STAT_SPACE, iY);
  };

  return character;
}());
