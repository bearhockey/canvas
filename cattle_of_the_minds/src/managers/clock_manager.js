var CLOCK = (function () {
  // consts
  // main
  var clock = {};

  clock.m_iPlaytime = 0;

  clock.GetTime = function() { return clock.m_iPlaytime; };
  clock.IncrementTime = function(iValue=1)
  {
    clock.m_iPlaytime += iValue;
  };

  return clock;
}());
