// consts
const FPS = 20;
const UPDATE_FREQ = 2;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
// globals - don't use if you can

// fps vars
var m_nFPSRate, m_nFPSTick;
var m_nUpdateRate, m_nUpdateTick;
var m_nNow;
var m_nStartTime;

function StartGame()
{

  // start game
  myGameArea.start();
  DrawScreen();
  // start animation
  m_nFPSRate = 1000 / FPS;
  m_nUpdateRate = 1000 / UPDATE_FREQ;
  m_nStartTime = m_nFPSTick = m_nUpdateTick = Date.now();
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
    // this.canvas.addEventListener('mousemove', MOUSE.Move);
    // this.canvas.addEventListener('click', MOUSE.LeftClick);
    // this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
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
};
