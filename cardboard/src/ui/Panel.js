class Panel extends GameObject
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
        this.m_bShow = true;
        this.m_arrChildren = [];
        this.m_cHighlightedObject = null;
    }

    IsVisible()                     { return this.m_bShow; }
    AddChildToPanel(obj)            { this.m_arrChildren.push(obj); }
    AddChildrenToPanel(arrObjects)  { this.m_arrChildren = this.m_arrChildren.concat(arrObjects); }
    GetChildren()                   { return this.m_arrChildren; }
    ResetHighlight()                { this.m_cHighlightedObject = null; Update(); }

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
        Update();
    }

    // --------------------------------
    // CheckForHighlights
    // --------------------------------
    CheckForHighlights(arrPosition)
    {
        var objNewHighlight = ObjectUtils.CheckForHighlights(this.m_arrChildren, arrPosition);
        if (objNewHighlight == null) // if not found check children of children
        {
            var idx;
            var iLength = this.m_arrChildren.length;
            var objChild;
            for (idx = 0; idx < iLength; ++idx)
            {
                objChild = this.m_arrChildren[idx];
                if (objChild != null && objChild.GetChildren != null)
                {
                    objNewHighlight = ObjectUtils.CheckForHighlights(objChild.GetChildren(), arrPosition);
                    if (objNewHighlight != null) { break; }
                }
            } // end children for loop
        }
        if (objNewHighlight != this.m_cHighlightedObject)
        {
            this.m_cHighlightedObject = objNewHighlight;
            if (this.m_cHighlightedObject != null)
            {
                cRightPanel.SetSelectedCard(this.m_cHighlightedObject);
            }

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
            var bSuccess = this.m_cHighlightedObject.OnClick();
            if (bSuccess == false) // for some reason this means its a card so go ahead and do card stuff
            {
                var idx = this.m_arrChildren.indexOf(this.m_cHighlightedObject);
                if (idx >= 0) { this.m_arrChildren.splice(idx, 1); }
                g_Inventory.TakeFromInventory(this.m_cHighlightedObject);
                g_OM.GrabObject(this.m_cHighlightedObject);
                g_DM.ShowDialog(false);
            }

            this.m_cHighlightedObject = null;
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