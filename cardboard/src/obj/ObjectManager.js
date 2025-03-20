class ObjectManager
{
    constructor()
    {
        this.m_arrObjects = [];
        this.m_arrStageObjects = [];
        this.cHighlightedObject = null;
        this.cGrabbedObject = null;
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
        if (this.cGrabbedObject != null)
        {
            this.cGrabbedObject.Move(arrPosition[0], arrPosition[1]);
            Update();
        }
        else
        {
            this.CheckForHighlights(arrPosition);
        }
    }

    // --------------------------------
    // CheckForHighlights
    //     Check for highlights
    // --------------------------------
    CheckForHighlights(arrPosition)
    {
        var objCard;
        var idx;
        var iObjects = (this.m_arrStageObjects != null) ? this.m_arrStageObjects.length : 0;
        var bIsHit = false;
        var bUpdateNeeded = false;
        var bOldValue;
        for (idx = 0; idx < iObjects; ++idx)
        {
            objCard = this.m_arrStageObjects[idx];
            if (objCard != null && objCard.GetBounds != null)
            {
                bOldValue = objCard.IsHighlighted();
                bIsHit = GEO.IsInRect(arrPosition, objCard.GetBounds());
                if (bIsHit)
                {
                    this.cHighlightedObject = objCard;
                }

                if (objCard.SetHighlight != null)
                {
                    objCard.SetHighlight(bIsHit);
                }

                bUpdateNeeded = (bUpdateNeeded || bOldValue != bIsHit);
            }
        } // end of for loop

        if (bUpdateNeeded) { Update(); } // main.Update()
    }

    // --------------------------------
    // ClickOnObject
    // --------------------------------
    ClickOnObject()
    {
        if (this.cHighlightedObject != null)
        {
            console.log("We got a card: ", this.cHighlightedObject);
            this.cGrabbedObject = this.cHighlightedObject;
        }
    }

    // --------------------------------
    // Draw
    //     Draws all the objects on stage
    // --------------------------------
    Draw(ctx)
    {
        var objCard;
        var idx;
        var iObjects = (this.m_arrStageObjects != null) ? this.m_arrStageObjects.length : 0;
        for (idx = 0; idx < iObjects; ++idx)
        {
            objCard = this.m_arrStageObjects[idx];
            if (objCard != null)
            {
                objCard.Draw(ctx);
            }
        }
    }
}