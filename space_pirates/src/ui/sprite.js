var SPRITE = (function () {
    // consts

    // private vars

    // main
    var sprite = function(img, fnClick = null)
    {
        this.img = img;
        this.nXPosition = 0;
        this.nYPosition = 0;

        this.fnClick = fnClick;

        this.SetPosition = function(arrPosition)
        {
            if (arrPosition != null && arrPosition.length > 1)
            {
                this.nXPosition = arrPosition[0];
                this.nYPosition = arrPosition[1];
            }
            else
            {
                console.warn("Warning: SPRITE.SetPosition called but arrPosition was invalid: ", arrPosition);
            }
        };

        this.Draw = function()
        {
            var imgSprite = new Image();
            imgSprite.iX = this.nXPosition;
            imgSprite.iY = this.nYPosition;
            imgSprite.addEventListener('load', function()
            {
              GetCanvas().drawImage(this, this.iX, this.iY);
            }, false);
            imgSprite.src = this.img;
        };
    };
  
    return sprite;
  }());
  