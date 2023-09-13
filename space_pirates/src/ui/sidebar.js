var SIDEBAR = (function () {
    // consts
    const BG_COLOR = "#CCCCCC";
    const BG_BORDER = "#EEEEEE";
    const BG_BEVEL = "#999999";
    // private vars

    // main
    var sidebar = {};

    // ----------------
    // Draw
    // ----------------
    sidebar.Draw = function()
    {
        var ctx = GetCanvas();
        if (ctx != null)
        {
            // SHAPE.Box([5, 5, 200, 470], BG_COLOR, BG_BORDER, BG_BEVEL);
            SHAPE.Box([5, 5, 200, 470], BG_COLOR, BG_BORDER);
        }
    };
  
    return sidebar;
  }());
  