var XML = (function () {
  var xml = {};

  xml.xhttp = new XMLHttpRequest();
  xml.xhttp.overrideMimeType('application/xml');
  xml.xhttp.onreadystatechange = function()
  {
    console.log("READY:");
    if (this.readyState == 4 && this.status == 200)
    {
      xml.xmlDoc = this.responseXML;
      console.log("READY:");
    }
  };

  xml.LoadRooms = function()
  {
    console.log("Open");
    xml.xhttp.open("GET", "./data/room_data.xml", true);
    xml.xhttp.send();
    console.log("Send");
  };

  return xml;
}());
