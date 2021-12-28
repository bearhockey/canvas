var BUTTON = (function () {
  const BUTTON_COLOR      = "#AAAAAA";
  const BUTTON_HIGHLIGHT  = "#DDDDDD";
  const BUTTON_SHADOW     = "#666666";

  const HOVER_COLOR       = "#CCCCCC";
  const HOVER_HIGHLIGHT   = "#EEEEEE";
  const HOVER_SHADOW      = "#999999";

  const PRESS_COLOR       = "#888888";
  const PRESS_HIGHLIGHT   = "#AAAAAA";
  const PRESS_SHADOW      = "#444444";

  const BUTTON_TEXT_COLOR = "#111122";
  const BUTTON_FONT       = "24pt mono";

  const BS_DEFAULT        = 1;
  const BS_HOVER          = 2;
  const BS_PRESSED        = 3;

  var but = function(x, y, width, height, strLabel="", fnCallback=null)
  {
    this.rect = new RECT(x, y, width, height);
    this.strLabel = strLabel;
    this.fnCallback = fnCallback;
    this.iState = BS_DEFAULT;

    this.GetX     = function() { return this.rect.x; };
    this.GetY     = function() { return this.rect.y; };
    this.SetX     = function(iX) { this.rect.x = iX; };
    this.SetY     = function(iY) { this.rect.y = iY; };

    this.GetWidth = function()  { return this.rect.width; };
    this.GetHeight = function() { return this.rect.height; };

    this.GetState = function() { return this.iState; };
    this.Default  = function()
    {
      if (this.iState != BS_DEFAULT) { this.iState = BS_DEFAULT; return true; }
      else { return false; }
    };
    this.Hover = function()
    {
       if (this.iState != BS_HOVER) { this.iState = BS_HOVER; return true; }
       else { return false; }
    };
    this.Press= function()
    {
      if (this.iState != BS_PRESSED) { this.iState = BS_PRESSED; return true; }
      else { return false; }
    };

    // ----------------
    // Use
    //     Runs the function attached to this button
    // ----------------
    this.Use = function()
    {
      if (this.fnCallback != null && typeof this.fnCallback === 'function')
      {
        this.fnCallback();
      }
    }

    // ----------------
    // CheckPoint
    //     Checks if the given x,y coordinates are inside the BUTTON
    // ----------------
    this.CheckPoint = function(x, y)
    {
      return this.rect.CheckPoint(x, y);
    };

    // ----------------
    // GetButtonColor
    //     Returns the appropriate color for the button
    // ----------------
    this.GetButtonColor = function()
    {
      var objColor;
      switch (this.iState)
      {
        case BS_HOVER:   { objColor = { color:HOVER_COLOR, highlight:HOVER_HIGHLIGHT, shadow:HOVER_SHADOW }; break; }
        case BS_PRESSED: { objColor = { color:PRESS_COLOR, highlight:PRESS_HIGHLIGHT, shadow:PRESS_SHADOW }; break; }
        case BS_DEFAULT:
        default:         { objColor = { color:BUTTON_COLOR, highlight:BUTTON_HIGHLIGHT, shadow:BUTTON_SHADOW }; break; }
      } // end of switch

      return objColor;
    };

    // ----------------
    // Draw
    //     Draws the button on the canvas
    // ----------------
    this.Draw = function(ctx)
    {
      var objColor = this.GetButtonColor();
      ctx.fillStyle = objColor.color;
      ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = objColor.highlight;;
      ctx.moveTo(this.rect.x, this.rect.y+this.rect.height);
      ctx.lineTo(this.rect.x, this.rect.y);
      ctx.lineTo(this.rect.x+this.rect.width, this.rect.y);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.strokeStyle = objColor.shadow;
      ctx.moveTo(this.rect.x, this.rect.y+this.rect.height);
      ctx.lineTo(this.rect.x+this.rect.width, this.rect.y+this.rect.height);
      ctx.lineTo(this.rect.x+this.rect.width, this.rect.y);
      ctx.stroke();
      ctx.closePath();

      ctx.font = BUTTON_FONT;
      ctx.textAlign = 'center';
      ctx.fillStyle = BUTTON_TEXT_COLOR;
      ctx.fillText(this.strLabel, this.rect.x + this.rect.width/2, this.rect.y+this.rect.height-15);
    };
  }; // end of class


  return but;
}());
