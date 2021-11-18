var ICONTAINER = (function () {
  // privates
  const HEADER_COLOR_LEFT  = "#888888";
  const HEADER_COLOR_RIGHT = "#BBBBBB";
  const CONTAINER_COLOR    = "#EEEEEE";

  const HEADER_HEIGHT = 20;
  const HEADER_OFFSET = -2;
  const HEADER_PADDING = 4;

  const CONTAINER_PADDING = 16;

  const ITEM_SIZE = 64;
  const ITEM_HIGHLIGHT_COLOR = "#CCCCFF";

  const ITEM_LABEL_OFFSET = 84; // 64 (icon size) + 20 (font size)
  // main
  var ic = function(iX, iY, iWidth, iHeight, strName="", iItemType=CONST.ITEM_ANY)
  {
    this.xPos = iX;
    this.yPos = iY;
    this.width = iWidth;
    this.height = iHeight;

    this.strName = strName;
    this.iItemType = iItemType;
    this.arrContents = [];

    // ------------
    // AddItem
    //     Tries to add an item to this container
    // ------------
    this.AddItem = function(cItem)
    {
      if (cItem != null && typeof cItem.GetItemType === 'function')
      {
        if (this.iItemType == CONST.ITEM_ANY || cItem.GetItemType() == this.iItemType)
        {
          this.arrContents.push(cItem);
        }
        else
        {
          console.log("Wrong item type");
        }
      }
    };

    // ------------
    // Empty
    //     Empties out the contents of this container
    // ------------
    this.Empty = function() { this.arrContents.length = 0; };

    // ------------
    // Draw
    //     Draws the container
    // ------------
    this.Draw = function(ctx, cHighlightedItem=null)
    {
      var grd = ctx.createLinearGradient(this.xPos, 0, this.xPos + this.width, 0);
      grd.addColorStop(0, HEADER_COLOR_LEFT);
      grd.addColorStop(1, HEADER_COLOR_RIGHT);

      // Fill with gradient
      ctx.fillStyle = grd;
      ctx.fillRect(this.xPos, this.yPos, this.width, HEADER_HEIGHT+HEADER_PADDING*2);
      ctx.fillStyle = CONTAINER_COLOR;
      ctx.font = '20px sans';
      ctx.fillText(this.strName, this.xPos+HEADER_PADDING, this.yPos+HEADER_HEIGHT+HEADER_OFFSET);
      ctx.fillRect(this.xPos, this.yPos+HEADER_HEIGHT, this.width, this.height-HEADER_HEIGHT);

      // items
      var idx;
      var cItem;
      var imgEntity;
      var iLength = this.arrContents.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cItem = this.arrContents[idx];
        if (cItem != null && typeof cItem.GetIcon === 'function')
        {
          imgEntity = new Image();
          imgEntity.iX = this.xPos + CONTAINER_PADDING + ITEM_SIZE*idx;
          imgEntity.iY = this.yPos + CONTAINER_PADDING + 5;
          imgEntity.iQuantity = cItem.iQuantity;
          imgEntity.strLabel = cItem.strName;
          if (cItem == cHighlightedItem)
          {
            ctx.fillStyle = ITEM_HIGHLIGHT_COLOR;
            ctx.fillRect(imgEntity.iX, imgEntity.iY , ITEM_SIZE, ITEM_LABEL_OFFSET);
          }
          imgEntity.addEventListener('load', function()
          {
            ctx.drawImage(this, this.iX, this.iY);
            var strText = "";
            if (this.strLabel != null)
            {
              strText = this.strLabel;
            }
            if (this.iQuantity > 0)
            {
              strText += " x" + this.iQuantity;
            }
            if (strText != null && strText != "")
            {
              ctx.fillStyle = "#111111";
              ctx.font = "20px sans";
              ctx.fillText(strText, this.iX, this.iY+ITEM_LABEL_OFFSET);
            }
          }, false);
          imgEntity.src = cItem.GetIcon();
        }
      } // end of for loop
    };
  };

  return ic;
}());
