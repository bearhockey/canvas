var SYMBOL = (function () {
  //
  const PAWN_DEFAULT_COLOR = #EEEEEE;
  //
  var sym = {};

  sym.Pawn = function(arrPos, color=PAWN_DEFAULT_COLOR)
  {
    GEO.DrawShape(GEO.CIRCLE,
                 GetCanvas(),
                 arrPos[0],
                 arrPos[1],
                 FIELD.GetNodeSize()/4,
                 color);
  };

  return sym;
}());
