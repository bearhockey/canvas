var GENERATE = (function () {
    // consts
    const DEFAULT_BOX = [10, 275, 460, 275];
    const AVATAR_WINDOW = [5, 5, 470, 590];

    const AVATAR_WINDOW_BORDER = "#EEEEEE";
    // private vars

    // main
    var gen = {};

    gen.GenerateStarBackground = function(arrBounds, nStarDensity=250)
    {
        if (arrBounds != null && arrBounds.length > 3)
        {
            var ctx = GetCanvas();
            var x1 = arrBounds[0];
            var nWidth = arrBounds[2];
            var y1 = arrBounds[1];
            var nHeight = arrBounds[3];

            var nRandX;
            var nRandY;
            var nStarWidth;

            ctx.fillStyle = "#000000";
            ctx.fillRect(x1, y1, nWidth, nHeight);
            ctx.fillStyle = "#FFFFFF";
            for (var idx=0; idx < nStarDensity; ++idx)
            {
                nStarWidth = Math.round(Math.random()*3);
                nRandX = Math.round(Math.random()*nWidth + x1);
                nRandY = Math.round(Math.random()*nHeight + y1);
                ctx.fillRect(nRandX, nRandY, nStarWidth, nStarWidth);
            }
        }
    };
 
  
    return gen;
  }());
  