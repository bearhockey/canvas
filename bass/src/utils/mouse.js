var MOUSE = (function () {
    // const
    const VIEW_AREA = { left:0, top:0, right:1170, bottom:540 };
    // function
    var mouse = {};

    var m_arrButtons = [];
    var m_arrPosition = [];

    // ----------------
    // mouse.IsInBox
    // ----------------
    mouse.IsInBox = function(x1, y1, x2, y2, bIncludeBounds = false)
    {
        if (bIncludeBounds)
        {
            return (m_arrPosition[0] >= x1 &&
                    m_arrPosition[0] <= x2 &&
                    m_arrPosition[1] >= y1 &&
                    m_arrPosition[1] <= y2);
        }

        return (m_arrPosition[0] > x1 &&
                m_arrPosition[0] < x2 &&
                m_arrPosition[1] > y1 &&
                m_arrPosition[1] < y2);
    };

    // ----------------
    // mouse.IsInView
    // ----------------
    mouse.IsInView = function()
    {
        return mouse.IsInBox(VIEW_AREA.left, VIEW_AREA.top, VIEW_AREA.right, VIEW_AREA.bottom);
    };

    // ----------------
    // Move
    // ----------------
    mouse.Move = function(evt)
    {
        m_arrPosition = mouse.GetMousePosition(evt);
        if (mouse.IsInView())
        {
            var idx;
            var iLength = m_arrButtons.length;
            var cButton;
            var arrBounds;
            for (idx = 0; idx < iLength; ++idx)
            {
                cButton = m_arrButtons[idx];
                if (cButton != null && cButton.visible == true)
                {
                    if (cButton.CheckPoint(m_arrPosition[0], m_arrPosition[1])) { cButton.Hover(); }
                    else { cButton.Default(); }
                }
            } // end of for loop
        } // end main vs side view check
    };

    // ----------------
    // MouseDown
    // ----------------
    mouse.MouseDown = function(evt)
    {
        // if (STATE.GetWaitState()) { return; } // disable mouse if client is waiting
    };

    // ----------------
    // MouseUp
    // ----------------
    mouse.MouseUp = function(evt)
    {
        // if (STATE.GetWaitState()) { return; } // disable mouse if client is waiting
    };

    // ----------------
    // LeftClick
    //     Handles left mouse clicks and screen taps
    // ----------------
    mouse.LeftClick = function(evt)
    {
        m_arrPosition = mouse.GetMousePosition(evt);
        if (mouse.IsInView())
        {
            var cButton = mouse.GetSelectedButton();
            if (cButton != null && cButton.visible == true && typeof cButton.Use === "function")
            {
                cButton.Use();
            }
            else
            {
                DIALOG.OnMouseClick();
            }
        } // end main vs side view check
    };

    // ----------------
    // RightClick
    // ----------------
    mouse.RightClick = function(evt) {};

    // ----------------
    // GetMousePosition
    // ----------------
    mouse.GetMousePosition = function(evt)
    {
        var rect = myGameArea.canvas.getBoundingClientRect();
        return [ evt.clientX - rect.left, evt.clientY - rect.top ];
    };

    // ----------------
    // AddButton
    // ----------------
    mouse.AddButton = function(button)
    {
        if (m_arrButtons.includes(button)) {}
        else
        {
            m_arrButtons.push(button);
        }
    };

    // ----------------
    // ClearButtons
    // ----------------
    mouse.ClearButtons = function()
    {
        var cButton;
        while (m_arrButtons.length > 0)
        {
          cButton = m_arrButtons.pop();
          delete cButton;
        }
    };

    // ---------------
    // GetSelectedButton
    // ----------------
    mouse.GetSelectedButton = function()
    {
        var idx;
        var iLength = m_arrButtons.length;
        var cButton;
        var arrBounds;
        for (idx = 0; idx < iLength; ++idx)
        {
            cButton = m_arrButtons[idx];
            if (cButton != null && cButton.CheckPoint(m_arrPosition[0], m_arrPosition[1]))
            {
                return cButton;
            }
        } // end of for loop

        return null;
    };

    return mouse;
}());
