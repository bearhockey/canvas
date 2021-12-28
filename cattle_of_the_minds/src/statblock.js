var STATBLOCK = (function () {
  // main
  var statblock = function()
  {
    this.iLevel = 0;
    this.iLevelCurrent = 0;
    this.iXP = 0;

    this.iHealth = 0;
    this.iHealthCurrent = 0;
    this.iMana = 0;
    this.iManaCurrent = 0;

    this.iAttack = 0;
    this.iAttackCurrent = 0;
    this.iAccuracy = 0;
    this.iAccuracyCurrent = 0;
    this.iArmor = 0;
    this.iArmorCurrent = 0;

    this.iBrawn = 0;
    this.iBrawnCurrent = 0;
    this.iAgility = 0;
    this.iAgilityCurrent = 0;
    this.iIntellect = 0;
    this.iIntellectCurrent = 0;
    this.iWillpower = 0;
    this.iWillpowerCurrent = 0;

    // ----------------
    // GetStat
    //     Returns the correct stat
    // ----------------
    this.GetStat = function(iStatName)
    {
      var arrStatPair = [];
      switch (iStatName)
      {
        case CONST.STAT_LEVEL     : arrStatPair = [this.iLevelCurrent,     this.iLevel];     break;
        case CONST.STAT_HEALTH    : arrStatPair = [this.iHealthCurrent,    this.iHealth];    break;
        case CONST.STAT_MANA      : arrStatPair = [this.iManaCurrent,      this.iMana];      break;
        case CONST.STAT_ATTACK    : arrStatPair = [this.iAttackCurrent,    this.iAttack];    break;
        case CONST.STAT_ACCURACY  : arrStatPair = [this.iAccuracyCurrent,  this.iAccuracy];  break;
        case CONST.STAT_ARMOR     : arrStatPair = [this.iArmorCurrent,     this.iArmor];     break;
        case CONST.STAT_BRAWN     : arrStatPair = [this.iBrawnCurrent,     this.iBrawn];     break;
        case CONST.STAT_AGILITY   : arrStatPair = [this.iAgilityCurrent,   this.iAgility];   break;
        case CONST.STAT_INTELLECT : arrStatPair = [this.iIntellectCurrent, this.iIntellect]; break;
        case CONST.STAT_WILLPOWER : arrStatPair = [this.iWillpowerCurrent, this.iWillpower]; break;
        case CONST.STAT_XP        : arrStatPair = [this.iXP, this.iXP]; break; // special case - only one XP value
        default: break;
      } // end of switch

      return arrStatPair;
    };

    // ----------------
    // SetStat
    //     Sets the value of a specific stat
    // ----------------
    this.SetStat = function(iStatName, iStatValue, bSetCap=false)
    {
      switch (iStatName)
      {
        case CONST.STAT_XP:
        { this.iXP = iStatValue; break; }
        case CONST.STAT_LEVEL:
        { this.iLevelCurrent = iStatValue;     if (bSetCap) { this.iLevel = iStatValue; }     break; }
        case CONST.STAT_HEALTH:
        { this.iHealthCurrent = iStatValue;    if (bSetCap) { this.iHealth = iStatValue; }    break; }
        case CONST.STAT_MANA:
        { this.iManaCurrent = iStatValue;      if (bSetCap) { this.iMana = iStatValue; }      break; }
        case CONST.STAT_ATTACK:
        { this.iAttackCurrent = iStatValue;    if (bSetCap) { this.iAttack = iStatValue; }    break; }
        case CONST.STAT_ACCURACY:
        { this.iAccuracyCurrent = iStatValue;  if (bSetCap) { this.iAccuracy = iStatValue; }  break; }
        case CONST.STAT_ARMOR:
        { this.iArmorCurrent = iStatValue;     if (bSetCap) { this.iArmor = iStatValue; }     break; }
        case CONST.STAT_BRAWN:
        { this.iBrawnCurrent = iStatValue;     if (bSetCap) { this.iBrawn = iStatValue; }     break; }
        case CONST.STAT_AGILITY:
        { this.iAgilityCurrent = iStatValue;   if (bSetCap) { this.iAgility = iStatValue; }   break; }
        case CONST.STAT_INTELLECT:
        { this.iIntellectCurrent = iStatValue; if (bSetCap) { this.iIntellect = iStatValue; } break; }
        case CONST.STAT_WILLPOWER:
        { this.iWillpowerCurrent = iStatValue; if (bSetCap) { this.iWillpower = iStatValue; } break; }
        default: break;
      } // end of switch
    };

    // ----------------
    // AddStatBlock
    //     Adds the stat block to the current stat block
    // ----------------
    this.AddStatBlock = function(cStatBlock, bCopyCurrent=true)
    {
      if (cStatBlock != null)
      {
        this.iXP        += cStatBlock.iXP;
        this.iLevel     += cStatBlock.iLevel;
        this.iHealth    += cStatBlock.iHealth;
        this.iMana      += cStatBlock.iMana;
        this.iAttack    += cStatBlock.iAttack;
        this.iAccuracy  += cStatBlock.iAccuracy;
        this.iArmor     += cStatBlock.iArmor;
        this.iBrawn     += cStatBlock.iBrawn;
        this.iAgility   += cStatBlock.iAgility;
        this.iIntellect += cStatBlock.iIntellect;
        this.iWillpower += cStatBlock.iWillpower;
        if (bCopyCurrent)
        {
          this.iLevelCurrent     += cStatBlock.iLevelCurrent;
          this.iHealthCurrent    += cStatBlock.iHealthCurrent;
          this.iManaCurrent      += cStatBlock.iManaCurrent;
          this.iAttackCurrent    += cStatBlock.iAttackCurrent;
          this.iAccuracyCurrent  += cStatBlock.iAccuracyCurrent;
          this.iArmor            += cStatBlock.iArmorCurrent;
          this.iBrawnCurrent     += cStatBlock.iBrawnCurrent;
          this.iAgilityCurrent   += cStatBlock.iAgilityCurrent;
          this.iIntellectCurrent += cStatBlock.iIntellectCurrent;
          this.iWillpowerCurrent += cStatBlock.iWillpowerCurrent;
        }
      }
    };

    // ----------------
    // CapStats
    //     Goes through the stats and reduces any that have overreached their cap
    // ----------------
    this.CapStats = function()
    {
      if (this.iLevelCurrent     > this.iLevel)     { this.iLevelCurrent     = this.iLevel; }
      if (this.iHealthCurrent    > this.iHealth)    { this.iHealthCurrent    = this.iHealth; }
      if (this.iManaCurrent      > this.iMana)      { this.iManaCurrent      = this.iMana; }
      if (this.iAttackCurrent    > this.iAttack)    { this.iAttackCurrent    = this.iAttack; }
      if (this.iAccuracyCurrent  > this.iAccuracy)  { this.iAccuracyCurrent  = this.iAccuracy; }
      if (this.iArmorCurrent     > this.iArmor)     { this.iArmorCurrent     = this.iArmor; }
      if (this.iBrawnCurrent     > this.iBrawn)     { this.iBrawnCurrent     = this.iBrawn; }
      if (this.iAgilityCurrent   > this.iAgility)   { this.iAgilityCurrent   = this.iAgility; }
      if (this.iIntellectCurrent > this.iIntellect) { this.iIntellectCurrent = this.iIntellect; }
      if (this.iWillpowerCurrent > this.iWillpower) { this.iWillpowerCurrent = this.iWillpower; }
    };
  }; // end of class
  return statblock;
}());
