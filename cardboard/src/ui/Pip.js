class Pip
{
    constructor(x, y, width = CONST.PIP_SIZE, strEmptyImg = CONST.PIP_EMPTY_IMG, strFilledImg = CONST.PIP_FILLED_IMG)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = width;
        this.strEmptyImg = strEmptyImg;
        this.strFilledImg = strFilledImg;
        this.imgEmpty;
        this.imgFilled;
        this.bImgEmptyLoaded = false;
        this.bImgFilledLoaded = false;

        this.m_bIsFilled = false;

        this.InitImg(strEmptyImg, strFilledImg);
    }

    // --------------------------------
    // InitImg
    // --------------------------------
    InitImg(strEmpty, strFilled)
    {
        if (strEmpty != null)
        {
            this.imgEmpty = new Image();
            this.imgEmpty.object = this;
            this.imgEmpty.addEventListener('load', function() { this.object.bImgEmptyLoaded = true; }, false);
            this.imgEmpty.src = strEmpty;
        }

        if (strFilled != null)
        {
            this.imgFilled = new Image();
            this.imgFilled.object = this;
            this.imgFilled.addEventListener('load', function() { this.object.bImgFilledLoaded = true; }, false);
            this.imgFilled.src = strFilled;
        }
    }

    // --------------------------------
    // Draw
    //     Draws the pip
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
}