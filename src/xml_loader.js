var XML = (function () {
  var xml = {};

  xml.fnCallback = null;

  xml.xhttp = new XMLHttpRequest();
  xml.xhttp.overrideMimeType('application/xml');
  xml.xhttp.onreadystatechange = function()
  {
    if (this.readyState == 4)
    {
      xml.xmlDoc = this.responseXML;
      if (xml.fnCallback != null) { xml.fnCallback(); }
      else
      {
        alert("Function callback for XML.Load is null so game will not load!");
      }
    }
  };

  xml.Load = function(fnCallback)
  {
    xml.fnCallback = fnCallback;
    xml.LoadRooms();
  };

  xml.LoadRooms = function()
  {
    xml.xhttp.open("GET", "./data/room_data.xml", true);
    xml.xhttp.send();
  };

  return xml;
}());
