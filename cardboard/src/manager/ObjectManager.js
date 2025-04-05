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
    IsDialogShowing()      { return this.m_bDialogShowing; }
    ShowDialog(bShow)      { this.m_bDialogShowing = bShow; }

    // --------------------------------
    // GrabObject
    // --------------------------------
    GrabObject(obj, arrMousePosition = null)
    {
        this.AddObjectToStage(obj);
        this.m_cGrabbedObject = obj;
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
    // AddPanel
    //     Adds a panel
    // --------------------------------
    AddPanel(obj)
    {
        this.m_arrPanels.push(obj);
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
        var iType;
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
                        if (objChild != null && objChild.GetType != null)
                        {
                            iType = objChild.GetType();
                            if (objChildren[iType] == null) { objChildren[iType] = 0; }
                            objChildren[iType] += 1;
                        }
                    } // end for loop

                    this.CheckRecipes(objParent, objChildren, bAdvanceTurn);
                }
            }
        }
    }

    // --------------------------------
    // CheckRecipes
    // --------------------------------
    CheckRecipes(objParent, objChildren, bAddWork=false)
    {
        if (objParent != null && objChildren != null)
        {
            var iParentType = (objParent.GetType != null) ? objParent.GetType() : 0;
            var arrOutput = [];
            var arrRecipes = RECIPE_DEF.SOURCE[iParentType];
            var objIngredients;
            var objRecipe;
            var idx;
            var iRecipes = (arrRecipes != null) ? arrRecipes.length : 0;
            var iOutputCount;
            var iOutputIdx;
            var cCard;
            var bValidRecipe;
            var iTurns;
            var iProgression;
            var iWorkValue;

            for (idx = 0; idx < iRecipes; ++idx)
            {
                bValidRecipe = true;
                objRecipe = arrRecipes[idx];
                if (objRecipe != null && objRecipe.input != null)
                {
                    objIngredients = objRecipe.input;
                    for (var [iType, iCount] of Object.entries(objIngredients))
                    {
                        if (objChildren[iType] == null || objChildren[iType] < iCount)
                        {
                            bValidRecipe = false;
                            break;
                        }
                    } // end of ingredient for loop

                    if (bValidRecipe == true)
                    {
                        objIngredients = objRecipe.output;
                        iTurns = (objRecipe.turns != null) ? objRecipe.turns : 1;
                        iProgression = (objParent.GetProgression != null) ? objParent.GetProgression(objIngredients.id) : 0;

                        iWorkValue = (bAddWork== true) ? 1 : 0; // TODO : Bonuses?
                        if (iProgression + iWorkValue >= iTurns)
                        {
                            if (objParent.SetProgressionPoints != null) { objParent.SetProgressionPoints(objIngredients.id, 0, iTurns); }
                            iOutputCount = (objIngredients != null && objIngredients.count != null) ? objIngredients.count : 1;
                            for (iOutputIdx = 0; iOutputIdx < iOutputCount; ++iOutputIdx)
                            {
                                arrOutput.push(objIngredients.id);
                            }
                        }
                        else if (objParent.SetProgressionPoints != null)
                        {
                            objParent.SetProgressionPoints(objIngredients.id, iProgression + iWorkValue, iTurns);
                        }
                    }
                }
            } // end of recipe for loop

            if (bAddWork == true) // should only add cards if we are adding work
            {
                var iLength = arrOutput.length;
                for (idx = 0; idx < iLength; ++idx)
                {
                    cCard = new Card(arrOutput[idx]);
                    g_Inventory.AddToInventory(cCard);
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