var TAB = (function () {
  // consts
  // main
  var tab = function(iTab, strLabel="", bIsHidden=false)
  {
    this.id = "uiTab_" + iTab.toString();
    this.iTab = iTab;
    this.strLabel = strLabel;
    this.bIsHidden = bIsHidden;

    this.GetDomID = function() { return this.id; };
    this.GetTabID = function() { return this.iTab; };

    this.ChangeTab = function()
    {
      SIDEPANEL.SetCurrentTab(this.iTab);
    };

  }; // end class

  return tab;
}());
