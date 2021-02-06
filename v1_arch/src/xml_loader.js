var XML = (function () {
  var xml = {};
  var arrXMLData = [];
  var arrFiles = ["./data/room_data.xml", "./data/item_data.xml", "./data/event_data.xml"];
  var iCurrentType;

  xml.XML_ROOMS = 0;
  xml.XML_ITEMS = 1;
  xml.XML_EVENTS = 2;
  xml.fnCallback = null;

  xml.xhttp = new XMLHttpRequest();
  xml.xhttp.overrideMimeType('application/xml');
  xml.xhttp.onreadystatechange = function()
  {
    if (this.readyState == 4)
    {
      arrXMLData[iCurrentType] = this.responseXML;
      // loop back through loading files until all have been loaded
      if (arrXMLData.length < arrFiles.length)
      {
        xml.LoadXML(arrXMLData.length);
      }
      else if (xml.fnCallback != null)
      {
        xml.fnCallback();
      }
      else
      {
        alert("Function callback for XML.Load is null so game will not load!");
      }
    }
  };

  xml.Load = function(fnCallback)
  {
    xml.fnCallback = fnCallback;
    xml.LoadXML(0);
  };

  xml.LoadXML = function(iType)
  {iCurrentType
    iCurrentType = iType;
    xml.xhttp.open("GET", arrFiles[iType], true);
    xml.xhttp.send();
  };

  xml.GetXMLData = function(iDataType)
  {
    return arrXMLData[iDataType];
  };

  xml.ParseRoom = function(xmlData)
  {
    var arrData;
    var objRoom =
    {
      label : xmlData.getElementsByTagName("label")[0].innerHTML,
      desc  : xmlData.getElementsByTagName("description")[0].innerHTML,
      doors : xmlData.getElementsByTagName("doors")[0].innerHTML
    };
    objRoom.arrFloors = [];
    var arrFloors = xmlData.getAttribute("category").split(',');
    for (var idx = 0; idx < arrFloors.length; ++idx)
    {
      objRoom.arrFloors.push(parseInt(arrFloors[idx]));
    }
    // optional params
    // defined doors
    arrData = xmlData.getElementsByTagName("defined_doors");
    if (arrData && arrData.length > 0) { objRoom.defined_doors = arrData[0].innerHTML; }
    // room image
    arrData = xmlData.getElementsByTagName("room_image");
    if (arrData && arrData.length > 0) { objRoom.image = arrData[0].innerHTML; }
    // stairs
    arrData = xmlData.getElementsByTagName("stairs");
    if (arrData && arrData.length > 0) { objRoom.stairs = arrData[0].innerHTML; }
    // event
    arrData = xmlData.getElementsByTagName("event");
    if (arrData && arrData.length > 0) { objRoom.event = arrData[0].innerHTML; }

    return objRoom;
  };

  xml.ParseItem = function(xmlData)
  {
    var objItem =
    {
      strLabel  : xmlData.getElementsByTagName("label")[0].innerHTML,
      strDesc   : xmlData.getElementsByTagName("description")[0].innerHTML
    };
    return objItem;
  };

  xml.ParseEvent = function(xmlData)
  {
    var objEvent =
    {
      strLabel : xmlData.getElementsByTagName("label")[0].innerHTML,
      strDesc  : xmlData.getElementsByTagName("description")[0].innerHTML,
    };
    objEvent.iCheckType = xmlData.getElementsByTagName("trial")[0].getElementsByTagName("check_type")[0].innerHTML;
    var arrRolls = xmlData.getElementsByTagName("trial")[0].getElementsByTagName("roll");

    return objEvent;
  };

  return xml;
}());
