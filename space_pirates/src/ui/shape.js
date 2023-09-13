var SHAPE = (function () {
    // consts
    const BORDER_WIDTH = 4;
    // private vars

    // main
    var shape = {};

    // ----------------
    // Box
    // ----------------
    shape.Box = function(arrBounds, strColor, strFill=null, strBevelColor=null)
    {
        if (arrBounds == null || arrBounds.length < 4 || strColor == null) { return; }
        var ctx = GetCanvas();
        if (ctx != null)
        {
            // we have to do this thing where we deduct half of the border width so it actually draws where we want it to
            var x1 = arrBounds[0] + (BORDER_WIDTH/2);
            var nWidth = arrBounds[2] - BORDER_WIDTH;
            var x2 = arrBounds[0] + nWidth;
            var y1 = arrBounds[1] + (BORDER_WIDTH/2);
            var nHeight = arrBounds[3] - BORDER_WIDTH;
            var y2 = arrBounds[1] + nHeight;
            if (strBevelColor != null)
            {
                ctx.strokeStyle = strBevelColor;
                ctx.lineWidth = BORDER_WIDTH*2;
                ctx.beginPath();
                ctx.moveTo(x1, y2);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x2, y1);
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.lineWidth = BORDER_WIDTH;
            ctx.strokeStyle = strColor;
            ctx.rect(x1, y1, nWidth, nHeight);
            if (strFill != null)
            {
                ctx.fillStyle = strFill;
                ctx.fill();
            }

            ctx.stroke();
        }
    };
  
    return shape;
  }());
  