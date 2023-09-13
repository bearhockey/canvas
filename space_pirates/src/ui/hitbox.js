var HITBOX = (function () {
    // consts

    // private vars

    // main
    var hitbox = function(arrBounds, fnClick = null, arrArgs = null)
    {
        this.nXPosition = arrBounds[0];
        this.nYPosition = arrBounds[1];
        this.nWidth = arrBounds[2];
        this.nHeight = arrBounds[3];

        this.fnClick = fnClick;
        this.arrArgs = arrArgs;

        this.GetBounds = function()
        {
            return [this.nXPosition, this.nYPosition, this.nXPosition+this.nWidth, this.nYPosition+this.nHeight];
        };

        this.CheckClick = function()
        {
            
        };

        this.Click = function()
        {
            if (this.fnClick != null)
            {
                if (this.arrArgs != null)
                {
                    this.fnClick(this.arrArgs);
                }
                else
                {
                    this.fnClick();
                }
            }
        };
    };
  
    return hitbox;
  }());
  