class CardSlot extends Card
{
    constructor(x=0, y=0, bCanAdd=false)
    {
        super(x, y, CONST.CARD_SLOT_IMG, CONST.CARD_SLOT_ADD_IMG);
        this.bCanGrab = false;
        this.bCanAdd = bCanAdd;
    }

    // --------------------------------
    // DrawSymbol
    // --------------------------------
    DrawSymbol()
    {
        var ctx = this.ctx;
        if (ctx != null)
        {
            GEO.DrawCross(ctx, this.iX+this.iWidth/2, this.iY+this.iHeight/2, 20, "#BCBCBC");
        }
    }
} // end of class
