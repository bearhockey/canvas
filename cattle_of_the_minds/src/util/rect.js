var RECT = (function () {
  var rect = function(x, y, width, height)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // ----------------
    // CheckPoint
    //     Checks if the given x,y coordinates are inside the RECT
    // ----------------
    this.CheckPoint = function(x, y)
    {
      return (x >= this.x && y >= this.y && x <= this.x+this.width && y <= this.y+this.height);
    };
  }


  return rect;
}());
