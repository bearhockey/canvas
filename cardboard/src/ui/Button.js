class Button extends GameObject
{
    constructor(x, y, width, height, fnOnClick = null)
    {
        super(x, y, width, height);
        this.fnOnClick = fnOnClick;
    }

    OnClick()
    {
        console.log("Button.OnClick()");
        if (this.fnOnClick != null) { this.fnOnClick(); }
    }

    Draw(ctx)
    {
        if (this.imgBase != null)
        {
            super.Draw(ctx);
        }
        else
        {
            ctx.fillStyle = "#444444";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#DEDEDE";
            ctx.fillRect(this.x + 3, this.y +3, this.width - 6, this.height -6);
        }
    }
}