var TASK = (function () {
  // main
  var task = function(iType = CONST.TASK_IDLE, objData = null)
  {
    this.iTaskType = iType;
    this.objData   = objData;

    this.GetTaskType = function() { return this.iTaskType; };
    this.GetTaskData = function() { return this.objData; };

    // ----------------
    // this.GetTaskCost
    //     Returns an object of the task's cost and type
    // ----------------
    this.GetTaskCost = function()
    {
      var iCostType = CONST.RESOURCE_REST;
      var iCostValue = 0;
      switch (this.iTaskType)
      {
        case CONST.TASK_HARVEST_RESOURCE:
        {
          iCostValue = 1;
          break;
        }
        default:
        {
          iCostValue = 0;
          break;
        }
      } // end switch

      return [ { "iCostType":iCostType, "iCostValue":iCostValue } ];
    };
  };

  return task;
}());
