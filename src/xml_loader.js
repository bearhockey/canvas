var XML = (function () {
  var xml = {};
  var arrXMLData = [];
  var arrFiles = ["./data/room_data.xml", "./data/item_data.xml"];
  var iCurrentType;

  xml.XML_ROOMS = 0;
  xml.XML_ITEMS = 1;
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
    var objRoom =
    {
      label         : xmlData.getElementsByTagName("label")[0].innerHTML,
      desc          : xmlData.getElementsByTagName("description")[0].innerHTML,
      doors         : xmlData.getElementsByTagName("doors")[0].innerHTML,
      defined_doors : xmlData.getElementsByTagName("defined_doors")[0].innerHTML,
      image         : xmlData.getElementsByTagName("room_image")[0].innerHTML,
      stairs        : xmlData.getElementsByTagName("stairs")[0].innerHTML,
      event         : xmlData.getElementsByTagName("event")[0].innerHTML
    };
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

  return xml;
}());
