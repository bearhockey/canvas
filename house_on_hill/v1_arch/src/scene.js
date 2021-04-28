var SCENE = (function () {
  var scene = {};
  var divScene;
  var divStage;
  var pSceneHeadline;
  var spanClose;

  scene.strTitle = "Fake Title";
  scene.strImage = null;
  scene.strDesc = null;

  scene.Init = function()
  {
    divScene = document.getElementById("divScene");
    divStage = document.getElementById("divStage");
    pSceneHeadline = document.getElementById("pSceneHeadline");
    spanClose = document.getElementById("buttonCloseScene");

    spanClose.onclick = function() { divScene.style.display = "none"; }
  };

  scene.SetScene = function(strTitle, strImage = null, strDesc = null, objDiv = null)
  {
    scene.strTitle = strTitle;
    scene.strImage = strImage;
    scene.strDesc = strDesc;
    scene.Render(objDiv);
  };

  scene.Render = function(objDiv = null)
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

    if (objDiv != null)
    {
      divStage.appendChild(objDiv);
    }
    // var pTitle = document.createElement("p");
    // var pNode = document.createTextNode(scene.strTitle);
    // pTitle.appendChild(pNode);
    // divStage.appendChild(pTitle);
    divScene.style.display = "block";
  };

  scene.FindItemDiv = function(objItem)
  {
    var divItem = document.createElement("div");
    divItem.className = "stage_item";

    var hItemHeader = document.createElement("h1");
    hItemHeader.innerHTML = objItem.strLabel;
    divItem.appendChild(hItemHeader);

    var pItemDesc = document.createElement("p");
    pItemDesc.innerHTML = objItem.strDesc;
    divItem.appendChild(pItemDesc);

    return divItem;
  };

  scene.UseItemDiv = function(objItem)
  {
    var divItem = document.createElement("div");
    divItem.className = "stage_item";
    var btnUse = document.createElement("button");
    btnUse.innerHTML = "USE";
    divItem.appendChild(btnUse);

    return divItem;
  };

  scene.Close = function()
  {
    divScene.style.display = "none";
  };

  return scene;
}());
