var IBOX = (function () {
  // consts
  const PLAYER_LEVEL = "playerLevel";
  const PLAYER_HEALTH = "playerHealth";
  const PLAYER_MANA = "playerMana";
  const TIME_PASSED = "playerTime";
  var ibox = {};

  // ----------------
  // UpdateInfo
  //     Updates the character info box information
  // ----------------
  ibox.UpdateInfo = function()
  {
    var cHero = GetHero();
    if (cHero != null)
    {
      document.getElementById(PLAYER_LEVEL).innerHTML = cHero.GetStat(CONST.STAT_LEVEL)[0].toString();
      var arrHealth = cHero.GetStat(CONST.STAT_HEALTH);
      document.getElementById(PLAYER_HEALTH).innerHTML = UTILS.StatPairToText(arrHealth);
      var arrMana = cHero.GetStat(CONST.STAT_MANA);
      document.getElementById(PLAYER_MANA).innerHTML = UTILS.StatPairToText(arrMana);
    }
    
    document.getElementById(TIME_PASSED).innerHTML = new Date(GetTime() * 1000).toISOString().substr(11, 8);
  };

  return ibox;
}());
