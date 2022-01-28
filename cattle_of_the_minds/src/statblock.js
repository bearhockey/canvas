var STATBLOCK = (function () {
  // main
  var statblock = function()
  {
    this.iLevel = 0;
    this.iXP = 0;
    this.iPoints = 0;

    this.iHealth = 0;
    this.iMana = 0;

    this.iAttack = 0;
    this.iAccuracy = 0;
    this.iArmor = 0;

    this.iStrength = 0;
    this.iDexterity = 0;
    this.iIntellect = 0;
    this.iConstitution = 0;

    // ----------------
    // GetStat
    //     Returns the correct stat
    // ----------------
    this.GetStat = function(iStatName)
    {
      var iValue = -1;
      switch (iStatName)
      {
        case CONST.STAT_LEVEL        : { iValue = this.iLevel;        break; }
        case CONST.STAT_HEALTH       : { iValue = this.iHealth;       break; }
        case CONST.STAT_MANA         : { iValue = this.iMana;         break; }
        case CONST.STAT_ATTACK       : { iValue = this.iAttack;       break; }
        case CONST.STAT_ACCURACY     : { iValue = this.iAccuracy;     break; }
        case CONST.STAT_ARMOR        : { iValue = this.iArmor;        break; }
        case CONST.STAT_STRENGTH     : { iValue = this.iStrength;     break; }
        case CONST.STAT_DEXTERITY    : { iValue = this.iDexterity;    break; }
        case CONST.STAT_INTELLECT    : { iValue = this.iIntellect;    break; }
        case CONST.STAT_CONSTITUTION : { iValue = this.iConstitution; break; }
        case CONST.STAT_XP           : { iValue = this.iXP;           break; }
        case CONST.STAT_POINTS       : { iValue = this.iPoints;       break; }
        default: break;
      } // end of switch

      return iValue;
    };

    // ----------------
    // SetStat
    //     Sets the value of a specific stat
    // ----------------
    this.SetStat = function(iStatName, iStatValue)
    {
      switch (iStatName)
      {
        case CONST.STAT_XP:           { this.iXP           = iStatValue; break; }
        case CONST.STAT_POINTS:       { this.iPoints       = iStatValue; break; }
        case CONST.STAT_LEVEL:        { this.iLevel        = iStatValue; break; }
        case CONST.STAT_HEALTH:       { this.iHealth       = iStatValue; break; }
        case CONST.STAT_MANA:         { this.iMana         = iStatValue; break; }
        case CONST.STAT_ATTACK:       { this.iAttack       = iStatValue; break; }
        case CONST.STAT_ACCURACY:     { this.iAccuracy     = iStatValue; break; }
        case CONST.STAT_ARMOR:        { this.iArmor        = iStatValue; break; }
        case CONST.STAT_STRENGTH:     { this.iStrength     = iStatValue; break; }
        case CONST.STAT_DEXTERITY:    { this.iDexterity    = iStatValue; break; }
        case CONST.STAT_INTELLECT:    { this.iIntellect    = iStatValue; break; }
        case CONST.STAT_CONSTITUTION: { this.iConstitution = iStatValue; break; }
        default: break;
      } // end of switch
    };

    // ----------------
    // AddStatBlock
    //     Adds the stat block to the current stat block
    // ----------------
    this.AddStatBlock = function(cStatBlock)
    {
      if (cStatBlock != null)
      {
        this.iXP           += cStatBlock.iXP;
        this.iPoints       += cStatBlock.iPoints;
        this.iLevel        += cStatBlock.iLevel;
        this.iHealth       += cStatBlock.iHealth;
        this.iMana         += cStatBlock.iMana;
        this.iAttack       += cStatBlock.iAttack;
        this.iAccuracy     += cStatBlock.iAccuracy;
        this.iArmor        += cStatBlock.iArmor;
        this.iStrength     += cStatBlock.iStrength;
        this.iDexterity    += cStatBlock.iDexterity;
        this.iIntellect    += cStatBlock.iIntellect;
        this.iConstitution += cStatBlock.iConstitution;
      }
    };
  }; // end of class
  return statblock;
}());
