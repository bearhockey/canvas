class CardSlot extends Card
{
    constructor(x=0, y=0, bCanAdd=false)
    {
        super(x, y, CONST.CARD_SLOT_IMG, CONST.CARD_SLOT_ADD_IMG);
        this.bCanGrab = false;
        this.bCanAdd = bCanAdd;
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        if (this.m_arrSlots.length > 0)
        {
            var objCard = this.m_arrSlots[0];
            if (objCard != null) { objCard.Draw(ctx); }
        }
        else
        {
            super.Draw(ctx);
        }
    }
    
} // end of class
