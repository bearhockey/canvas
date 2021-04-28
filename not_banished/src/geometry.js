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

  return geo;
}());
