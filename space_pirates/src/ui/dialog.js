var DIALOG = (function () {
    // consts
    const DEFAULT_BOX = [10, 275, 460, 275];
    const AVATAR_WINDOW = [5, 5, 470, 590];
    const TEXT_WINDOW = [5, 605, 470, 190];
    const TEXT_POSITION = [20, 650];
    const DEFAULT_FONT = "32px serif";

    const CHOICE_POSITIONS = [
      [345, 740, 120, 50],
      [10, 740, 120, 50]
    ];
    const CHOICE_TEXTS =
    [
      [355, 780],
      [10, 780]
    ];

    const PORTRAIT_POSITION = [40, 90];

    const AVATAR_WINDOW_BORDER = "#EEEEEE";

    // private vars
    var m_strText;
    var m_cRando;
    var m_arrChoices;

    var m_objDialog;
    var m_fnServerCallback;

    // main
    var dialog = {};

    // ----------------
    // TextBox
    //     Draws a text box
    // ----------------
    dialog.TextBox = function(strText, arrBounds = null, strColor="#FFFFFF", strFont=DEFAULT_FONT)
    {
      if (arrBounds == null || arrBounds.length < 2)
      {
        arrBounds = DEFAULT_BOX;
      }

      var nWidth = (arrBounds.length > 2) ? arrBounds[2] : DEFAULT_BOX[2];
      var nHeight = (arrBounds.length > 3) ? arrBounds[3] : DEFAULT_BOX[3];
      var arrLines = STRINGUTILS.GetLines(strText, nWidth);
      var iTextHeight;

      var ctx = GetCanvas();
      if (ctx != null)
      {
        ctx.font = strFont;
        ctx.fillStyle = strColor;
        var idx;
        var iLines = arrLines.length;
        var textMetrics = ctx.measureText(strText);
        iTextHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
        for (idx = 0; idx < iLines; ++idx)
        {
          ctx.fillText(arrLines[idx], arrBounds[0], arrBounds[1] + (iTextHeight * idx));
        }
      }
    };
  
    // ----------------
    // Button
    //     Draws a button
    // ----------------
    dialog.Button = function(strText, fnCallback = null)
    {
        if (fnCallback == null)
        {
            console.warn("Warning: dialog.Button() called with no fnCallback - this button will do nothing!");
        }
        var arrRect = DEFAULT_BOX;
        dialog.TextBox(strText);
        var cHitBox = new HITBOX(arrRect, fnCallback);
        MOUSE.AddHitBox(cHitBox);
    };

    // ----------------
    // GetDialog
    // ----------------
    dialog.GetDialog = function(idx=0, fnCallback=null)
    {
      m_fnServerCallback = fnCallback;
      SERVER.ServerSend({ 'set_state':STATE.STATE_DIALOG, 'get_dialog':true, 'dialog_id':idx });
    };

    // ----------------
    // ReceiveDialogData
    // ----------------
    dialog.ReceiveDialogData = function(objData)
    {
      m_objDialog = objData;
      if (m_objDialog['strText'] != null)
      {
        m_strText = m_objDialog['strText'] ;
      }

      // lets not clear the portrait icon for now
      if (m_objDialog['strPortraitIcon'] != null && m_objDialog['strPortraitIcon'] != "")
      {
        m_cRando = new SPRITE(m_objDialog['strPortraitIcon']);
      }

      if (m_objDialog['arrChoices'] != null && m_objDialog['arrChoices'].length > 0)
      {
        m_arrChoices = m_objDialog['arrChoices'];
      }
      else
      {
        m_arrChoices = [];
      }

      if (m_fnServerCallback != null)
      {
        m_fnServerCallback();
      }

      m_fnServerCallback = null;
    };

    // ----------------
    // GoToDialog
    // ----------------
    dialog.GoToDialog = function(arrIdx=[])
    {
      console.log("GoToDialog");
      if (arrIdx != null && arrIdx.length > 0 && arrIdx[0] >= 0)
      {
        dialog.GetDialog(arrIdx[0], dialog.Draw);
      }
    };

    // ----------------
    // Draw
    //     Draws the Dialog state
    // ----------------
    dialog.Draw = function()
    {
      ClearScreen();
      GENERATE.GenerateStarBackground(AVATAR_WINDOW);
      if (m_cRando != null)
      {
        m_cRando.SetPosition(PORTRAIT_POSITION);
        m_cRando.Draw();
      }

      SHAPE.Box(AVATAR_WINDOW, AVATAR_WINDOW_BORDER);
      SHAPE.Box(TEXT_WINDOW, "#8888CC", "#111133");

      if (m_strText != null)
      {
        dialog.TextBox(m_strText, TEXT_POSITION, "#AAAACC", "24px serif");
      }

      var objChoice;
      var iChoiceLength = m_arrChoices.length;
      if (iChoiceLength > 0)
      {
        for (var idx = 0; idx < iChoiceLength; ++idx)
        {
          objChoice = m_arrChoices[idx];
          if (objChoice != null)
          {
            SHAPE.Box(CHOICE_POSITIONS[idx], "#BBBBBB", "#BBBBCC");
            dialog.TextBox(objChoice.text, CHOICE_TEXTS[idx], "#222255");
            var cHitBox = new HITBOX(CHOICE_POSITIONS[idx], dialog.GoToDialog, [objChoice.next]);
            MOUSE.AddHitBox(cHitBox);
          }

        } // end for loop
      }
      else
      {
        SHAPE.Box(CHOICE_POSITIONS[0], "#BBBBBB", "BBBBCC");
        dialog.TextBox("Back", CHOICE_TEXTS[0], "#222255");
        MOUSE.AddHitBox(new HITBOX(CHOICE_POSITIONS[0], STATE.ChangeState, [STATE.STATE_STATUS]));
      }
    };
  
    return dialog;
  }());
  