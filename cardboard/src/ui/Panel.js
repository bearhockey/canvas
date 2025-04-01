class Panel extends GameObject
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
        this.m_bShow = true;
        this.m_arrChildren = [];
        this.m_cHighlightedObject = null;
    }

    IsVisible() { return this.m_bShow; }
    AddChildToPanel(obj) { this.m_arrChildren.push(obj); }

    // --------------------------------
    // OnButtonClick
    // --------------------------------
    OnButtonClick(iButtonID)
    {
        if (iButtonID == CONST.BUTTON_ACTION_OPEN_CLOSE) { this.OnClose(); }
    }

    // --------------------------------
    // OnClose
    // --------------------------------
    OnClose()
    {
        this.m_bShow = !this.m_bShow;
        var arrPosition = (this.m_bShow == true) ? this.m_arrOpenButtonPosition : this.m_arrClosedButtonPosition;
        this.m_objOpenCloseButton.Move(arrPosition[0], arrPosition[1]);
        Update();
    }

    // --------------------------------
    // CheckForHighlights
    // --------------------------------
    CheckForHighlights(arrPosition)
    {
        var objNewHighlight = ObjectUtils.CheckForHighlights(this.m_arrChildren, arrPosition);
        if (objNewHighlight != this.m_cHighlightedObject)
        {
            this.m_cHighlightedObject = objNewHighlight;
            Update();
        }
    }

    // --------------------------------
    // OnClick
    // --------------------------------
    OnClick()
    {
        if (this.m_cHighlightedObject != null && this.m_cHighlightedObject.OnClick != null)
        {
            this.m_cHighlightedObject.OnClick();
        }
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        if (this.m_bShow == true)
        {
            if (this.imgBase != null)
            {
                super.Draw(ctx);
            }
            else
            {
                ctx.fillStyle = CONST.COLOR_WHITE;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = CONST.COLOR_GREY;
                ctx.fillRect(this.x+2, this.y+2, this.width-4, this.height-4);
            }

            if (this.m_arrChildren != null && this.m_arrChildren.length > 0)
            {
                var obj;
                var iChildren = this.m_arrChildren.length;
                for (var idx = 0; idx < iChildren; ++idx)
                {
                    obj = this.m_arrChildren[idx];
                    if (obj != null && obj.Draw != null)
                    {
                        obj.Draw(ctx);
                    }
                } // end for loop
            }
        }
    }
} // end of class