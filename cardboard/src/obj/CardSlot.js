class CardSlot extends Card
{
    constructor(x=0, y=0, bCanAdd=false)
    {
        super(x,y);
        this.bCanAdd = bCanAdd;
        this.fnSymbol = (bCanAdd == true) ? this.DrawSymbol : null;
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
