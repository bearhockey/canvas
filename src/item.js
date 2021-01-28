var ITEM = (function () {
  var item = {};
  item.arrItems = [];
  // ----------------
  // LoadItemXML
  //     Loads the item data from item_data.xml and parses them into arrays
  // ----------------
  item.LoadItemXML = function()
  {
    var idx;
    var xmlData;
    // var objRoom;
    var arrItemData;
    var xmlItemData = XML.GetXMLData(XML.XML_ITEMS);
    if (xmlItemData)
    {
      arrItemData = xmlItemData.getElementsByTagName("items")[0].getElementsByTagName("item");
      if (arrItemData && arrItemData.length > 0)
      {
        for (idx = 0; idx < arrItemData.length; ++idx)
        {
          xmlData = arrItemData[idx];
          item.arrItems.push(XML.ParseItem(xmlData));
        } // end for loop
      } // end arrItemData check
    } // end xmlItemData check
  };

  item.GetItem = function()
  {

  };
  return item;
}());
