// globals
var arrPlayers = [];
var iCurrentPlayer = 0;

function loadGame()
{
  XML.Load(startGame);
}

function startGame()
{
  const PLAY_AREA = 20;
  const CENTER_TILE = PLAY_AREA/2 * PLAY_AREA + PLAY_AREA/2;
  const DEBUG_MOVES = 99;
  // load files
  // XML.LoadRooms();
  LEVEL.LoadRoomXML();
  ITEM.LoadItemXML();

  // init UI
  INFO_PANEL.Init();
  // start game
  myGameArea.start();
  GRID.Init(myGameArea.canvas.width);
  SCENE.Init(myGameArea.canvas.width, myGameArea.canvas.height)
  LEVEL.Init(PLAY_AREA*PLAY_AREA);
  LEVEL.Update();

  var arrStats = [DEBUG_MOVES, 4, 4, 4]; // make big speed for debugging
  arrPlayers.push(new PLAYER(CENTER_TILE, "red", "Player 1", arrStats));
  // arrPlayers.push(new PLAYER(CENTER_TILE, "green", "Player 2"));
  // arrPlayers.push(new PLAYER(CENTER_TILE, "blue", "Player 3"));
  // arrPlayers.push(new PLAYER(CENTER_TILE, "purple", "Player 4"));

  arrPlayers[iCurrentPlayer].ResetMoves();
  myGameArea.Update();
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = 680;
    this.canvas.height = 680;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  Draw : function(bClear = true)
  {
    if (bClear) { this.clear(); }
    DrawScreen();
  },
  Update : function()
  {
    this.clear();
    Update();
    DrawScreen();
  }
};

function Update()
{
  var cPawn = GetCurrentPlayer();
  var idx = cPawn.idx;
  var iFloor = cPawn.iFloor;
  cPawn.Update();
  CAMERA.CenterOn(cPawn.idx);
  INFO_PANEL.Update(idx, iFloor);
}

function DrawScreen()
{
  var ctx = myGameArea.context;
  var cPlayer;

  LEVEL.Draw(ctx);
  for (var idx = 0; idx < arrPlayers.length; ++idx)
  {
    if (idx != iCurrentPlayer)
    {
      cPlayer = arrPlayers[idx];
      if (cPlayer.iFloor == LEVEL.iCurrentFloor)
      {
        cPlayer.Draw(ctx, idx);
      }
    }
  }
  // draw current player above other arrPlayers
  arrPlayers[iCurrentPlayer].Draw(ctx, 0, true);
  GRID.Draw(ctx);
  LEVEL.DrawCurrentFloorName(ctx);
  // draw number of moves left
  var iMovesLeft = GetCurrentPlayer().iMoves;
  ctx.fillStyle = (iMovesLeft > 0) ? "#669966" : "#996666";
  ctx.fillRect(myGameArea.canvas.width - 135, myGameArea.canvas.height-40, 160, 40);
  ctx.fillStyle = "#DDDDDD";
  ctx.font = "24px Arial";
  var strMoves = "Moves: " + iMovesLeft.toString();
  ctx.fillText(strMoves, myGameArea.canvas.width - 125, myGameArea.canvas.height-14);
}

function UpdateStairsButton(bUseStairs = false)
{
  document.getElementById('buttonStairs').disabled = !bUseStairs;
}

function GetCurrentPlayer()
{
  return arrPlayers[iCurrentPlayer];
}

function GotoNextPlayer()
{
  iCurrentPlayer++;
  if (iCurrentPlayer >= arrPlayers.length) { iCurrentPlayer = 0; }
  arrPlayers[iCurrentPlayer].ResetMoves();
  LEVEL.iCurrentFloor = arrPlayers[iCurrentPlayer].iFloor;
  myGameArea.Update();
}
