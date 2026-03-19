var DIALOG = (function () {
    // consts
    const DEFAULT_BOX = [64, 404, 1042, 128];
    const DEFAULT_FONT = "24px Verdana";
    const TEXT_COLOR = "#EEEEFF";

    const NAME_BOX = [80, 372, 256, 32];
    const NAME_FONT = "32px serif";

    const CURSOR_POSITION = [1064, 492];
    const CURSOR_URL = "./res/cursor_down.png";

    const TEXT_GRADIENT_TOP = "#2288DDCC";
    const TEXT_GRADIENT_BOTTOM = "#0033AACC";
    const NAME_GRADIENT_BOTTOM = "#44AAEE";
    const NAME_GRADIENT_TOP = "#88CCFF"

    const BORDER_WIDTH = 4;
    const BORDER_GRADIENT_TOP = "#EEEEEE";
    const BORDER_GRADIENT_BOTTOM = "#AAAAAA";

    const BUTTON_SPACING = 16;
    const BUTTON_WIDTH = 128;
    const BUTTON_HEIGHT = 64;
    const BUTTON_Y_POSITION = 308;
    // private vars
    var m_strDialog = "";
    var m_strName = "";
    var m_bItalics = false;
    var m_bBold = false;
    var m_iTextIdx = 0;
    var m_bDialogShowing = false;
    var m_bDialogDone = false;
    var m_arrChoiceData = null;
    var m_cursor;
    var m_bCursorLoaded = false;

    var m_arrChoices = [];
    var m_choice_a;
    var m_choice_b;
    // main
    var d = {};

    // constructor logic
    m_cursor = new Image();
    m_cursor.onload = function () { m_bCursorLoaded = true; };
    m_cursor.src = CURSOR_URL;

    d.Init = function()
    {
        var choice_button;
        for (var idx = 0; idx < 4; ++idx)
        {
            choice_button = new BUTTON(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, "CHOICE", DIALOG.OnChoiceClick);
            MOUSE.AddButton(choice_button);
            m_arrChoices.push(choice_button);
        }
    };

    // ----------------
    // SetText
    // ----------------
    d.SetText = function(strText, strName="", bUseItalics=false, bUseBold=false, arrChoice=null)
    {
        m_strDialog = strText;
        m_strName = strName;
        m_bItalics = bUseItalics;
        m_bBold = bUseBold;
        m_arrChoiceData = arrChoice;
        m_iTextIdx = 0;
        m_bDialogShowing = true;
        m_bDialogDone = false;

        for (const choice_button of m_arrChoices) { if (choice_button != null) { choice_button.visible = false; } }

        if (m_arrChoiceData != null && m_arrChoiceData.length > 0)
        {
            var iLength = m_arrChoiceData.length;
            var iStartingX = GetCanvasWidth()/2 - ( (BUTTON_WIDTH - BUTTON_SPACING) * (iLength/2));
            for (var idx = 0; idx < iLength; ++idx)
            {
                var button_choice = m_arrChoices[idx];
                var objChoice = (idx < m_arrChoiceData.length) ? m_arrChoiceData[idx] : null;
                if (button_choice != null && objChoice != null)
                {
                    button_choice.SetLabel(objChoice.text);
                    button_choice.SetPosition(iStartingX, BUTTON_Y_POSITION);
                    iStartingX += (BUTTON_WIDTH + BUTTON_SPACING);
                }
            }
        }
    }

    // ----------------
    // DrawDialog
    // ----------------
    d.DrawDialog = function()
    {
        var ctx = GetCanvas();
        if (ctx != null && m_bDialogShowing)
        {
            const gradient = ctx.createLinearGradient(0, DEFAULT_BOX[1], 0, DEFAULT_BOX[1]+DEFAULT_BOX[3]);
            gradient.addColorStop(0, TEXT_GRADIENT_TOP); // Start
            gradient.addColorStop(1, TEXT_GRADIENT_BOTTOM);  // End

            DIALOG.DrawBox(DEFAULT_BOX, gradient);
            DIALOG.DrawName();
            DIALOG.DrawText();

            for (const choice_button of m_arrChoices)
            {
                if (choice_button != null) { choice_button.Draw(ctx); }
            }
        }
    };

    d.DrawBox = function(arrBounds, box_gradient)
    {
        var ctx = GetCanvas();
        if (ctx != null && arrBounds.length > 3)
        {
            ctx.fillStyle = box_gradient;
            ctx.fillRect(arrBounds[0], arrBounds[1], arrBounds[2], arrBounds[3]);

            const lineGradient = ctx.createLinearGradient(arrBounds[0], arrBounds[1], arrBounds[0]+arrBounds[2], arrBounds[1]+arrBounds[3]);
            lineGradient.addColorStop(0, BORDER_GRADIENT_TOP); // Start
            lineGradient.addColorStop(1, BORDER_GRADIENT_BOTTOM);  // End
            ctx.beginPath();
            ctx.lineWidth = BORDER_WIDTH;
            ctx.strokeStyle = lineGradient;
            ctx.roundRect(arrBounds[0], arrBounds[1], arrBounds[2], arrBounds[3], 8);
            ctx.stroke();
        }
    };

    // ----------------
    // DrawName
    // ----------------
    d.DrawName = function()
    {
        var ctx = GetCanvas();
        if (ctx != null && m_strName != "")
        {
            const name_grad = ctx.createLinearGradient(0, NAME_BOX[1], 0, NAME_BOX[1]+NAME_BOX[3]);
            name_grad.addColorStop(0, NAME_GRADIENT_TOP); // Start
            name_grad.addColorStop(1, NAME_GRADIENT_BOTTOM);  // End
            DIALOG.DrawBox(NAME_BOX, name_grad);
            ctx.font = DEFAULT_FONT;
            ctx.fillStyle = TEXT_COLOR;
            RENDER.EnableShadow();
            ctx.fillText(m_strName, NAME_BOX[0]+16, NAME_BOX[1]+24);
            RENDER.DisableShadow();
        }
    };

    // ----------------
    // DrawText
    // ----------------
    d.DrawText = function()
    {
        var ctx = GetCanvas();
        if (ctx != null)
        {
            ctx.font = DIALOG.GetFont();
            ctx.fillStyle = TEXT_COLOR;
            RENDER.EnableShadow();
            var strText;
            var bTextDone = m_iTextIdx >= m_strDialog.length;
            if (bTextDone)
            {
                m_bDialogDone = true;
                strText = m_strDialog;
                if (m_arrChoiceData != null)
                {
                    var iLength = m_arrChoiceData.length;
                    var choice_button;
                    for (var idx=0; idx < iLength; ++idx)
                    {
                        choice_button = (idx < m_arrChoices.length) ? m_arrChoices[idx] : null;
                        if (choice_button != null) { choice_button.visible = true; }
                    }
                }
                else if (m_bCursorLoaded)
                {
                    ctx.drawImage(m_cursor, CURSOR_POSITION[0], CURSOR_POSITION[1]);
                }
            }
            else
            {
                strText = m_strDialog.substring(0, m_iTextIdx);
                m_iTextIdx += 1;
            }

            var arrLines = STRINGUTILS.GetLines(strText, DEFAULT_BOX[2]-32);
            var iTextHeight;
            var idx;
            var iLines = arrLines.length;
            var textMetrics = ctx.measureText(strText);
            iTextHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
            for (idx = 0; idx < iLines; ++idx)
            {
                ctx.fillText(arrLines[idx], DEFAULT_BOX[0]+16, DEFAULT_BOX[1]+32 + (iTextHeight * idx));
            }

            RENDER.DisableShadow();
        }
    };

    // --------------------------------
    // GetFont
    // --------------------------------
    d.GetFont = function()
    {
        var strFont = "";
        if (m_bItalics) { strFont += "italic "; }
        if (m_bBold)    { strFont += "bold "; }
        return strFont + DEFAULT_FONT;
    };

    // --------------------------------
    // OnChoiceClick
    // --------------------------------
    d.OnChoiceClick = function(button)
    {
        if (m_arrChoiceData != null)
        {
            var idx = m_arrChoices.indexOf(button);
            if (idx >= 0)
            {
                var objChoice = (idx < m_arrChoiceData.length) ? m_arrChoiceData[idx] : null;
                if (objChoice != null && objChoice.target != null)
                {
                    EVENTS.SetNextEventIdx(objChoice.target);
                    EVENTS.ParseNextEvent(); // for now just keep going
                }
            }
        }
    };

    // ----------------
    // OnMouseClick
    // ----------------
    d.OnMouseClick = function()
    {
        if (m_bDialogShowing)
        {
            if (m_bDialogDone && (m_arrChoiceData == null || m_arrChoiceData.length < 1))
            {
                m_bDialogShowing = false;
                EVENTS.ParseNextEvent();
            }
            else
            {
                m_iTextIdx = m_strDialog.length; // fast forward text
            }
        }
    };

    return d;
  }());
