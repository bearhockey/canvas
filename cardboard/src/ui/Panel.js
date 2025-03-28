class Panel extends GameObject
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
        this.m_bShow = true;
        this.m_arrChildren = [];
        this.m_cHighlightedObject = null;

        this.m_objOpenCloseButton;
        this.m_arrOpenButtonPosition;
        this.m_arrClosedButtonPosition;
    }

    // --------------------------------
    // AddCloseButton
    // --------------------------------
    AddCloseButton(obj, arrClosedPosition = null)
    {
        this.AddChildToPanel(obj);
        this.m_objOpenCloseButton = obj;
        this.m_arrOpenButtonPosition = obj.GetPosition();
        this.m_arrClosedButtonPosition = (arrClosedPosition != null) ? arrClosedPosition : this.m_arrOpenButtonPosition;
    }

    // --------------------------------
    // AddChildToPanel
    // --------------------------------
    AddChildToPanel(obj)
    {
        this.m_arrChildren.push(obj);
    }

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
        if (g_OM.GetGrabbedObject() != null)
        {
            // try to place an object
        }
        else if (this.m_cHighlightedObject != null)
        {
            if (this.m_cHighlightedObject.OnClick != null)
            {
                this.m_cHighlightedObject.OnClick();
            }
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
                }
            }
        }
    }
}