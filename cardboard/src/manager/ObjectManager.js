class ObjectManager
{
    constructor()
    {
        this.m_arrObjects = [];
        this.m_arrPanels = [];
        this.m_arrStageObjects = [];
        this.m_cHighlightedObject = null;
        this.m_cGrabbedObject = null;
        this.m_iGrabbedX;
        this.m_iGrabbedY;
    }

    // Getters and Setters
    // --------------------------------
    GetAllObjects()        { return this.m_arrObjects; }
    GetHighlightedObject() { return this.m_cHighlightedObject; }
    GetGrabbedObject()     { return this.m_cGrabbedObject; }

    // --------------------------------
    // AddObject
    //     Called when any GameObject is created to log its idx
    // --------------------------------
    AddObject(obj)
    {
        var idx = this.m_arrObjects.length;
        this.m_arrObjects.push(obj);
        return idx;
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
    // PopObjectFromStage
    //     Pops the specified object from the stage array
    // --------------------------------
    PopObjectFromStage(obj)
    {
        var idx = this.m_arrStageObjects.indexOf(obj);
        if (idx >= 0)
        {
            this.m_arrStageObjects.splice(idx, 1);
        }
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
        var objNewHighlight = ObjectUtils.CheckForHighlights(this.m_arrStageObjects, arrPosition, [this.m_cGrabbedObject]);
        if (objNewHighlight != this.m_cHighlightedObject)
        {
            this.m_cHighlightedObject = objNewHighlight;
            if (this.m_cHighlightedObject != null && this.m_cGrabbedObject == null)
            {
                cRightPanel.SetSelectedCard(this.m_cHighlightedObject);
            }

            Update(); // main.Update()
        }
        else if (this.m_cGrabbedObject != null)
        {
            Update();
        }
    }

    // --------------------------------
    // ClickOnObject
    // --------------------------------
    ClickOnObject(arrMousePosition)
    {
        if (this.m_cHighlightedObject != null)
        {
            var bSuccess;
            if (this.m_cHighlightedObject.OnClick != null)
            {
                bSuccess = this.m_cHighlightedObject.OnClick();
                if (bSuccess == true)
                {
                    this.m_cGrabbedObject = null;
                }
                console.log("COO: success : ", bSuccess, this.m_cGrabbedObject);
            }

            if (bSuccess == false && this.m_cGrabbedObject == null)
            {
                this.m_cGrabbedObject = this.m_cHighlightedObject.GrabObject();
                console.log("Crabbing? ", bSuccess, this.m_cGrabbedObject);
                if (this.m_cGrabbedObject != null)
                {
                    this.m_iGrabbedX = arrMousePosition[0] - this.m_cHighlightedObject.x;
                    this.m_iGrabbedY = arrMousePosition[1] - this.m_cHighlightedObject.y;
                    if (this.m_cGrabbedObject.SetHighlight != null) { this.m_cGrabbedObject.SetHighlight(false); }
                    this.m_cHighlightedObject = null;
                }
            }
        }
        else if (this.m_cGrabbedObject != null)
        {
            this.m_cGrabbedObject = null; // drop grabbed card
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

        var iObjects = (this.m_arrStageObjects != null) ? this.m_arrStageObjects.length : 0;
        for (idx = 0; idx < iObjects; ++idx)
        {
            obj = this.m_arrStageObjects[idx];
            if (obj != null && obj != this.m_cGrabbedObject)
            {
                obj.Draw(ctx);
            }
        } // end for loop

        var iPanels = (this.m_arrPanels != null) ? this.m_arrPanels.length : 0;
        for (idx = 0; idx < iPanels; ++idx)
        {
            obj = this.m_arrPanels[idx];
            if (obj != null)
            {
                obj.Draw(ctx);
            }
        }

        // make sure grabbed card is always on top
        if (this.m_cGrabbedObject != null)
        {
            ctx.globalAlpha = 0.8;
            this.m_cGrabbedObject.Draw(ctx);
            ctx.globalAlpha = 1.0;
        }
    }
}