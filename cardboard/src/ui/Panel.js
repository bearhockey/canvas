class Panel extends GameObject
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
        this.m_bShow = true;
        this.m_arrChildren = [];
    }

    AddChildToPanel(obj)
    {
        this.m_arrChildren.push(obj);
    }

    Close()
    {
        console.log("Close(1) ", this.m_bShow);
        this.m_bShow = false;
        console.log("Close(2) ", this.m_bShow);
    }

    Draw(ctx)
    {
        console.log("Draw? ", this.m_bShow);
        if (this.m_bShow == true)
        {
            if (this.imgBase != null)
            {
                super.Draw(ctx);
            }
            else
            {
                ctx.fillStyle = CONST.COLOR_GREY;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            if (this.m_arrChildren != null && this.m_arrChildren.length > 0)
            {
                var obj;
                var iChildren = this.m_arrChildren.length;
                for (var idx = 0; idx < iChildren; ++idx)
                {
                    obj = this.m_arrChildren[idx];
                    if (obj != null && obj.Draw != null)
                    {
                        obj.Draw(ctx);
                    }
                }
            }
        }
    }
}