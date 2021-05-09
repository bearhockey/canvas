var ISO = (function () {
  var iso = {};

  iso.DrawTile = function(ctx, arrPosition, iRadius, color)
  {
    var x = arrPosition[0];
    var y = arrPosition[1];
    var polygon = [];

    ctx.beginPath();
    ctx.moveTo(x-iRadius, y);
    polygon.push([x-iRadius, y]);
    ctx.lineTo(x, y-iRadius/2);
    polygon.push([x, y-iRadius/2]);
    ctx.lineTo(x+iRadius, y);
    polygon.push([x+iRadius, y]);
    ctx.lineTo(x, y+iRadius/2);
    polygon.push([x, y+iRadius/2]);
    ctx.lineTo(x-iRadius, y);

    ctx.fillStyle = color;
    ctx.fill();
    // geo.DrawOutline(outlineColor);

    return polygon;
  };

  return iso;
}());
