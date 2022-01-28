var IBOX = (function () {
  // consts
  const PLAYER_LEVEL  = "playerLevel";
  const PLAYER_HEALTH = "playerHealth";
  const PLAYER_MANA   = "playerMana";
  const TIME_PASSED   = "playerTime";
  const LOCATION      = "playerLocation";
  var ibox = {};

  // ----------------
  // UpdateInfo
  //     Updates the character info box information
  // ----------------
  ibox.UpdateInfo = function()
  {
    var cHero = HERO.Get();
    if (cHero != null)
    {
      document.getElementById(PLAYER_LEVEL).innerHTML = cHero.GetStat(CONST.STAT_LEVEL).toString();
      var iCurrentHealth = cHero.GetStat(CONST.STAT_HEALTH);
      var iTotalHealth = cHero.GetStat(CONST.STAT_HEALTH, true);
      document.getElementById(PLAYER_HEALTH).innerHTML = UTILS.StatPairToText(iCurrentHealth, iTotalHealth);
      var iCurrentMana = cHero.GetStat(CONST.STAT_MANA);
      var iTotalMana = cHero.GetStat(CONST.STAT_MANA, true);
      document.getElementById(PLAYER_MANA).innerHTML = UTILS.StatPairToText(iCurrentMana, iTotalMana);
    }

    document.getElementById(TIME_PASSED).innerHTML = new Date(CLOCK.GetTime() * 1000).toISOString().substr(11, 8);
    document.getElementById(LOCATION).innerHTML = UTILS.GetLocation();
  };

  return ibox;
}());
