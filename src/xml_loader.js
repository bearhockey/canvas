var XML = (function () {
  var xml = {};

  xml.xhttp = new XMLHttpRequest();
  xml.xhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      var xmlDoc = this.responseXML;
    }
  };

  xml.LoadRooms = function()
  {
    xml.xhttp.open("GET", "./data/room_data.xml", true);
    xml.xhttp.send();
  };

  return xml;
}());
