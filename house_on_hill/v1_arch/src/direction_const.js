var DIRECTION = (function () {
  const direction = {};

  direction.NORTH = 0;
  direction.EAST = 1;
  direction.SOUTH = 2;
  direction.WEST = 3;

  direction.GetOpposite = function(iDirection)
  {
    var iReturn = -1;
    switch (iDirection)
    {
      case direction.NORTH: { iReturn = direction.SOUTH; break; }
      case direction.EAST:  { iReturn = direction.WEST;  break; }
      case direction.SOUTH: { iReturn = direction.NORTH; break; }
      case direction.WEST:  { iReturn = direction.EAST;  break; }
      default:              { break; }
    } // end switch
    return iReturn;
  };

  return direction;
}());
