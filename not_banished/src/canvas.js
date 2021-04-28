// consts
const FPS = 4;
// globals - don't use if you can
var m_house;

var m_arrPawns = [];
var m_arrTrees = [33, 44, 66, 88, 102, 140, 144, 155, 161, 186, 200, 213, 233];
var m_arrRocks = [25, 45, 70, 80, 90, 111, 176, 181, 191, 222];
var m_arrEnts = [];

// fps vars
var nFPS;
var nThen;
var nNow;
var nStartTime;

function StartGame()
{
  // pre-setup
  FIELD.Init();
  var idx;
  for (idx = 0; idx < m_arrTrees.length; ++idx)
  {
    m_arrEnts.push(new RESOURCE(FIELD.GetNode(m_arrTrees[idx]), CONST.RESOURCE_TREE));
  }
  for (idx = 0; idx < m_arrRocks.length; ++idx)
  {
    m_arrEnts.push(new RESOURCE(FIELD.GetNode(m_arrRocks[idx]), CONST.RESOURCE_STONE));
  }

  var arrHouseNodes = [FIELD.GetNode(18), FIELD.GetNode(19), FIELD.GetNode(34), FIELD.GetNode(35)];
  m_house = new STRUCTURE(FIELD.GetNode(18), arrHouseNodes);

  var newPawn = new PAWN(FIELD.GetNode(136));
  newPawn.AddToInventory(CONST.RESOURCE_FOOD, 10); // start them with some food
  newPawn.AddToInventory(CONST.RESOURCE_REST, 10); // start well rested
  // debug stuff - add tasks
  newPawn.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
  newPawn.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_STONE);
  newPawn.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
  newPawn.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
  newPawn.AddTask(CONST.TASK_GOTO_ENTITY, m_house);

  m_arrPawns.push(newPawn);
  /*
  newPawn = new PAWN(FIELD.GetNode(221));
  newPawn.AddToInventory(CONST.RESOURCE_FOOD, 10); // start them with some food
  newPawn.AddToInventory(CONST.RESOURCE_REST, 10); // start well rested

  newPawn.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
  newPawn.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_STONE);
  m_arrPawns.push(newPawn);
  */

  // start game
  myGameArea.start();
  DrawScreen();
  // start animation
  nFPS = 1000 / FPS;
  nStartTime = nThen = Date.now();
  window.requestAnimationFrame(Update);
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = 720;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function Update(iTimeStamp)
{
  nNow = Date.now();
  var nTimeDiff = nNow - nThen;
  if (nTimeDiff > nFPS)
  {
    console.debug(m_arrPawns);
    UpdateArray(m_arrPawns);
    DrawScreen();
    nThen = nNow - (nTimeDiff % nFPS);
  }

  window.requestAnimationFrame(Update);
};

function DrawScreen()
{
  myGameArea.clear();
  var ctx = myGameArea.context;
  FIELD.Draw(ctx, DEBUG_ON);
};

function UpdateArray(arrTarget)
{
  if (arrTarget == null) { return; }
  var idx;
  var iLength = arrTarget.length;
  for (idx = 0; idx < iLength; ++idx)
  {
    if (arrTarget[idx]) { arrTarget[idx].Update(); }
  }
};

function DrawArray(ctx, arrTarget)
{
  var idx;
  var iLength = arrTarget.length;
  for (idx = 0; idx < iLength; ++idx)
  {
    if (arrTarget[idx])
    {
      arrTarget[idx].Draw(ctx);
    }
  }
};
