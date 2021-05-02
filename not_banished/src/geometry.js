var GEO = (function () {
  var geo = {};

  geo.CIRCLE = 1;
  geo.TRIANGLE = 2;
  geo.SQUARE = 3;

  geo.DrawOutline = function(ctx, color, iLineWidth=1)
  {
    if (color != null)
    {
      ctx.lineWidth = iLineWidth;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  };

  geo.DrawShape = function(iShape, ctx, x, y, iRadius, color, outlineColor=null)
  {
    switch (iShape)
    {
      case geo.CIRCLE:
      {
        geo.DrawCircle(ctx, x, y, iRadius, color, outlineColor);
        break;
      }
      case geo.TRIANGLE:
      {
        geo.DrawTriangle(ctx, x, y, iRadius, color, outlineColor);
        break;
      }
      case geo.SQUARE:
      {
        geo.DrawSquare(ctx, x, y, iRadius, color, outlineColor);
        break;
      }
      default: break;
    } // end switch statement
  };

  geo.DrawCircle = function(ctx, x, y, iRadius, color, outlineColor=null)
  {
    ctx.beginPath();
    ctx.arc(x, y, iRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    geo.DrawOutline(outlineColor);
  };

  geo.DrawTriangle = function(ctx, x, y, iRadius, color, outlineColor=null)
  {
    ctx.beginPath();
    ctx.moveTo(x, y-iRadius);
    ctx.lineTo(x+iRadius, y+iRadius);
    ctx.lineTo(x-iRadius, y+iRadius);
    ctx.fillStyle = color;
    ctx.fill();
    geo.DrawOutline(outlineColor);
  };

  geo.DrawSquare = function(ctx, x, y, iRadius, color, outlineColor=null)
  {
    ctx.beginPath();
    ctx.rect(x-iRadius, y-iRadius, iRadius*2, iRadius*2);
    ctx.fillStyle = color;
    ctx.fill();
    geo.DrawOutline(outlineColor);
  };

  this.DrawRoundedRect = function(ctx, xPos, yPos, iWidth, iHeight, iRadius, color, outlineColor=null)
  {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(xPos + iRadius, yPos);
    ctx.lineTo(xPos + iWidth - iRadius, yPos);
    ctx.quadraticCurveTo(xPos + iWidth,
                         yPos,
                         xPos + iWidth,
                         yPos + iRadius);
    ctx.lineTo(xPos + iWidth, yPos + iHeight - iRadius);
    ctx.quadraticCurveTo(xPos + iWidth,
                        yPos + iHeight,
                        xPos + iWidth - iRadius,
                        yPos + iHeight);
    ctx.lineTo(xPos + iRadius, yPos + iHeight);
    ctx.quadraticCurveTo(xPos,
                        yPos + iHeight,
                        xPos,
                        yPos + iHeight - iRadius);
    ctx.lineTo(xPos, yPos + iRadius);
    ctx.quadraticCurveTo(xPos,
                         yPos,
                         xPos + iRadius,
                         yPos);
    ctx.closePath();
    ctx.fill();
    if (outlineColor != null)
    {
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  };

  // --------

  geo.IsInRect = function(arrCords, objRect)
  {
    if (objRect == null
     || objRect.top == null
     || objRect.bottom == null
     || objRect.left == null
     || objRect.right == null)
     { return false; }

     if (arrCords[0] >= objRect.left && arrCords[0] <= objRect.right &&
         arrCords[1] >= objRect.top && arrCords[1] <= objRect.bottom)
     { return true; }

     return false;
  };



  return geo;
}());
