var DIALOG = (function () {
  const DEFAULT_BG_COLOR = "#000000";
  const BUTTONS_SPACING = 50;
  const BUTTON_Y_POSITION = 900;
  const TEXT_BOX_COLOR = "#111122";
  const TEXT_BOX_BORDER = "#DDDDEE";
  const TEXT_FONT       = "24pt mono";
  var dg = {};

  dg.strBackgroundColor = DEFAULT_BG_COLOR;
  dg.strImage = "";
  dg.iImageWidth = 0;
  dg.iImageHeight = 0;
  dg.arrButtons = [];
  dg.strText = "";

  // ----------------
  // OpenDialog
  //     Sets the data to open a dialog window up
  // ----------------
  dg.OpenDialog = function(strImage="", iImageWidth=0, iImageHeight=0, strBgColor=DEFAULT_BG_COLOR, arrButtons=[], strText="", bUpdate=true)
  {
    dg.arrButtons.length = 0;
    dg.strImage = strImage;
    dg.iImageWidth = iImageWidth;
    dg.iImageHeight = iImageHeight;
    dg.strBackgroundColor = strBgColor;
    dg.arrButtons = arrButtons;
    dg.strText = strText;

    // position the buttons correctly
    var idx;
    var cButton;
    if (dg.arrButtons != null && dg.arrButtons.length > 0)
    {
      var iButtonsLength = dg.arrButtons.length;
      var iButtonsWidth = 0;
      for (idx = 0; idx < iButtonsLength; ++idx)
      {
        iButtonsWidth += dg.arrButtons[idx].GetWidth();
      } // end for loop

      var iXPosition = UTILS.GetCenterCord(iButtonsWidth + (iButtonsLength*BUTTONS_SPACING));
      for (idx = 0; idx < iButtonsLength; ++idx)
      {
        cButton = dg.arrButtons[idx];
        if (cButton != null)
        {
          cButton.SetY(BUTTON_Y_POSITION);
          cButton.SetX(iXPosition);
          iXPosition += cButton.GetWidth() + BUTTONS_SPACING;
        }
      } // end of for loop
    }

    STATE.SetState(STATE.STATE_DIALOG, bUpdate);
  };

  // ----------------
  // HandleMouseMove
  //     Handles the mouse moving
  // ----------------
  dg.HandleMouseMove = function(x, y)
  {
    var bUpdate = false;
    var bHandled = false;
    if (dg.arrButtons != null && dg.arrButtons.length > 0)
    {
      var idx;
      var iLength = dg.arrButtons.length;
      var cButton;
      for (idx = 0; idx < iLength; ++idx)
      {
        cButton = dg.arrButtons[idx];
        if (cButton != null)
        {
          if (cButton.CheckPoint(x, y)) { bHandled = cButton.Hover(); }
          else                          { bHandled = cButton.Default(); }
        }

        if (bHandled) { bUpdate = true; }
      } // end of for loop
    }

    if (bUpdate) { Update(); }
  };

  // ----------------
  // HandleMouseClick
  //     Handles the mouse clicking
  // ----------------
  dg.HandleMouseClick = function(x, y)
  {
    if (dg.arrButtons != null && dg.arrButtons.length > 0)
    {
      var idx;
      var iLength = dg.arrButtons.length;
      var cButton;
      for (idx = 0; idx < iLength; ++idx)
      {
        cButton = dg.arrButtons[idx];
        if (cButton != null)
        {
          cButton.Use();
          break;
        }
      } // end of for loop
    }
  };

  // ----------------
  // IsImageValid
  //     Checks if the set image is a valid image
  // ----------------
  dg.IsImageValid = function()
  {
    return (dg.strImage != null &&
            dg.strImage != "" &&
            dg.iImageWidth > 0 &&
            dg.iImageHeight > 0);
  };

  // ----------------
  // Draw
  //     Draws the main window
  // ----------------
  dg.Draw = function()
  {
    var ctx = GetCanvas();
    var iCanvasWidth = GetCanvasWidth();
    ctx.fillStyle = dg.strBackgroundColor;
    ctx.fillRect(0, 0, iCanvasWidth, iCanvasWidth);

    if (dg.IsImageValid())
    {
      var imgEntity = new Image();
      imgEntity.iX = UTILS.GetCenterCord(dg.iImageWidth);
      imgEntity.iY = UTILS.GetCenterCord(dg.iImageHeight);
      imgEntity.addEventListener('load', function()
      {
        ctx.drawImage(this, this.iX, this.iY);
        dg.Draw2(ctx);
      }, false);
      imgEntity.src = dg.strImage;
    }
    else
    {
      dg.Draw2(ctx);
    }
  };

  // ----------------
  // Draw2
  //     Second step of Draw - needs to be a separate function due to the async nature of loading the image
  // ----------------
  dg.Draw2 = function(ctx)
  {
    var iCanvasWidth = GetCanvasWidth();
    if (dg.strText != null && dg.strText != "")
    {
      ctx.fillStyle = TEXT_BOX_COLOR;
      ctx.strokeStyle = TEXT_BOX_BORDER;
      ctx.rect(10, 750, iCanvasWidth-20, 140);
      ctx.fill();
      ctx.stroke();

      ctx.font = TEXT_FONT;
      ctx.textAlign = 'left';
      ctx.fillStyle = TEXT_BOX_BORDER;
      ctx.fillText(this.strText, 20, 800);
    }

    var idx;
    if (dg.arrButtons != null && dg.arrButtons.length > 0)
    {
      var iButtonsLength = dg.arrButtons.length;
      for (idx = 0; idx < iButtonsLength; ++idx)
      {
        dg.arrButtons[idx].Draw(ctx);
      } // end of for loop
    }
  };

  return dg;
}());
