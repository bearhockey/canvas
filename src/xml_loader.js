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

  xml.ParseRoom = function(xmlData)
  {
    var objRoom =
    {
      label         : xmlData.getElementsByTagName("label")[0].innerHTML,
      doors         : xmlData.getElementsByTagName("doors")[0].innerHTML,
      defined_doors : xmlData.getElementsByTagName("defined_doors")[0].innerHTML,
      image         : xmlData.getElementsByTagName("room_image")[0].innerHTML,
      stairs        : xmlData.getElementsByTagName("stairs")[0].innerHTML
    };
    return objRoom;
  };

  return xml;
}());
