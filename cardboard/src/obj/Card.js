// ----------------------------------------------------------------
// Card
// ----------------------------------------------------------------
class Card extends GameObject
{
    constructor(x=0, y=0, strCardImage=CONST.CARD_BACK_IMG, strCardHighlight=CONST.CARD_HIGHLIGHT_IMG)
    {
        super(x, y, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, strCardImage, strCardHighlight);
        this.bCanGrab = true;
        this.m_arrSlots = [];
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
        if (this.m_arrSlots.length < CONST.CARD_MAX_SLOTS)
        {
            this.m_arrSlots.push(objCard);
            objCard.Move(this.x, this.y);
            g_OM.PopObjectFromStage(objCard);
            return true;
        }

        return false;
    }

    // --------------------------------
    // GetSlots
    // --------------------------------
    GetSlots() { return this.m_arrSlots; }


} // end of class