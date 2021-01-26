var SCENE = (function () {
  var scene = {};
  scene.image = new Image;
  scene.iCanvasHeight = 0;
  scene.iCanvasWidth = 0;
  scene.bImageLoaded = false;

  scene.Init = function(iWidth, iHeight)
  {
    scene.iCanvasHeight = iHeight;
    scene.iCanvasWidth = iWidth;
  };

  scene.SetScene = function(strImage)
  {
    scene.image.src = strImage;
    scene.bImageLoaded = true;
  };

  scene.Render = function(ctx)
  {
    if (scene.image)
    {
      var xPos = (scene.iCanvasWidth - 640) / 2;
      var yPos = (scene.iCanvasHeight - 360) / 2;
      var img = document.getElementById('room_preview');
      img.onload = function ()
      {
        ctx.drawImage(img, xPos, yPos);
      };
    }

    scene.bImageLoaded = false;
  };

  return scene;
}());
