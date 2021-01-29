var SCENE = (function () {
  var scene = {};
  var divScene;
  var divStage;
  var pSceneHeadline;
  var spanClose;

  scene.strTitle = "Fake Title";
  scene.strImage = null;
  scene.strDesc = null;
  scene.iEventType = 0;

  scene.Init = function()
  {
    divScene = document.getElementById("divScene");
    divStage = document.getElementById("divStage");
    pSceneHeadline = document.getElementById("pSceneHeadline");
    spanClose = document.getElementById("buttonCloseScene");

    spanClose.onclick = function() { divScene.style.display = "none"; }
  };

  scene.SetScene = function(strTitle, strImage = null, strDesc = null, iEventType = 0, objEvent = null)
  {
    scene.strTitle = strTitle;
    scene.strImage = strImage;
    scene.strDesc = strDesc;
    scene.iEventType = iEventType;
    scene.Render(objEvent);
  };

  scene.Render = function(objEvent = null)
  {
    pSceneHeadline.innerHTML = scene.strTitle;
    divStage.textContent = '';
    if (scene.strImage)
    {
      var img = document.createElement("img");
      img.src = scene.strImage;
      divStage.appendChild(img);
    }

    if (scene.strDesc)
    {
      var pDesc = document.createElement("p");
      pDesc.innerHTML = scene.strDesc;
      divStage.appendChild(pDesc);
    }

    if (scene.iEventType > 0 && objEvent != null)
    {
      var divItem = document.createElement("div");
      divItem.className = "stage_item";
      var hItemHeader = document.createElement("h1");
      hItemHeader.innerHTML = objEvent.strLabel;
      var pItemDesc = document.createElement("p");
      pItemDesc.innerHTML = objEvent.strDesc;
      divItem.appendChild(hItemHeader);
      divItem.appendChild(pItemDesc);
      divStage.appendChild(divItem);
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
