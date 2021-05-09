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
    var polygon;
    switch (iShape)
    {
      case geo.CIRCLE:
      {
        polygon = geo.DrawCircle(ctx, x, y, iRadius, color, outlineColor);
        break;
      }
      case geo.TRIANGLE:
      {
        polygon = geo.DrawTriangle(ctx, x, y, iRadius, color, outlineColor);
        break;
      }
      case geo.SQUARE:
      {
        polygon = geo.DrawSquare(ctx, x, y, iRadius, color, outlineColor);
        break;
      }
      default: break;
    } // end switch statement

    return polygon;
  };

  geo.DrawCircle = function(ctx, x, y, iRadius, color, outlineColor=null)
  {
    ctx.beginPath();
    ctx.arc(x, y, iRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    geo.DrawOutline(outlineColor);

    return null; // not a polygon
  };

  geo.DrawTriangle = function(ctx, x, y, iRadius, color, outlineColor=null)
  {
    var polygon = [];
    ctx.beginPath();

    ctx.moveTo(x, y-iRadius);
    polygon.push([x, y-iRadius]);
    ctx.lineTo(x+iRadius, y+iRadius);
    polygon.push([x+iRadius, y+iRadius]);
    ctx.lineTo(x-iRadius, y+iRadius);
    polygon.push([x-iRadius, y+iRadius]);

    ctx.fillStyle = color;
    ctx.fill();
    geo.DrawOutline(outlineColor);

    return polygon;
  };

  geo.DrawSquare = function(ctx, x, y, iRadius, color, outlineColor=null)
  {
    ctx.beginPath();
    ctx.rect(x-iRadius, y-iRadius, iRadius*2, iRadius*2);
    ctx.fillStyle = color;
    ctx.fill();
    geo.DrawOutline(outlineColor);

    return [ [x-iRadius, y-iRadius], [x+iRadius, y-iRadius],
             [x+iRadius, y+iRadius], [x-iRadius, y+iRadius] ];
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

  geo.IsInRect = function(arrPosition, objRect)
  {
    return (objRect != null &&
            arrPosition[0] > objRect.left &&
            arrPosition[0] < objRect.right &&
            arrPosition[1] > objRect.top &&
            arrPosition[1] < objRect.bottom);
  };

  // ----------------
  // geo.InsidePolygon
  //     Determines if a point (arrPosition) is within a polygon shape
  //     polygon is defined as an array of positions
  //     [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
  // https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon
  // ----------------
  geo.InsidePolygon = function(arrPosition, polygon)
  {
    if (polygon == null) { return false; }

    var x = arrPosition[0];
    var y = arrPosition[1];

    var bIsInside = false;
    var bIsIntersect;
    var i, j;
    var xi, xj, yi, yj;
    for (i = 0, j = polygon.length -1; i < polygon.length; j = i++)
    {
      xi = polygon[i][0];
      yi = polygon[i][1];
      xj = polygon[j][0];
      yj = polygon[j][1];

      bIsIntersect = ((yi > y) != (yj > y)) &&
                     (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (bIsIntersect)
      {
        bIsInside = !bIsInside;
      }
    } // end for loop

    return bIsInside;
  };

  return geo;
}());
