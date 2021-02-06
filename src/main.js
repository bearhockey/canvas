// globals

function StartGame()
{
  const PLAY_AREA = 20;
  const CENTER_TILE = PLAY_AREA/2 * PLAY_AREA + PLAY_AREA/2;

  // start game
  myGameArea.start();
  GRID.Init(myGameArea.canvas.width);
  SCENE.Init(myGameArea.canvas.width, myGameArea.canvas.height)
  SERVER.ServerSend({"level_init": true});
  // LEVEL.Update();

  // var arrStats = [DEBUG_MOVES, 4, 4, 4]; // make big speed for debugging
  // arrPlayers.push(new PLAYER(CENTER_TILE, "red", "Player 1", arrStats));
  // arrPlayers.push(new PLAYER(CENTER_TILE, "green", "Player 2"));
  // arrPlayers.push(new PLAYER(CENTER_TILE, "blue", "Player 3"));
  // arrPlayers.push(new PLAYER(CENTER_TILE, "purple", "Player 4"));

  // arrPlayers[iCurrentPlayer].ResetMoves();
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
    Update();
  }
};

function MoveCurrentPlayer(iDirection)
{

}

function Update()
{
  //var cPawn = GetCurrentPlayer();
  // var idx = cPawn.idx;
  // var iFloor = cPawn.iFloor;
  // cPawn.Update();
  // CAMERA.CenterOn(cPawn.idx);
  // INFO_PANEL.Update(idx, iFloor);
  SERVER.ServerSend({ "level_update":true, "player_update":true, "draw":true });
}

function DrawScreen()
{
  var ctx = myGameArea.context;
  // DEBUG: this needs to be set by server
  CAMERA.iPosY = 2;
  CAMERA.iPosX = 2;
  LEVEL.Draw(ctx);
  PLAYER.Draw(ctx);
}

function UpdateStairsButton(bUseStairs = false)
{
  document.getElementById('buttonStairs').disabled = !bUseStairs;
}

function GotoNextPlayer()
{

}
