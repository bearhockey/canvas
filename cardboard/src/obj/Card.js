// ----------------------------------------------------------------
// Card
// ----------------------------------------------------------------
class Card extends GameObject
{
    constructor(iType=Card.TYPE_BLANK)
    {
        var objCardData = CARD_DEF.ID[iType];
        super(0, 0, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, objCardData.strImage, CONST.CARD_HIGHLIGHT_IMG);
        this.m_iType = iType;
        this.bCanGrab = true;
        this.m_bCanPreview = true;
        this.m_iSlotCapacity = (objCardData != null && objCardData.iSlots != null) ? objCardData.iSlots : CONST.CARD_MAX_SLOTS;
        this.m_iPipXOffset = this.half_width - ((CONST.PIP_SIZE * this.m_iSlotCapacity) + (CONST.PIP_SPACING * (this.m_iSlotCapacity-1)))/2;
        this.m_iPipYOffset = this.height + CONST.PIP_SPACING;
        this.m_arrSlots = [];
        this.m_strName = objCardData.strName;
        this.m_objProgressionPoints = {};
    }

    // Getters and setters
    // --------------------------------
    GetType()           { return this.m_iType; }
    GetSlotCapacity()   { return this.m_iSlotCapacity; }
    GetSlots()          { return this.m_arrSlots; }

    // --------------------------------
    // GetProgression
    // --------------------------------
    GetProgression(id)
    {
        return (this.m_objProgressionPoints[id] != null) ? this.m_objProgressionPoints[id].iPoints : 0;
    }

    // --------------------------------
    // SetProgressionPoints
    // --------------------------------
    SetProgressionPoints(id, iPoints, iNeeded)
    {
        this.m_objProgressionPoints[id] = { iPoints:iPoints, iNeeded:iNeeded };
    }

    // --------------------------------
    // OnClick
    // --------------------------------
    OnClick()
    {
        var objHeldCard = g_OM.GetGrabbedObject();
        if (objHeldCard != null)
        {
            return this.FillSlot(objHeldCard);
        }

        return false;
    }

    // --------------------------------
    // GrabObject
    //     Grabs the top most card, otherwise grabs this card
    // --------------------------------
    GrabObject()
    {
        if (this.m_arrSlots.length > 0)
        {
            var objTopCard = this.m_arrSlots[0];
            this.m_arrSlots.splice(0, 1);
            g_OM.AddObjectToStage(objTopCard);
            return objTopCard;
        }
        else
        {
            return super.GrabObject();
        }
    }

    // --------------------------------
    // FillSlot
    // --------------------------------
    FillSlot(objCard)
    {
        if (this.m_arrSlots.length < this.m_iSlotCapacity)
        {
            this.m_arrSlots.push(objCard);
            objCard.Move(this.x, this.y);
            g_OM.CalculateChildren();
            g_OM.PopObjectFromStage(objCard);
            return true;
        }

        return false;
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        super.Draw(ctx);
        if (this.bHighlight == true && this.m_bIsVisible == true)
        {
            var pip_x = this.x + this.m_iPipXOffset;
            var pip_y = this.y + this.m_iPipYOffset;
            var idx;
            for (idx = 0; idx < this.m_iSlotCapacity; ++idx)
            {
                var img = (this.m_arrSlots[idx] != null) ? g_IR.IMG_FILLED_PIP : g_IR.IMG_EMPTY_PIP;
                g_IR.DrawImage(ctx, img, pip_x, pip_y);
                pip_x += CONST.PIP_SIZE + CONST.PIP_SPACING;
            } // end pip drawing for loop
        }
    }
    
} // end of class