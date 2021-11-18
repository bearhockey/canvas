var STATBLOCK = (function () {
  // main
  var statblock = function()
  {
    this.iLevel = 0;
    this.iHealth = 0;
    this.iMana = 0;
    this.iAttack = 0;
    this.iAccuracy = 0;
    this.iDexterity = 0;
    this.iIntellect = 0;
    this.iConstitution = 0;

    // ----------------
    // GetStat
    //     Returns the correct stat
    // ----------------
    this.GetStat = function(iStatName)
    {
      var iStatValue = -1;
      switch (iStatName)
      {
        case CONST.STAT_LEVEL:  iStatValue = this.iLevel;  break;
        case CONST.STAT_HEALTH: iStatValue = this.iHealth; break;
        case CONST.STAT_MANA:   iStatValue = this.iMana;   break;
        default: break;
      } // end of switch

      return iStatValue;
    };

    // ----------------
    // SetStat
    //     Sets the value of a specific stat
    // ----------------
    this.SetStat = function(iStatName, iStatValue)
    {
      switch (iStatName)
      {
        case CONST.STAT_LEVEL:  this.iLevel  = iStatValue; break;
        case CONST.STAT_HEALTH: this.iHealth = iStatValue; break;
        case CONST.STAT_MANA:   this.iMana   = iStatValue; break;
        default: break;
      } // end of switch
    };
  };
  return statblock;
}());
