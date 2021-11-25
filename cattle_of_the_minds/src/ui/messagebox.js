var MBOX = (function () {
  var mbox = {};

  // ----------------
  // AddInfo
  //     Adds a line of text to the bottom text box
  // ----------------
  mbox.AddInfo = function(strLine)
  {
    var strExisting = document.getElementById('divText').innerHTML;
    document.getElementById('divText').innerHTML = strLine + "<br>" + strExisting;
  };

  return mbox;
}());
