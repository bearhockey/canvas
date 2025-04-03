// ----------------------------------------------------------------
// GameObject
// ----------------------------------------------------------------
class GameObject
{
    constructor(x=0, y=0, width=1, height=1, imgSrc=null, imgHighlight=null, bAddToStage = true)
    {
        this.x = x;
        this.y = y;
        this.bHighlight = false;
        this.bCanGrab = false;
        this.m_bIsVisible = true;
        this.m_bCanPreview = false;

        this.width = width;
        this.height = height;
        this.half_width = (this.width != 0) ? this.width/2 : 0;

        this.hitBox = { left:this.x, top:this.y, right:this.x+this.width, bottom:this.y+this.height };

        this.iBaseImage = (imgSrc != null) ? g_IR.LoadImage(imgSrc) : null;
        this.iHighlightImage = (imgHighlight != null) ? g_IR.LoadImage(imgHighlight) : null;

        if (bAddToStage == true)
        {
            g_OM.AddObject(this);
        }

        this.m_strName = "Objecct " + this.idx.toString();
    }

    // --------------------------------
    // Getters and setters
    // --------------------------------
    GetWidth()                { return this.width; }
    GetHeight()               { return this.height; }
    IsHighlighted()           { return this.bHighlight; }
    SetHighlight(bHighlight)  { this.bHighlight = bHighlight;}
    GetPosition()             { return [this.x, this.y]; }
    GetBounds()               { return this.hitBox; }
    CanGrab()                 { return this.bCanGrab; }
    IsVisible()               { return this.m_bIsVisible; }
    SetVisible(bVisible)      { this.m_bIsVisible = bVisible; }
    CanPreview()              { return this.m_bCanPreview; }
    GrabObject()              { return (this.bCanGrab ? this : null); }
    GetName()                 { return this.m_strName; }

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
        if (this.m_bIsVisible == true)
        {
            g_IR.DrawImage(ctx, this.iBaseImage, this.x, this.y);
            if (this.bHighlight == true)
            {
                g_IR.DrawImage(ctx, this.iHighlightImage, this.x, this.y);
            }
        }
    }

    // --------------------------------
    // DrawCopy
    //     Draws the object manually - usually as a copy
    // --------------------------------
    DrawCopy(ctx, x, y, width, height)
    {
        g_IR.DrawImage(ctx, this.iBaseImage, x, y, width, height);
    }
} // end of class