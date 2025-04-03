class RightPanel extends Panel
{
    static TITLE_Y = 40;
    static CARD_PREVIEW_Y = 60;
    static SLOTS_PREVIEW_Y = 280;
    constructor()
    {
        super(CONST.CANVAS_WIDTH - CONST.RIGHT_PANEL_WIDTH, 0, CONST.RIGHT_PANEL_WIDTH, CONST.CANVAS_HEIGHT);
        this.m_objSelectedCard = null;
        this.m_iPreviewX = this.x + (this.width/2 - CONST.CARD_WIDTH_LARGE/2);
        this.m_iPreviewY = this.y + RightPanel.CARD_PREVIEW_Y;
        this.m_iTextY    = this.y + RightPanel.TITLE_Y;
        this.m_iSlotsPreviewY = this.y + RightPanel.SLOTS_PREVIEW_Y;
    }

    // --------------------------------
    // SetSelectedCard
    // --------------------------------
    SetSelectedCard(objCard)
    {
        if (objCard != null && objCard.CanPreview())
        {
            this.m_objSelectedCard = objCard;
        }
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        super.Draw(ctx);
        if (this.m_objSelectedCard != null)
        {
            this.m_objSelectedCard.DrawCopy(ctx, this.m_iPreviewX, this.m_iPreviewY, CONST.CARD_WIDTH_LARGE, CONST.CARD_HEIGHT_LARGE);

            var strName = this.m_objSelectedCard.GetName();
            ctx.fillStyle = "#000000";
            ctx.font = '26px serif';
            var iTextWidth = ctx.measureText(strName).width;
            ctx.fillText(strName, this.x + this.half_width - (iTextWidth/2), this.m_iTextY);

            var arrSlots = (this.m_objSelectedCard.GetSlots != null) ? this.m_objSelectedCard.GetSlots() : [];
            var iSlotCapacity = (this.m_objSelectedCard.GetSlotCapacity != null) ? this.m_objSelectedCard.GetSlotCapacity() : 0;
            var iSlotsWidth = iSlotCapacity*CONST.CARD_WIDTH + (iSlotCapacity-1)*CONST.CARD_PREVIEW_SPACING;
            var idx;
            var cCard;
            var bDrawEmpty;
            var iSlotX = this.x + this.half_width - iSlotsWidth/2;
            for (idx = 0; idx < iSlotCapacity; ++idx)
            {
                bDrawEmpty = true;
                if (idx < arrSlots.length)
                {
                    cCard = arrSlots[idx];
                    if (cCard != null)
                    {
                        cCard.DrawCopy(ctx, iSlotX, this.m_iSlotsPreviewY, CONST.CARD_WIDTH, CONST.CARD_HEIGHT);
                        bDrawEmpty = false;
                    }
                }

                if (bDrawEmpty == true)
                {
                    g_IR.DrawImage(ctx, g_IR.CARD_SLOT_ADD, iSlotX, this.m_iSlotsPreviewY);
                }

                iSlotX += CONST.CARD_WIDTH + 10;
            } // end for loop
        }
    }
}