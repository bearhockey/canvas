var CAMERA = (function () {
  var cam = {};

  cam.iPosX = 0;
  cam.iPosY = 0;

  cam.CenterOnPos = function(cCords)
  {
    cam.iPosX = cCords.x - Math.floor(GRID.iWidth/2);
    cam.iPosY = cCords.y - Math.floor(GRID.iHeight/2);
  };

  cam.CenterOn = function(idx)
  {
    cam.CenterOnPos(LEVEL.GetTileCords(idx));
  };

  return cam;
}());
