class ImageRenderer
{
    static STATUS_UNLOADED = 0;
    static STATUS_LOADED = 1;
    constructor()
    {
        this.m_arrImages = [];
        this.m_arrImageStatus = [];
    }

    LoadImages()
    {
        this.IMG_EMPTY_PIP = this.LoadImage(CONST.PIP_EMPTY_IMG);
        this.IMG_FILLED_PIP = this.LoadImage(CONST.PIP_FILLED_IMG);
        this.CARD_SLOT_ADD = this.LoadImage(CONST.CARD_SLOT_ADD_IMG);
    }

    // --------------------------------
    // CheckForImage
    // --------------------------------
    CheckForImage(strImgPath)
    {
        var img;
        var idx;
        var iLength = this.m_arrImages.length;
        for (idx = 0; idx < iLength; ++idx)
        {
            img = this.m_arrImages[idx];
            if (img != null && img.src == strImgPath) { return idx; }
        } // end for loop

        return -1;
    }

    // --------------------------------
    // LoadImage
    // --------------------------------
    LoadImage(strImgPath)
    {
        var idx = this.CheckForImage(strImgPath);
        if (idx >= 0)
        {
            return this.m_arrImages[idx].id;
        }
        else
        {
            var img = new Image();
            img.id = this.m_arrImages.length;
            this.m_arrImages.push(img);
            this.m_arrImageStatus[img.id] = ImageRenderer.STATUS_UNLOADED;
            img.addEventListener('load', SetImage, false); // SetImage must be a global function defined in main.js
            img.src = strImgPath;
            return img.id;
        }
    }

    // --------------------------------
    // SetImageLoaded
    // --------------------------------
    SetImageLoaded(imageID) { this.m_arrImageStatus[imageID] = ImageRenderer.STATUS_LOADED; }

    // --------------------------------
    // IsImageLoaded
    // --------------------------------
    IsImageLoaded(imageID) { return (this.m_arrImageStatus[imageID] == ImageRenderer.STATUS_LOADED) }

    // --------------------------------
    // DrawImage
    //     Draws a specific image, if loaded
    // --------------------------------
    DrawImage(ctx, imageID, x, y, width=0, height=0)
    {
        if (this.IsImageLoaded(imageID))
        {
            var img = (imageID < this.m_arrImages.length) ? this.m_arrImages[imageID] : null;
            if (img != null)
            {
                if (width > 0 && height > 0) { ctx.drawImage(img, x, y, width, height); }
                else                         { ctx.drawImage(img, x, y); }
            }
        }
    }
}