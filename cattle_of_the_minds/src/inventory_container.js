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
  var ic = function(iX, iY, iWidth, iHeight, strName="", iItemType=CONST.ITEM_ANY, iSlotLimit=0)
  {
    this.xPos = iX;
    this.yPos = iY;
    this.width = iWidth;
    this.height = iHeight;

    this.iContentWidth = Math.floor(ITEM_SIZE / (this.width - CONTAINER_PADDING*2));
    this.iContentHeight = Math.floor(ITEM_SIZE / (this.height - CONTAINER_PADDING*2));
    this.iContentPointerX = 0;
    this.iContentPointerY = 0;

    this.strName = strName;
    this.iItemType = iItemType;
    this.arrContents = [];
    this.iSlotLimit = iSlotLimit;

    this.GetItemType = function() { return this.iItemType; };
    this.GetFreeSlots = function()
    {
      if (this.iSlotLimit > 0)
      { return this.iSlotLimit - this.arrContents.length; }
      return 99;
    };

    // ------------
    // UpdateName
    //     Updates the name of the conatiner
    // ------------
    this.UpdateName = function(strName)
    {
      this.strName = strName;
    };

    // ------------
    // AddItem
    //     Tries to add an item to this container
    // ------------
    this.AddItem = function(cItem)
    {
      if (cItem != null && typeof cItem.GetItemType === 'function')
      {
        if (this.iItemType == CONST.ITEM_ANY || cItem.GetItemType() == CONST.ITEM_ADD || cItem.GetItemType() == this.iItemType)
        {
          cItem.SetRect(this.GetNextRect());
          cItem.SetParent(this);
          this.arrContents.push(cItem);
        }
        else
        {
          console.log("Wrong item type --> ", cItem.strName + " in ", this.strName);
        }
      }
    };

    // ------------
    // Empty
    //     Empties out the contents of this container
    // ------------
    this.Empty = function()
    {
      this.arrContents.length = 0;
      this.iContentPointerX = CONTAINER_PADDING;
      this.iContentPointerY = CONTAINER_PADDING;
    };

    // ------------
    // GetNextRect
    //     Gets the next rectangle bounds for the item
    // ------------
    this.GetNextRect = function()
    {
      var cRect = new RECT(this.xPos + this.iContentPointerX,
                           this.yPos + this.iContentPointerY,
                          ITEM_SIZE,
                          ITEM_SIZE);
      var bNewLine = (this.iContentPointerX+ITEM_SIZE > this.width-CONTAINER_PADDING);
      this.iContentPointerX = bNewLine ? CONTAINER_PADDING : this.iContentPointerX+ITEM_SIZE;
      this.iContentPointerY = bNewLine ? this.iContentPointerY+ITEM_SIZE : this.iContentPointerY;

      return cRect;
    };

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
