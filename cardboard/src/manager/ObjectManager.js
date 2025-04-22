class ObjectManager
{
    constructor()
    {
        this.m_arrObjects = [];
        this.m_arrStageObjects = [];
        this.m_arrCardButtons = [];
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
    IsDialogShowing()      { return this.m_bDialogShowing; }
    ShowDialog(bShow)      { this.m_bDialogShowing = bShow; }

    // --------------------------------
    // GrabObject
    // --------------------------------
    GrabObject(obj, arrMousePosition = null)
    {
        this.AddObjectToStage(obj);
        this.m_cGrabbedObject = obj;
        this.EnableCardButtons();
        if (this.m_cGrabbedObject != null)
        {
            if (arrMousePosition == null || arrMousePosition.length < 1) { arrMousePosition = m_Mouse.GetPosition(); }
            if (arrMousePosition == null || arrMousePosition.length < 1) { arrMousePosition = [this.m_cGrabbedObject.x, this.m_cGrabbedObject.y]; }

            this.m_iGrabbedX = arrMousePosition[0] - obj.x;
            this.m_iGrabbedY = arrMousePosition[1] - obj.y;
            if (this.m_cGrabbedObject.SetHighlight != null) { this.m_cGrabbedObject.SetHighlight(false); }
            this.m_cHighlightedObject = null;
        }
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
    // AddObjectToStage
    //     Adds an object to the stage (only if it doesn't already exist though)
    // --------------------------------
    AddObjectToStage(obj)
    {
        if (this.m_arrStageObjects.indexOf(obj) < 0) { this.m_arrStageObjects.push(obj); }
    }

    // --------------------------------
    // AddCardButton
    // --------------------------------
    AddCardButton(cButton)
    {
        this.m_arrCardButtons.push(cButton);
        this.AddObjectToStage(cButton);
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
    // SellGrabbedObject
    // --------------------------------
    SellGrabbedObject()
    {
        var obj = this.GetGrabbedObject();
        if (obj != null && obj.GetValue != null && obj.GetValue() > 0)
        {
            this.PopObjectFromStage(obj);
            this.m_cGrabbedObject = null;
        }

        return obj;
    }

    // --------------------------------
    // EnableCardButtons
    // --------------------------------
    EnableCardButtons()
    {
        var bEnableButtons = (this.m_cGrabbedObject != null && this.m_cGrabbedObject.GetValue != null && this.m_cGrabbedObject.GetValue() > 0);
        var cButton;
        var idx;
        var iButtons = this.m_arrCardButtons.length;
        for (idx = 0; idx < iButtons; ++idx)
        {
            cButton = this.m_arrCardButtons[idx];
            if (cButton != null && cButton.SetEnabled != null) { cButton.SetEnabled(bEnableButtons); }
        }
    }

    // --------------------------------
    // CalculateChildren
    //     We only advance cards in play
    // --------------------------------
    CalculateChildren(bAdvanceTurn=false)
    {
        var idx;
        var iLength = this.m_arrStageObjects.length;
        var objParent;
        var arrChildren;
        var objChildren;
        var objChild;
        var iChild;
        var strType; // Card.id
        for (idx = 0; idx < iLength; ++idx)
        {
            objParent = this.m_arrStageObjects[idx];
            if (objParent != null && objParent.GetSlots != null)
            {
                arrChildren = objParent.GetSlots();
                if (arrChildren != null && arrChildren.length > 0)
                {
                    objChildren = {};
                    for (iChild = 0; iChild < arrChildren.length; ++iChild)
                    {
                        objChild = arrChildren[iChild];
                        if (objChild != null)
                        {
                            strType = (objChild.GetId != null) ? objChild.GetId() : -1;
                            if (objChildren[strType] == null) { objChildren[strType] = 0; }
                            objChildren[strType] += 1;
                        }
                    } // end for loop

                    var arrPack = RecipeUtils.CheckRecipes(objParent, objChildren, bAdvanceTurn);
                    if (arrPack != null && arrPack.length > 0)
                    {
                        g_Inventory.AddPack(arrPack);
                    }
                }
            }
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
            }

            if (bSuccess == false && this.m_cGrabbedObject == null)
            {
                this.GrabObject(this.m_cHighlightedObject.GrabObject(), arrMousePosition);
            }
        }
        else if (this.m_cGrabbedObject != null)
        {
            this.m_cGrabbedObject = null; // drop grabbed card
            this.EnableCardButtons();
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
    }

    // --------------------------------
    // DrawGrabbedObject
    //     Draws the currently grabbed object - makes sure it is always on top
    // --------------------------------
    DrawGrabbedObject(ctx)
    {
        if (this.m_cGrabbedObject != null)
        {
            ctx.globalAlpha = 0.8;
            this.m_cGrabbedObject.Draw(ctx);
            ctx.globalAlpha = 1.0;
        }
    }
}