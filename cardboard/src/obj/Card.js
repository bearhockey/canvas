// ----------------------------------------------------------------
// Card
// ----------------------------------------------------------------
class Card extends GameObject
{
    static TYPE_BLANK = 0;
    static TYPE_COLONIST = 1;

    constructor(x=0, y=0, iType=Card.TYPE_BLANK, strCardImage=CONST.CARD_BACK_IMG, strCardHighlight=CONST.CARD_HIGHLIGHT_IMG)
    {
        super(x, y, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, strCardImage, strCardHighlight);
        this.bCanGrab = true;
        this.m_iSlotCapacity = CONST.CARD_MAX_SLOTS;
        this.m_iPipXOffset = this.half_width - ((CONST.PIP_SIZE * this.m_iSlotCapacity) + (CONST.PIP_SPACING * (this.m_iSlotCapacity-1)))/2;
        this.m_iPipYOffset = this.height + CONST.PIP_SPACING;
        this.m_arrSlots = [];

        this.m_strName = this.SetNameByType(iType);
    }

    SetNameByType(iType)
    {
        var strName = "Card " + this.idx.toString();
        switch (iType)
        {
            case Card.TYPE_COLONIST: { strName = "Colonist"; break; }
            default: break;
        } // end of switch

        return strName;
    }

    // Getters and setters
    // --------------------------------
    GetSlotCapacity()   { return this.m_iSlotCapacity; }
    GetSlots()          { return this.m_arrSlots; }

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
        if (this.bHighlight)
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