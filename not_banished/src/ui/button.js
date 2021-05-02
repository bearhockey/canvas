var BUTTON = (function () {
  // consts
  const DEFAULT_OUTLINE = "#CCCCDD";
  const DEFAULT_COLOR = "#8888AA";
  const DEFAULT_HIGHLIGHT = "#AAAACC";
  const DEFAULT_TEXT_COLOR = "#222233";
  // main
  var button = function(strLabel, fnAction = null)
  {
    this.id = "uiButton_" + strLabel;
    this.strLabel = strLabel;
    this.fnAction = fnAction;

    this.GetDomID = function() { return this.id; };

    this.Action = function()
    {
      console.debug("Action()");
      if (this.fnAction != null) { this.fnAction(SIDEPANEL.GetObjData()); }
    };

    this.Draw = function(ctx)
    {

    };
  }; // end class

  return button;
}());
