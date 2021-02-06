var PLAYER = (function () {
  // privates
  var m_arrPlayers = [];
  var m_iCurrentPlayer = 0;
  // main
  var player = {};

  player.Move = function(iDirection, iPlayer=-1)
  {
    if (iPlayer < 0 || iPlayer >= m_arrPlayers.length)
    {
      iPlayer = m_iCurrentPlayer;
    }

    var objPlayer = m_arrPlayers[iPlayer];
    var objTile = LEVEL.GetTileByIndex(objPlayer.iTileIdx);
    if (objTile.arrDoors[iDirection] > 0)
    {
      SERVER.ServerSend( { "move_pawn":iPlayer, "direction":iDirection, "draw":true } );
    }
  };

  player.Update = function(objData)
  {
    if (objData['arrPlayers']) { m_arrPlayers = objData['arrPlayers']; }
    if (objData['iCurrentPlayer'] != null)
    {
      m_iCurrentPlayer = parseInt(objData['iCurrentPlayer']);
    }
  };

  player.Draw = function(ctx, iPosition=0)
  {
    var bCurrentPlayer;
    ctx.fillStyle = "red";
    var iSize = GRID.iSize / 3;
    var objPlayer;
    var arrCords;
    var idx;
    for (idx = 0; idx < m_arrPlayers.length; ++idx)
    {
      console.log(idx);
      bCurrentPlayer = (idx == m_iCurrentPlayer);
      objPlayer = m_arrPlayers[idx];
      arrCords = LEVEL.GetTileCords(parseInt(objPlayer.iTileIdx));

      var iOffsetX = (bCurrentPlayer) ? iSize : (iSize/2 + iSize*(iPosition%2));
      var iOffsetY = (bCurrentPlayer) ? iSize : (iSize/2 + iSize*Math.floor(iPosition/2));
      console.log("Position:");
      console.log(arrCords);
      ctx.fillRect(GRID.Normalize(arrCords[0] + CAMERA.iPosX, iOffsetX),
                   GRID.Normalize(arrCords[1] + CAMERA.iPosY, iOffsetY),
                   iSize,
                   iSize);
    }
  };

  return player;
}());
