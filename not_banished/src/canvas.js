// consts
const FPS = 20;
const UPDATE_FREQ = 2;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
// globals - don't use if you can
var m_house;

var m_arrPawns = [];
var m_arrTrees = [33, 44, 66, 88, 102, 140, 144, 155, 161, 186, 200, 213, 233];
var m_arrRocks = [25, 45, 70, 80, 90, 111, 176, 181, 191, 222];
var m_arrWater = [99, 100, 114, 115, 116, 130, 131, 132, 146, 147];
var m_arrEnts = [];

// fps vars
var m_nFPSRate, m_nFPSTick;
var m_nUpdateRate, m_nUpdateTick;
var m_nNow;
var m_nStartTime;

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
  for (idx = 0; idx < m_arrWater.length; ++idx)
  {
    FIELD.GetNode(m_arrWater[idx]).bIsPassable = false;
    FIELD.GetNode(m_arrWater[idx]).color = "#001188";
  }

  var arrHouseNodes = [FIELD.GetNode(18), FIELD.GetNode(19), FIELD.GetNode(34), FIELD.GetNode(35)];
  m_house = new STRUCTURE(FIELD.GetNode(18), arrHouseNodes);

  var newPawn = new PAWN(FIELD.GetNode(136), "Joseph");
  newPawn.AddToInventory(CONST.RESOURCE_FOOD, 10); // start them with some food
  newPawn.AddToInventory(CONST.RESOURCE_REST, 10); // start well rested
  // debug stuff - add tasks
  newPawn.AddTask(newPawn, CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
  newPawn.AddTask(newPawn, CONST.TASK_GOTO_ENTITY, m_house);
  m_arrPawns.push(newPawn);

  var newPawn2 = new PAWN(FIELD.GetNode(221), "Mary");
  newPawn2.AddToInventory(CONST.RESOURCE_FOOD, 10); // start them with some food
  newPawn2.AddToInventory(CONST.RESOURCE_REST, 10); // start well rested
 // add new tasks
  newPawn2.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
  newPawn2.AddTask(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_STONE);
  m_arrPawns.push(newPawn2);

  // start game
  myGameArea.start();
  DrawScreen();
  // start animation
  m_nFPSRate = 1000 / FPS;
  m_nUpdateRate = 1000 / UPDATE_FREQ;
  m_nStartTime = m_nFPSTick = m_nUpdateTick = Date.now();
  SIDEPANEL.Update();
  window.requestAnimationFrame(Update);
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
    this.canvas.addEventListener('mousemove', MOUSE.Move);
    this.canvas.addEventListener('click', MOUSE.LeftClick);
    this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function GetCanvas() { return myGameArea.context; };

function Update(iTimeStamp)
{
  m_nNow = Date.now();
  // check update first
  var nTimeDiff = m_nNow - m_nUpdateTick;
  if (nTimeDiff > m_nUpdateRate)
  {
    UpdateArray(m_arrPawns);

    m_nUpdateTick = m_nNow - (nTimeDiff % m_nUpdateRate);
  }

  // check FPS
  nTimeDiff = m_nNow - m_nFPSTick;
  {
    DrawScreen();
    m_nFPSTick = m_nNow - (nTimeDiff % m_nFPSRate);
  }

  window.requestAnimationFrame(Update);
};

function DrawScreen()
{
  myGameArea.clear();
  var ctx = GetCanvas();
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
