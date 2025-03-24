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
        this.bCanGrab = false;

        this.width = width;
        this.height = height;

        this.hitBox = { left:this.x, top:this.y, right:this.x+this.width, bottom:this.y+this.height };

        this.imgBase;
        this.imgHighlight;
        this.bImageLoaded = false;
        this.bHighlightLoaded = false;

        m_OM.AddObject(this);
        this.InitImg(imgSrc, imgHighlight);
    }

    // --------------------------------
    // Getters and setters
    // --------------------------------
    IsHighlighted()           { return this.bHighlight; }
    SetHighlight(bHighlight)  { this.bHighlight = bHighlight;}
    GetBounds()               { return this.hitBox; }
    CanGrab()                 { return this.bCanGrab; }

    // --------------------------------
    // --------------------------------
    InitImg(imgSrc, imgHighlight = null)
    {
        if (imgSrc != null)
        {
            this.imgBase = new Image();
            this.imgBase.object = this;
            this.imgBase.addEventListener('load', function() { this.object.bImageLoaded = true; }, false);
            this.imgBase.src = imgSrc;
        }

        if (imgHighlight != null)
        {
            this.imgHighlight = new Image();
            this.imgHighlight.object = this;
            this.imgHighlight.addEventListener('load', function() { this.object.bHighlightLoaded = true; }, false);
            this.imgHighlight.src = imgHighlight;
        }
    }

    // --------------------------------
    // Move
    // --------------------------------
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
        if (this.bImageLoaded == true)
        {
            ctx.drawImage(this.imgBase, this.x, this.y);
        }

        if (this.bHighlight == true && this.bHighlightLoaded == true)
        {
            ctx.drawImage(this.imgHighlight, this.x, this.y);
        }
    }
} // end of class