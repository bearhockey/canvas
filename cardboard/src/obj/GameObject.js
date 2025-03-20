// ----------------------------------------------------------------
// GameObject
// ----------------------------------------------------------------
class GameObject
{
    constructor(x=0, y=0, width=1, height=1, imgSrc=null, imgHighlight=null)
    {
        this.x = x;
        this.y = y;
        this.bHighlight = false;

        this.imgSrc = imgSrc;
        this.imgHighlight = imgHighlight;
        this.width = width;
        this.height = height;

        this.fnSymbol = null

        this.hitBox = { left:this.x, top:this.y, right:this.x+this.width, bottom:this.y+this.height };

        m_OM.AddObject(this);
    }

    // --------------------------------
    // Getters and setters
    // --------------------------------
    IsHighlighted()           { return this.bHighlight; }
    SetHighlight(bHighlight)  { this.bHighlight = bHighlight;}
    GetBounds()               { return this.hitBox; }

    Move(x, y)
    {
        this.x = x;
        this.y = y;
        this.hitBox = { left:this.x, top:this.y, right:this.x+this.width, bottom:this.y+this.height };
    }

    // --------------------------------
    // Draw
    //     Draws an object
    // --------------------------------
    Draw(ctx)
    {
        var imgBase = new Image();
        imgBase.ctx = ctx;
        imgBase.iX = this.x;
        imgBase.iY = this.y;
        imgBase.iWidth = this.width;
        imgBase.iHeight = this.height;
        imgBase.fnSymbol = this.fnSymbol;
        imgBase.addEventListener('load', function() 
        {
             ctx.drawImage(this, this.iX, this.iY);
             if (this.fnSymbol != null) { this.fnSymbol(); }
        }, false);
        imgBase.src = (this.bHighlight) ? this.imgHighlight : this.imgSrc;
    }
} // end of class