var STRUCTURE = (function () {
  // privates
  const DEFAULT_SCTRUCTURE_COLOR = "#888877";
  const DEFAULT_DOOR_COLOR = "#888822";
  // main
  var struture = function(cNodeDoor, arrNodes=[])
  {
    this.cDoorEntity = new ENTITY(null, cNodeDoor, 0, GEO.SQUARE, DEFAULT_DOOR_COLOR);
    this.arrWalls = [];
    var idx;
    for (idx = 0; idx < arrNodes.length; ++idx)
    {
      if (arrNodes[idx] != cNodeDoor)
      {
        this.arrWalls.push(new ENTITY(null, arrNodes[idx], 0, GEO.SQUARE, DEFAULT_SCTRUCTURE_COLOR, false));
      }
    }

    this.GetDoor = function() { return this.cDoorEntity; };
    this.GetDoorNode = function() { return this.GetDoor().GetNode(); };
    this.GetNode = function() { return this.GetDoorNode(); };
  };

  return struture;
}());
