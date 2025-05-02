// ----------------------------------------------------------------
// CardPack
// ----------------------------------------------------------------
class CardPack extends GameObject
{
    static COST_Y_OFFSET = 24;
    constructor(objPackData)
    {
        let strImage = (objPackData != null) ? objPackData.strImage : "";
        super(0, 0, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, objPackData.strImage, CONST.CARD_HIGHLIGHT_IMG);
        this.m_iType = (objPackData != null && objPackData.idx != null) ? objPackData.idx : 0;
        this.m_bShowPrice = true;

        this.m_strName  = (objPackData != null && objPackData.strName != null) ? objPackData.strName  : "Pack : " + this.idx.toString();
        this.m_iCost    = (objPackData != null && objPackData.iCost != null)   ? objPackData.iCost    : 0;
        this.m_arrCards = (objPackData != null && objPackData.pack != null)    ? objPackData.pack     : [];
    }

    GetType()  { return this.m_iType; }
    GetCost()  { return this.m_iCost; }
    GetCards() { return this.m_arrCards;}

    OnClick() { return false; }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        super.Draw(ctx);
        if (this.m_bShowPrice == true)
        {
            var iCurrency = g_Colony.GetCurrency();
            var strCost = this.m_iCost.toString() + " C";
            ctx.fillStyle = (iCurrency >= this.m_iCost) ? CONST.COLOR_BLACK : CONST.COLOR_RED;
            ctx.font = '26px serif';
            var iTextWidth = ctx.measureText(strCost).width;
            ctx.fillText(strCost, this.x + this.half_width - (iTextWidth/2), this.y + this.height + CardPack.COST_Y_OFFSET);
        }
    }
}