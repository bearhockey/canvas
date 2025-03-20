// ----------------------------------------------------------------
// Card
// ----------------------------------------------------------------
class Card extends GameObject
{
    constructor(x=0, y=0, strColor=CONST.CARD_DEFAULT_COLOR)
    {
        super(x, y, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, CONST.CARD_BACK_IMG, CONST.CARD_HIGHLIGHT_IMG);
        this.fnSymbol = this.DrawSymbol;
    }

    // --------------------------------
    // DrawSymbol
    // --------------------------------
    DrawSymbol()
    {
        var ctx = this.ctx;
        if (ctx != null)
        {
            GEO.DrawCircle(ctx, this.iX+this.iWidth/2, this.iY+this.iHeight/3, 30, "#0000FF");
        }
    }
} // end of class