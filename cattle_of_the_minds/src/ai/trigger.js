var TRIGGER = (function () {
  // consts
  // main
  var trigger = function(fnCallback=null)
  {
    this.iReactionTime = 0;
    this.fnTrigger = fnCallback;
    this.bTriggered = false;

    // ----------------
    // Act
    //     The trigger is activated
    // ----------------
    this.Act = function(cPawn)
    {
      var cHero = HERO.Get();
      var iHeroPosition = cHero.GetTile().GetIdx();
      var iPosition = cPawn.GetTile().GetIdx();
      if (iHeroPosition == iPosition)
      {
        if (!this.bTriggered && this.fnTrigger != null && typeof this.fnTrigger === 'function')
        {
          this.bTriggered = true;
          this.fnTrigger();
        }
      }
      else
      {
        this.bTriggered = false;
      }
    };
  }; // end of class

  return trigger;
}());
