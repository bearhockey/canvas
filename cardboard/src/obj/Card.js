// ----------------------------------------------------------------
// Card
// ----------------------------------------------------------------
class Card extends GameObject
{
    constructor(strCardKey)
    {
        var objCardData = Data.GetCardData().GetCardByName(strCardKey);
        var strImage = (objCardData != null) ? objCardData.strImage : CONST.CARD_BACK_IMG;
        super(0, 0, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, strImage, CONST.CARD_HIGHLIGHT_IMG);
        this.bCanGrab = true;
        this.m_bCanPreview = true;

        this.idx             = (objCardData != null && objCardData.idx     != null) ? objCardData.idx     : -1;
        this.id              = (objCardData != null && objCardData.id      != null) ? objCardData.id      : null;
        this.m_iSlotCapacity = (objCardData != null && objCardData.iSlots  != null) ? objCardData.iSlots  : CONST.CARD_MAX_SLOTS;
        this.m_iValue        = (objCardData != null && objCardData.iValue  != null) ? objCardData.iValue  : 0;
        this.m_iUses         = (objCardData != null && objCardData.iUses   != null) ? objCardData.iUses   : 0;
        this.m_strName       = (objCardData != null && objCardData.strName != null) ? objCardData.strName : "Card : " + this.idx.toString();
        this.m_bCanSell      = (this.m_iValue > 0);
        this.m_bCanExpire    = (this.m_iUses > 0);
        this.m_bKillOnExpire = true;

        this.m_iPipXOffset = this.half_width - ((CONST.PIP_SIZE * this.m_iSlotCapacity) + (CONST.PIP_SPACING * (this.m_iSlotCapacity-1)))/2;
        this.m_iPipYOffset = this.height + CONST.PIP_SPACING;

        this.m_arrSlots = [];
        this.m_objProgressionPoints = {};
    }

    // Getters and setters
    // --------------------------------
    GetIdx()            { return this.idx; }
    GetId()             { return this.id; }
    GetValue()          { return this.m_iValue; }
    GetUsesLeft()       { return this.m_iUses; }
    GetSlotCapacity()   { return this.m_iSlotCapacity; }
    GetSlots()          { return this.m_arrSlots; }
    CanExpire()         { return this.m_bCanExpire; }
    DiesOnExpire()      { return this.m_bKillOnExpire; }
    Use(iAmount = 1)    { this.m_iUses -= iAmount; }

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
        var objHeldCard = Main.GetObjectManager().GetGrabbedObject();
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
            Main.GetObjectManager().AddObjectToStage(objTopCard);
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
            Main.GetObjectManager().CalculateChildren();
            Main.GetObjectManager().PopObjectFromStage(objCard);
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
        if (this.m_strName !=- null)
        {
            var strName = this.GetName();
            ctx.fillStyle = CONST.COLOR_BLACK;
            ctx.font = '12px serif';
            var iTextWidth = ctx.measureText(strName).width;
            ctx.fillText(strName, this.x + this.half_width - (iTextWidth/2), this.y + this.height - 12);
        }
        if (this.bHighlight == true && this.m_bIsVisible == true)
        {
            var pip_x = this.x + this.m_iPipXOffset;
            var pip_y = this.y + this.m_iPipYOffset;
            var idx;
            for (idx = 0; idx < this.m_iSlotCapacity; ++idx)
            {
                var img = (this.m_arrSlots[idx] != null) ? Main.GetImageRenderer().IMG_FILLED_PIP : Main.GetImageRenderer().IMG_EMPTY_PIP;
                Main.GetImageRenderer().DrawImage(ctx, img, pip_x, pip_y);
                pip_x += CONST.PIP_SIZE + CONST.PIP_SPACING;
            } // end pip drawing for loop
        }
    }
    
} // end of class