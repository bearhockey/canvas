var STORE = (function () {
  // consts

  // main
  var store = {};
  store.m_cOpenStoreButton = new BUTTON(0, 860, 250, 50, "Visit Store", store.OpenStore);
  store.m_mapStores = {};

  store.GetStore = function(strKey)
  {
    if (strKey in store.m_mapStores)
    {
      return store.m_mapStores[strKey];
    }

    return null;
  };

  store.SetStore = function(strKey, cStore)
  {
    store.m_mapStores[strKey] = cStore;
  };

  // ----------------
  // VisitStore
  //     Opens up a dialog to show the store screen
  // ----------------
  store.VisitStore = function()
  {
    var cButton = new BUTTON(0, 860, 250, 50, "Visit Store", store.OpenStore);
    DIALOG.OpenDialog("./res/screen/blacksmith.png", 900, 600, "#000000", [cButton]);
  };

  // ----------------
  // OpenStore
  //     Opens the inventory to show the store items
  // ----------------
  store.OpenStore = function()
  {
    STATE.SetState(STATE.STATE_INVENTORY);
  };

  return store;
}());
