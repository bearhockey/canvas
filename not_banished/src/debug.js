var DEBUG = (function () {
  var d = {};

  d.PrintNodeInfo = function()
  {
    var objData = SIDEPANEL.GetObjData();

    if (objData != null && objData.cNode != null)
    {
      console.debug(objData.cNode.Print());
      SIDEPANEL.UpdateTextArea(objData.cNode.Print(), false);
    }

  };

  return d;
}());
