var CHARACTER = (function () {
  // consts
  const SCREEN_COLOR = {color:"#DDDDDD", highlight:"#FFFFFF", shadow:"#AAAAAA"};
  const BEVEL_THICKNESS = 10;
  const NAME_FONT = "32px mono";
  const STAT_VALUE_FONT = "64px mono";
  const STAT_LABEL_FONT = "24px mono";
  const NUMBER_FONT = "20px mono";
  const FONT_COLOR = "#111122";
  const NEUTRAL_COLOR = "#7777CC";
  const POSITIVE_COLOR = "#77CC77";
  const NEGATIVE_COLOR = "#CC7777";
  const STAT_ROW_POS = 460;
  const STAT_SPACE = 100;

  const STAT_STR_X  = 165;
  const STAT_DEX_X = 375;
  const STAT_INT_X = 585;
  const STAT_CON_X = 795;
  // main
  var character = {};

  character.m_cRect = null;
  character.m_cEditRect = null;
  character.m_bEditMode = false;
  character.m_cStatsCopy = null;
  character.m_cTotalStats = null;
  character.m_iBaseStr = 0;
  character.m_iBaseDex = 0;
  character.m_iBaseInt = 0;
  character.m_iBaseCon = 0;
  character.m_mapStatPositions =
  {
    1 : [150, 230],
    2 : [150, 260],
    3  : [150, 290],
    30 : [150, 200]
  };
  // edit buttons
  character.m_arrButtons = [];

  // ----------------
  // Init
  //     Inits the character renderer
  // ----------------
  character.Init = function()
  {
    character.m_cRect = new RECT(50, 50, 860, 750);
    character.m_cEditRect = new RECT(50, 820, 860, 100);
    character.m_arrButtons.push(new BUTTON(60, 120, 200, 50, "Change", character.ChangeName));
    character.m_arrButtons.push(new BUTTON(140, 210, 240, 50, "Change Icon", character.ChangeIcon));
    character.m_arrButtons.push(new BUTTON(640, 325, 260, 50, "Change Image", character.ChangePortrait));

    character.m_arrButtons.push(new BUTTON(STAT_STR_X-100, STAT_ROW_POS-20, 40, 45, "-", character.MinusStr)); // strength -
    character.m_arrButtons.push(new BUTTON(STAT_STR_X+60,  STAT_ROW_POS-20, 40, 45, "+", character.PlusStr));  // strength +

    character.m_arrButtons.push(new BUTTON(STAT_DEX_X-100, STAT_ROW_POS-20, 40, 45, "-", character.MinusDex)); // dex -
    character.m_arrButtons.push(new BUTTON(STAT_DEX_X+60,  STAT_ROW_POS-20, 40, 45, "+", character.PlusDex));  // dex +

    character.m_arrButtons.push(new BUTTON(STAT_INT_X-100, STAT_ROW_POS-20, 40, 45, "-", character.MinusInt)); // int -
    character.m_arrButtons.push(new BUTTON(STAT_INT_X+60,  STAT_ROW_POS-20, 40, 45, "+", character.PlusInt));  // int +

    character.m_arrButtons.push(new BUTTON(STAT_CON_X-100, STAT_ROW_POS-20, 40, 45, "-", character.MinusCon)); // con -
    character.m_arrButtons.push(new BUTTON(STAT_CON_X+60,  STAT_ROW_POS-20, 40, 45, "+", character.PlusCon));  // con +

    character.m_arrButtons.push(new BUTTON(640, 860, 250, 50, "Confirm", character.Confirm));
  };

  character.MinusStr = function() { character.ChangeStat(CONST.STAT_STRENGTH,     -1); };
  character.PlusStr  = function() { character.ChangeStat(CONST.STAT_STRENGTH,      1); };
  character.MinusDex = function() { character.ChangeStat(CONST.STAT_DEXTERITY,    -1); };
  character.PlusDex  = function() { character.ChangeStat(CONST.STAT_DEXTERITY,     1); };
  character.MinusInt = function() { character.ChangeStat(CONST.STAT_INTELLECT,    -1); };
  character.PlusInt  = function() { character.ChangeStat(CONST.STAT_INTELLECT,     1); };
  character.MinusCon = function() { character.ChangeStat(CONST.STAT_CONSTITUTION, -1); };
  character.PlusCon  = function() { character.ChangeStat(CONST.STAT_CONSTITUTION,  1); };

  // ----------------
  // HandleMouseClick
  //     Handles the mouse clicking
  // ----------------
  character.HandleMouseClick = function(x, y)
  {
    if (character.m_bEditMode)
    {
      MOUSE.CheckButtons(character.m_arrButtons, x, y);
    }
  };

  // ----------------
  // ----------------
  character.ChangeStat = function(iStat, iValue)
  {
    character.m_cStatsCopy.AddStat(iStat, iValue);
    character.m_cStatsCopy.AddStat(CONST.STAT_POINTS, -1);
    Update();
  };

  // ----------------
  // ChangeName
  //     Updates the hero's name
  // ----------------
  character.ChangeName = function()
  {
    var cHero = HERO.Get();
    var strNewName = window.prompt("Name:", cHero.GetName());
    if (strNewName != "")
    {
      cHero.SetName(strNewName);
    }

    Update();
  };

  // ----------------
  // ChangeIcon
  //     Updates the hero's icon
  // ----------------
  character.ChangeIcon = function()
  {
    var strNewIcon = window.prompt("Custom Icon:", "");
    if (strNewIcon != "")
    {
      HERO.SetIcon(strNewIcon);
    }

    Update();
  };

  // ----------------
  // ChangePortrait
  //     Updates the hero's portrait
  // ----------------
  character.ChangePortrait = function()
  {
    var strNewPortrait = window.prompt("Custom Portrait:", "");
    if (strNewPortrait != "")
    {
      HERO.SetPortrait(strNewPortrait);
    }

    Update();
  };

  // ----------------
  // Confirm
  //     Confirms the choices for stat changes
  // ----------------
  character.Confirm = function()
  {
    var bConfirm = window.confirm("Confirm stat changes?");
    if (bConfirm)
    {
      HERO.Get().cBaseStats = character.m_cStatsCopy;
      character.m_bEditMode = false;
    }

    Update();
  };

  // ----------------
  // Exit
  //     Function that happens when exiting the screen
  // ----------------
  character.Exit = function()
  {
    character.m_bEditMode = false;
  };

  // ----------------
  // EnterScreen
  //     Enters the screen
  // ----------------
  character.EnterScreen = function(bEditMode = false)
  {
    // character.m_bEditMode = bEditMode;
    character.m_cStatsCopy = new STATBLOCK();
    character.m_cStatsCopy.AddStatBlock(HERO.Get().cBaseStats);
    character.m_iBaseStr = character.m_cStatsCopy.GetStat(CONST.STAT_STRENGTH);
    character.m_iBaseDex = character.m_cStatsCopy.GetStat(CONST.STAT_DEXTERITY);
    character.m_iBaseInt = character.m_cStatsCopy.GetStat(CONST.STAT_INTELLECT);
    character.m_iBaseCon = character.m_cStatsCopy.GetStat(CONST.STAT_CONSTITUTION);
    character.m_bEditMode = (character.m_cStatsCopy.GetStat(CONST.STAT_POINTS) > 0);
  };

  // ----------------
  // Update
  //     Updates the character for drawing later
  // ----------------
  character.Update = function()
  {
    var iPoints = character.m_cStatsCopy.GetStat(CONST.STAT_POINTS);

    // disable any stat buttons if not enough points
    var idx;
    var iLength = character.m_arrButtons.length;
    var cButton;
    for (idx = 0; idx < iLength; ++idx)
    {
      cButton = character.m_arrButtons[idx];
      if (cButton != null)
      {
        if (cButton.GetLabel() == "+")
        {
          if (iPoints > 0)
          {
            cButton.Default();
          }
          else
          {
            cButton.Disable();
          }
        }
        else if (cButton.GetLabel() == "-")
        {
          if (cButton.GetFunction() == character.MinusStr)
          {
            if (character.m_cStatsCopy.GetStat(CONST.STAT_STRENGTH) > character.m_iBaseStr)
            {
              cButton.Default();
            }
            else
            {
              cButton.Disable();
            }
          } // Strength Check
          else if (cButton.GetFunction() == character.MinusDex)
          {
            if (character.m_cStatsCopy.GetStat(CONST.STAT_DEXTERITY) > character.m_iBaseDex)
            {
              cButton.Default();
            }
            else
            {
              cButton.Disable();
            }
          } // Dexterity Check
          else if (cButton.GetFunction() == character.MinusInt)
          {
            if (character.m_cStatsCopy.GetStat(CONST.STAT_INTELLECT) > character.m_iBaseInt)
            {
              cButton.Default();
            }
            else
            {
              cButton.Disable();
            }
          } // Intellect Check
          else if (cButton.GetFunction() == character.MinusCon)
          {
            if (character.m_cStatsCopy.GetStat(CONST.STAT_CONSTITUTION) > character.m_iBaseCon)
            {
              cButton.Default();
            }
            else
            {
              cButton.Disable();
            }
          } // Constitution Check
        }
      } // null check
    } // end for loop
  };

  // ----------------
  // Draw
  //     Draws the character screen
  // ----------------
  character.Draw = function()
  {
    var ctx = GetCanvas();
    var cHero = HERO.Get();
    UTILS.DrawBevel(ctx, character.m_cRect, SCREEN_COLOR, BEVEL_THICKNESS);

    ctx.textAlign = 'left';
    ctx.font = NAME_FONT;
    ctx.fillStyle = FONT_COLOR;
    ctx.fillText("Name: ", 60, 100);
    ctx.fillText(cHero.GetName(), 165, 100);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = FONT_COLOR;
    ctx.moveTo(165, 100);
    ctx.lineTo(400, 100);
    ctx.closePath();

    ctx.fillStyle = "#666666";
    ctx.fillRect(60, 200, 68, 68);
    character.DrawIcon(ctx, HERO.GetIcon(), 62, 202);
    ctx.fillRect(640, 60, 260, 260);
    character.DrawIcon(ctx, HERO.GetPortrait(), 642, 62);

    ctx.textAlign = "center";
    ctx.strokeStyle = "#CCCCDD";
    ctx.lineWidth = 4;
    character.DrawStat(ctx, CONST.STAT_STRENGTH, "Strength", STAT_STR_X);
    character.DrawStat(ctx, CONST.STAT_DEXTERITY, "Dexterity", STAT_DEX_X);
    character.DrawStat(ctx, CONST.STAT_INTELLECT, "Intellect", STAT_INT_X);
    character.DrawStat(ctx, CONST.STAT_CONSTITUTION, "Constitution", STAT_CON_X);

    if (character.m_bEditMode)
    {
      var iPoints = character.m_cStatsCopy.GetStat(CONST.STAT_POINTS);
      UTILS.DrawBevel(ctx, character.m_cEditRect, SCREEN_COLOR, BEVEL_THICKNESS);
      ctx.beginPath();
      ctx.strokeStye = FONT_COLOR;
      ctx.lineWidth = 2;
      ctx.arc(100, 865, 32, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = (iPoints > 0) ? "#BBDDBB" : "#DDBBBB";
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = FONT_COLOR;
      ctx.font = STAT_LABEL_FONT;
      ctx.fillText(iPoints.toString(), 100, 870);
      ctx.textAlign = "left";
      ctx.fillText("- Ability points to spend", 140, 870);

      var idx;
      var iLength = character.m_arrButtons.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        character.m_arrButtons[idx].Draw(ctx);
      } // end for loop
    }
  };

  // ----------------
  // DrawNumber
  //     Draws a specified stat to the screen
  // ----------------
  character.DrawNumber = function(ctx, iStat, strName)
  {
    var iX = character.m_mapStatPositions[iStat][0];
    var iY = character.m_mapStatPositions[iStat][1];
    var iValue = character.m_cStatsCopy.GetStat(iStat);
    ctx.fillText(strName, iX, iY);
    ctx.fillText(iValue.toString(), iX + STAT_SPACE, iY);
  };

  // ----------------
  // DrawStat
  //     Draws the circular characteristic on the screen - they all have the same y value
  // ----------------
  character.DrawStat = function(ctx, iStat, strLabel, x)
  {
    var strStatColor = NEUTRAL_COLOR;
    var iBaseValue = character.m_cStatsCopy.GetStat(iStat);
    // var iTotalValue = character.m_cTotalStats.GetStat(iStat);
    // if      (iTotalValue > iBaseValue) { strStatColor = POSITIVE_COLOR; }
    // else if (iTotalValue < iBaseValue) { strStatColor = NEGATIVE_COLOR; }

    ctx.beginPath();
    ctx.arc(x, STAT_ROW_POS, 64, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = strStatColor;
    ctx.fill();
    ctx.fillStyle = "#CCCCDD";
    ctx.fillRect(x - 95, STAT_ROW_POS+20, 190, 50);
    ctx.closePath();

    var strStatColor = FONT_COLOR;
    ctx.fillStyle = strStatColor;
    ctx.font = STAT_VALUE_FONT;
    ctx.fillText(iBaseValue.toString(), x, STAT_ROW_POS+10);
    // ctx.fillText(iTotalValue.toString(), x, STAT_ROW_POS+10);
    ctx.font = STAT_LABEL_FONT;
    ctx.fillText(strLabel, x, STAT_ROW_POS+55);
  };

  // ----------------
  // DrawIcon
  //     Draws an icon at x, y (might need to put this in a more general utils class)
  // ----------------
  character.DrawIcon = function(ctx, strIcon, x, y)
  {
    var img = new Image();
    img.iX = x;
    img.iY = y;
    img.addEventListener('load', function() { ctx.drawImage(this, this.iX, this.iY); }, false);
    img.src = strIcon;
  };

  return character;
}());
