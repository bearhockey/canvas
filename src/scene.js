var SCENE = (function () {
  var scene = {};
  var divScene;
  var divStage;
  var pSceneHeadline;
  var spanClose;

  scene.strTitle = "Fake Title";
  scene.strImage = null;

  scene.Init = function()
  {
    divScene = document.getElementById("divScene");
    divStage = document.getElementById("divStage");
    pSceneHeadline = document.getElementById("pSceneHeadline");
    spanClose = document.getElementById("buttonCloseScene");

    spanClose.onclick = function() { divScene.style.display = "none"; }
  };

  scene.SetScene = function(strTitle, strImage = null)
  {
    scene.strTitle = strTitle;
    scene.strImage = strImage;
    scene.Render();
  };

  scene.Render = function()
  {
    pSceneHeadline.innerHTML = scene.strTitle;
    if (scene.strImage)
    {
      divStage.textContent = '';
      var img = document.createElement("img");
      img.src = scene.strImage;
      divStage.appendChild(img);
    }
    // var pTitle = document.createElement("p");
    // var pNode = document.createTextNode(scene.strTitle);
    // pTitle.appendChild(pNode);
    // divStage.appendChild(pTitle);
    divScene.style.display = "block";
  };

  scene.Close = function()
  {
    divScene.style.display = "none";
  };

  return scene;
}());
