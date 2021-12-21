var STORE = (function () {
  // consts

  // main
  var store = {};
  // game states
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

  return store;
}());
