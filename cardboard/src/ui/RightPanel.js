class RightPanel extends Panel
{
    constructor()
    {
        super(CONST.CANVAS_WIDTH - 400, 0, 400, CONST.CANVAS_HEIGHT);
        this.m_objSelectedCard = null;
        this.m_iPreviewX = this.x + (this.width/2 - CONST.CARD_WIDTH_LARGE/2);
        this.m_iPreviewY = this.y + 60;
    }

    SetSelectedCard(objCard) { this.m_objSelectedCard = objCard; }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        super.Draw(ctx);
        if (this.m_objSelectedCard != null)
        {
            this.m_objSelectedCard.DrawCopy(ctx, this.m_iPreviewX, this.m_iPreviewY, CONST.CARD_WIDTH_LARGE, CONST.CARD_HEIGHT_LARGE);

            ctx.fillStyle = "#000000";
            ctx.font = '26px serif';
            ctx.fillText(this.m_strName, this.x + 50, this.y+300);
        }
    }
}