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
    const BUTTON_DISABLED   = "#998888";
    const BUTTON_FONT       = "20px mono";

    const BS_DEFAULT        = 1;
    const BS_HOVER          = 2;
    const BS_PRESSED        = 3;
    const BS_DISABLED       = 4;

    var but = function(x, y, width, height, strLabel="", fnCallback=null, button_idx=0)
    {
        this.rect = new RECT(x, y, width, height);
        this.strLabel = strLabel;
        this.strFont = BUTTON_FONT;
        this.fnCallback = fnCallback;
        this.idx = button_idx;
        this.iState = BS_DEFAULT;
        this.visible = false;

        this.GetX           = function()     { return this.rect.x; };
        this.GetY           = function()     { return this.rect.y; };
        this.SetX           = function(iX)   { this.rect.x = iX; };
        this.SetY           = function(iY)   { this.rect.y = iY; };
        this.SetPosition    = function(x, y) { this.rect.x = x; this.rect.y = y; };

        this.GetWidth = function()  { return this.rect.width; };
        this.GetHeight = function() { return this.rect.height; };

        this.GetLabel = function()          { return this.strLabel; };
        this.SetLabel = function(strLabel)  { this.strLabel = strLabel; };
        this.SetFont  = function(strFont)   { this.strFont = strFont; };

        this.GetFunction = function() { return this.fnCallback; };
        this.GetIdx      = function() { return this.idx; };

        this.GetState = function() { return this.iState; };
        this.Default  = function()
        {
            if (this.iState != BS_DEFAULT) { this.iState = BS_DEFAULT; return true; }
            else { return false; }
        };
        this.Hover = function()
        {
            if (this.iState != BS_HOVER && this.iState != BS_DISABLED) { this.iState = BS_HOVER; return true; }
            else { return false; }
        };
        this.Press= function()
        {
            if (this.iState != BS_PRESSED) { this.iState = BS_PRESSED; return true; }
            else { return false; }
        };
        this.Disable = function()
        {
            this.iState = BS_DISABLED;
            return true;
        };

    // ----------------
    // Use
    //     Runs the function attached to this button
    // ----------------
    this.Use = function()
    {
        if (this.iState != BS_DISABLED && this.fnCallback != null && typeof this.fnCallback === 'function')
        {
            this.fnCallback(this);
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
            case BS_DISABLED:
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
        if (ctx != null && this.visible == true)
        {
            var objColor = this.GetButtonColor();
            RENDER.DrawBevel(ctx, this.rect, objColor, 4);
            ctx.font = this.strFont;
            ctx.textAlign = 'center';
            ctx.fillStyle = (this.iState == BS_DISABLED) ? BUTTON_DISABLED : BUTTON_TEXT_COLOR;
            ctx.fillText(this.strLabel, this.rect.x + this.rect.width/2, this.rect.y+this.rect.height-15);
            ctx.textAlign = 'left';
        }
    };
  }; // end of class

  return but;
}());
