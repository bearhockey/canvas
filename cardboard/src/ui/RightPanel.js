class RightPanel extends Panel
{
    static TITLE_Y          = 40;
    static CARD_PREVIEW_Y   = 60;
    static SLOTS_PREVIEW_Y  = 280;
    static USES_Y           = 450;
    static PROGRESSION_Y    = 500;
    static PREVIEW_CHILD_WIDTH = 60;
    static PREVIEW_CHILD_HEIGHT = 80;
    constructor()
    {
        super(CONST.CANVAS_WIDTH - CONST.RIGHT_PANEL_WIDTH, 0, CONST.RIGHT_PANEL_WIDTH, CONST.CANVAS_HEIGHT);
        this.m_objSelectedCard = null;
        this.m_iPreviewX = this.x + (this.width/2 - CONST.CARD_WIDTH_LARGE/2);
        this.m_iPreviewY = this.y + RightPanel.CARD_PREVIEW_Y;
        this.m_iTextY    = this.y + RightPanel.TITLE_Y;
        this.m_iSlotsPreviewY = this.y + RightPanel.SLOTS_PREVIEW_Y;
        this.m_iUsesY         = this.y + RightPanel.USES_Y;
        this.m_iProgressionY  = this.y + RightPanel.PROGRESSION_Y;
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

        var cThisCard = this.m_objSelectedCard;
        if (cThisCard != null)
        {
            cThisCard.DrawCopy(ctx, this.m_iPreviewX, this.m_iPreviewY, CONST.CARD_WIDTH_LARGE, CONST.CARD_HEIGHT_LARGE);

            var strName = cThisCard.GetName();
            ctx.fillStyle = CONST.COLOR_BLACK;
            ctx.font = '26px serif';
            var iTextWidth = ctx.measureText(strName).width;
            ctx.fillText(strName, this.x + this.half_width - (iTextWidth/2), this.m_iTextY);

            var arrSlots = (cThisCard.GetSlots != null) ? cThisCard.GetSlots() : [];
            var iSlotCapacity = (cThisCard.GetSlotCapacity != null) ? cThisCard.GetSlotCapacity() : 0;
            var iSlotsWidth = iSlotCapacity*RightPanel.PREVIEW_CHILD_WIDTH + (iSlotCapacity-1)*CONST.CARD_PREVIEW_SPACING;
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
                        cCard.DrawCopy(ctx, iSlotX, this.m_iSlotsPreviewY, RightPanel.PREVIEW_CHILD_WIDTH, RightPanel.PREVIEW_CHILD_HEIGHT);
                        bDrawEmpty = false;
                    }
                }

                if (bDrawEmpty == true)
                {
                    g_IR.DrawImage(ctx, g_IR.CARD_SLOT_ADD, iSlotX, this.m_iSlotsPreviewY, RightPanel.PREVIEW_CHILD_WIDTH, RightPanel.PREVIEW_CHILD_HEIGHT);
                }

                iSlotX += RightPanel.PREVIEW_CHILD_WIDTH + CONST.CARD_PREVIEW_SPACING;
            } // end for loop

            if (cThisCard.CanExpire != null && cThisCard.CanExpire() == true)
            {
                var strUses = "Uses left: " + ((cThisCard.GetUsesLeft != null) ? cThisCard.GetUsesLeft().toString() : "0");
                iTextWidth = ctx.measureText(strUses).width;
                ctx.fillText(strUses, this.x + this.half_width - (iTextWidth/2), this.m_iUsesY);
            }

            if (cThisCard.m_objProgressionPoints != null)
            {
                var objProgressionData = cThisCard.m_objProgressionPoints;
                var strProgression;
                var strName;
                for (var [objCardData, obj] of Object.entries(objProgressionData))
                {
                    if (obj != null && obj.iNeeded > 0)
                    {
                        strProgression = "Turns left until production: " + (obj.iNeeded - obj.iPoints).toString();
                        iTextWidth = ctx.measureText(strProgression).width;
                        ctx.fillText(strProgression, this.x + this.half_width - (iTextWidth/2), this.m_iProgressionY);
                    }
                }
            }
        }
    }
}