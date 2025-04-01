class Button extends GameObject
{
    constructor(x, y, width, height, strLabel = "", objTarget = null, iButtonAction = 0)
    {
        super(x, y, width, height);
        this.m_strLabel = strLabel;
        this.m_objTarget = objTarget;
        this.m_iButtonAction = iButtonAction;
    }

    OnClick()
    {
        if (this.m_objTarget != null && this.m_objTarget.OnButtonClick != null) { this.m_objTarget.OnButtonClick(this.m_iButtonAction); }
    }

    Draw(ctx)
    {
        if (this.imgBase != null)
        {
            super.Draw(ctx);
        }
        else
        {
            ctx.fillStyle = (this.bHighlight == true) ? "#EEEEEE" : "#444444";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#DEDEDE";
            ctx.fillRect(this.x + 3, this.y +3, this.width - 6, this.height -6);
        }
        if (this.m_strLabel != null)
        {
            ctx.font = '18px serif';
            ctx.fillStyle = "#000000";
            ctx.fillText(this.m_strLabel, this.x + 6, this.y+21);
        }
    }
}