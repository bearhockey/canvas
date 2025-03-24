class ObjectManager
{
    constructor()
    {
        this.m_arrObjects = [];
        this.m_arrPanels = [];
        this.m_arrStageObjects = [];
        this.cHighlightedObject = null;
        this.m_cGrabbedObject = null;
        this.m_iGrabbedX;
        this.m_iGrabbedY;
    }

    // --------------------------------
    // AddObject
    //     Called when any GameObject is created to log its idx
    // --------------------------------
    AddObject(obj)
    {
        var idx = this.m_arrObjects.length;
        obj.idx = idx;
        this.m_arrObjects.push(obj);
    }

    // --------------------------------
    // AddPanel
    //     Adds a panel
    // --------------------------------
    AddPanel(obj)
    {
        this.m_arrPanels.push(obj);
    }

    // --------------------------------
    // AddObjectToStage
    //     Adds an object to the stage
    // --------------------------------
    AddObjectToStage(obj)
    {
        this.m_arrStageObjects.push(obj);
    }

    // --------------------------------
    // MouseMove
    // --------------------------------
    MouseMove(arrPosition)
    {
        if (this.m_cGrabbedObject != null)
        {
            this.m_cGrabbedObject.Move(arrPosition[0]-this.m_iGrabbedX, arrPosition[1]-this.m_iGrabbedY);
        }

        this.CheckForHighlights(arrPosition);
    }

    // --------------------------------
    // CheckForHighlights
    //     Check for highlights
    // --------------------------------
    CheckForHighlights(arrPosition)
    {
        var objCard;
        var idx;
        var iObjects = (this.m_arrObjects != null) ? this.m_arrObjects.length : 0;
        var bIsHit = false;
        var bStopHighlight = true;
        var bUpdateNeeded = this.m_cGrabbedObject != null;
        var bOldValue;
        for (idx = 0; idx < iObjects; ++idx)
        {
            objCard = this.m_arrObjects[idx];
            if (objCard != null && objCard.GetBounds != null)
            {
                bOldValue = objCard.IsHighlighted();
                bIsHit = (GEO.IsInRect(arrPosition, objCard.GetBounds()) && objCard != this.m_cGrabbedObject);
                if (bIsHit)
                {
                    bStopHighlight = false;
                    this.cHighlightedObject = objCard;
                }

                if (objCard.SetHighlight != null)
                {
                    objCard.SetHighlight(bIsHit);
                }

                bUpdateNeeded = (bUpdateNeeded || bOldValue != bIsHit);
            }
        } // end of for loop

        if (bStopHighlight) { this.cHighlightedObject = null; }
        if (bUpdateNeeded) { Update(); } // main.Update()
    }

    // --------------------------------
    // ClickOnObject
    // --------------------------------
    ClickOnObject(arrMousePosition)
    {
        if (this.m_cGrabbedObject != null)
        {
            this.m_cGrabbedObject = null;
        }
        else if (this.cHighlightedObject != null)
        {
            console.log("ClickOnObject() --> ", this.cHighlightedObject);
            if (this.cHighlightedObject.OnClick != null)
            {
                console.log("ClickOnObject() OnClick is true");
                this.cHighlightedObject.OnClick();
            }
            else if (this.cHighlightedObject.CanGrab())
            {
                this.m_iGrabbedX = arrMousePosition[0] - this.cHighlightedObject.x;
                this.m_iGrabbedY = arrMousePosition[1] - this.cHighlightedObject.y;
                this.m_cGrabbedObject = this.cHighlightedObject;
                this.m_cGrabbedObject.SetHighlight(false);
                this.cHighlightedObject = null;
            }
        }

        Update();
    }

    // --------------------------------
    // Draw
    //     Draws all the objects on stage
    // --------------------------------
    Draw(ctx)
    {
        var obj;
        var idx;
        var iPanels = (this.m_arrPanels != null) ? this.m_arrPanels.length : 0;
        for (idx = 0; idx < iPanels; ++idx)
        {
            obj = this.m_arrPanels[idx];
            if (obj != null)
            {
                obj.Draw(ctx);
            }
        }

        var iObjects = (this.m_arrStageObjects != null) ? this.m_arrStageObjects.length : 0;
        for (idx = 0; idx < iObjects; ++idx)
        {
            obj = this.m_arrStageObjects[idx];
            if (obj != null && obj != this.m_cGrabbedObject)
            {
                obj.Draw(ctx);
            }
        } // end for loop

        // make sure grabbed card is always on top
        if (this.m_cGrabbedObject != null)
        {
            ctx.globalAlpha = 0.8;
            this.m_cGrabbedObject.Draw(ctx);
            ctx.globalAlpha = 1.0;
        }
    }
}