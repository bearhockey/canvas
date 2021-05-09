var CAMERA = (function () {
  const ZOOM_MINIMUM = 1;

  var cam = {};

  // camera deals with tiles, not pixels
  cam.iHeight = 16;
  cam.iWidth = 16;
  cam.xPos = 0;
  cam.yPos = 0;
  cam.iZoom = 4;

  cam.GetCameraHeight = function() { return cam.iHeight; };
  cam.GetCameraWidth  = function() { return cam.iWidth;  };
  cam.GetCameraZoom   = function() { return cam.iZoom;   };
  cam.GetCameraCords  = function() { return [cam.xPos, cam.yPos]; };

  cam.PanCamera = function(iDirection, iDistance=1)
  {
    switch (iDirection)
    {
      case CONST.NORTH: { cam.yPos -= iDistance; break; }
      case CONST.SOUTH: { cam.yPos += iDistance; break; }
      case CONST.WEST:  { cam.xPos -= iDistance; break; }
      case CONST.EAST:  { cam.xPos += iDistance; break; }
      default: break;
    } // end switch
  };

  cam.ZoomCamera = function(iDirection)
  {
    cam.iZoom = Math.max(cam.iZoom + iDirection, ZOOM_MINIMUM);
  };

  return cam;
}());
