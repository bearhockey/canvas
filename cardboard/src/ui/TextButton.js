class TextButton extends Button
{
    static BUTTON_PADDING = 8;
    constructor(ctx, x, y, strLabel = "", objTarget = null,  iButtonAction = 0, strTextFont = null)
    {
        var iButtonWidth = TextButton.BUTTON_PADDING * 2;
        var iButtonHeight = TextButton.BUTTON_PADDING * 2;
        var strFont = (strTextFont != null) ? strTextFont : "24px serif";
        ctx.font = strFont;
        var cFontMetrics = ctx.measureText(strLabel);
        iButtonWidth += cFontMetrics.width;
        var iTextHeight = (cFontMetrics.fontBoundingBoxAscent + cFontMetrics.fontBoundingBoxDescent);
        iButtonHeight += iTextHeight;

        super(x, y, iButtonWidth, iButtonHeight, strLabel, objTarget, iButtonAction);
        this.m_strFont = strFont;
        this.m_iTextHeight = iTextHeight;
    }

    Draw(ctx)
    {
        // if (this.imgBase != null) { super.Draw(ctx); }
        ctx.fillStyle = (this.bHighlight == true) ? "#EEEEEE" : "#444444";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = (this.bHighlight == true) ? "#DEDEDE" : "#CDCDCD";
        ctx.fillRect(this.x + 3, this.y +3, this.width - 6, this.height -6);

        if (this.m_strLabel != null)
        {
            ctx.font = this.m_strFont;
            ctx.fillStyle = "#000000";
            ctx.fillText(this.m_strLabel, this.x + TextButton.BUTTON_PADDING, this.y+this.m_iTextHeight);
        }
    }
}