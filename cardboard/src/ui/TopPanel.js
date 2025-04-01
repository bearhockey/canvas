class TopPanel extends Panel
{
    static V_PADDING = 8;
    static H_PADDING = 10;
    static BUTTON_SPACING = 8;
    constructor(width, height)
    {
        super(0, 0, width, height);

        // this.m_arrButtons = [];
        this.m_iNextButtonPosition = 160;

        this.m_iLeftPadding = this.x + TopPanel.H_PADDING;
        this.m_iTopPadding = this.y + TopPanel.V_PADDING;
        this.m_iTextPadding = this.m_iTopPadding + 26; // text draws from the bottom so add the text height
    }

    // --------------------------------
    // AddButtonToPanel
    // --------------------------------
    AddButtonToPanel(cButton)
    {
        if (cButton != null && cButton.Move != null)
        {
            cButton.Move(this.m_iNextButtonPosition, this.m_iTopPadding);
            this.m_arrChildren.push(cButton);
            this.m_iNextButtonPosition += cButton.GetWidth() + TopPanel.BUTTON_SPACING;
        }
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        super.Draw(ctx);
        ctx.fillStyle = "#000000";
        ctx.font = '26px serif';
        ctx.fillText("TURN : " + g_Colony.GetTurn().toString(), this.m_iLeftPadding, this.m_iTextPadding);
    }
}