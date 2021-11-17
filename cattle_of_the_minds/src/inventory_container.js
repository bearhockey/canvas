var ICONTAINER = (function () {
  // privates
  const HEADER_COLOR_LEFT  = "#888888";
  const HEADER_COLOR_RIGHT = "#BBBBBB";
  const CONTAINER_COLOR    = "#EEEEEE";

  const HEADER_HEIGHT = 20;
  const HEADER_OFFSET = -2;
  const HEADER_PADDING = 4;
  // main
  var ic = function(cRect, strName="", iItemType=CONST.ITEM_ANY)
  {
    this.xPos = cRect.x;
    this.yPos = cRect.y;
    this.width = cRect.width;
    this.height = cRect.height;

    this.strName = strName;
    this.iItemType = iItemType;
    // --------
    // Draw
    //     Draws the container
    // --------
    this.Draw = function(ctx)
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
    };
  };

  return ic;
}());
