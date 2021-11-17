var CONTROLLER = (function () {
  var controller = {};

  // ----------------
  // MoveNorth
  //     Moves the player north
  // ----------------
  controller.MoveNorth = function(cPawn, cFloor)
  {
    return cPawn.MoveNorth(cFloor);
  };

  return controller;
}());
