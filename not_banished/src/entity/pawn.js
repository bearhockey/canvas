var PAWN = (function () {
  // privates
  const DEFAULT_PAWN_COLOR = "#EEEEEE";
  const SHOW_CURRENT_PATH = DEBUG_ON;
  const SEARCH_RADIUS = 8;
  const PAWN_HEALTH = 100;
  const PAWN_DAMAGE = 2;
  // main
  var pawn = function(cNode, strName = "Pawn")
  {
    // overloaded methods - must be predefined
    this.GetNode = function() {};
    this.SetNode = function() {};
    // needs to be done after overloaded methods
    this.entity = new ENTITY(this, cNode, PAWN_HEALTH, GEO.CIRCLE, DEFAULT_PAWN_COLOR);

    this.GetNode = function(cNode) { return this.entity.GetNode(); };
    this.SetNode = function(cNode) { this.entity.SetNode(cNode); };

    this.GetPassable = function() { return this.entity.GetPassable(); };

    // pawn specific data
    this.strName = strName;
    this.iJobType;
    this.cInventory = new INVENTORY();
    this.arrTaskList = [];
    this.taskCurrent = null;
    this.cCurrentPath = null;

    // ----------------
    // this.AddTask
    //     Adds a task to the pawn's task list
    // ----------------
    this.AddTask = function(cPawn = this, iTaskType = 0, objData = null)
    {
      if (cPawn == null) { cPawn = this; }
      if (cPawn.arrTaskList != null)
      {
        cPawn.arrTaskList.push(new TASK(iTaskType, objData));
      }
    };

    // ----------------
    // this.AddTaskByCommand
    //     Adds a task via a command with objData (from the UI for now)
    // ----------------
    this.AddTaskByCommand = function(objData = null)
    {
      console.debug("AddTaskByCommand: " + objData.toString());
      if (objData == null || objData.cPawn == null) { return; }
      var cPawn = objData.cPawn;
      cPawn.AddTask(cPawn, objData.iTaskType, objData.objTaskData);
    };

    // ----------------
    // Inventory passthru functions
    // ----------------
    this.AddToInventory = function(iResType, iQuantity)
      { this.cInventory.AddToInventory(iResType, iQuantity); };
    this.UseInventory = function(iResType, iQuantity)
      { return this.cInventory.AddToInventory(iResType, iQuantity); };
    this.CanAffordTaskCost = function(cTask)
      { return this.cInventory.CanAffordTaskCost(cTask); };
    this.PayTaskCost = function(cTask)
      { this.cInventory.PayTaskCost(cTask); };

    // ----------------
    // this.DoTask
    //     Picks a task to do - big and should be split up
    // ----------------
    this.DoTask = function()
    {
      var bIsTaskDone = false;
      if (this.taskCurrent == null) { return; } // nothing to do
      // check if we can afford this task
      // if (this.CanAffordTaskCost(this.taskCurrent))
      // {
      // }
      switch (this.taskCurrent.GetTaskType())
      {
        case CONST.TASK_HARVEST_RESOURCE:
        {
          var iResType = this.taskCurrent.GetTaskData(); // gets resource type
          var cResource = this.GetNode().GetResource(iResType);

          if (cResource != null)
          {
            this.AddToInventory(iResType, cResource.Harvest(PAWN_DAMAGE));
            this.cCurrentPath = null;
            bIsTaskDone = (cResource.GetHealth() <= 0);
          }
          else if (this.cCurrentPath == null)
          {
            cResource = FIELD.GetNearestResource(this.GetNode(), SEARCH_RADIUS, iResType);
            if (cResource != null)
            {
              this.cCurrentPath = new PATH();
              this.cCurrentPath.GeneratePath(this.GetNode(), cResource.GetNode());
              cResource.MarkAsTarget();
            }
            else
            {
              bIsTaskDone = true;
            }
          }

          break;
        }
        case CONST.TASK_GOTO_ENTITY:
        {
          var cTarget = this.taskCurrent.GetTaskData(); // gets destination entity
          if (cTarget == null || cTarget.GetNode() == this.GetNode())
          {
            bIsTaskDone = true;
          }
          else if (this.cCurrentPath == null)
          {
            this.cCurrentPath = new PATH();
            this.cCurrentPath.GeneratePath(this.GetNode(), cTarget.GetNode());
          }

          break;
        }
        case CONST.TASK_IDLE:
        {
          this.IdleMove();
          bIsTaskDone = true;
          break;
        }
        default: break;
      } // end of switch

      if (bIsTaskDone)
      {
        this.PayTaskCost(this.taskCurrent);
        this.taskCurrent = null;
      }
    };

    // ----------------
    // this.UsePath
    //     Has the pawn travel on a path if it exists
    // ----------------
    this.UsePath = function()
    {
      var bPathIsDone = false;
      if (this.cCurrentPath != null)
      {
        var cDestination = this.cCurrentPath.GetNextNode();
        if (cDestination != null)
        {
          cDestination.PlaceEntity(this);
        }
        else
        {
          this.cCurrentPath = null;
          bPathIsDone = true;
        }
      }
      else
      {
        bPathIsDone = true;
      }

      return bPathIsDone;
    };

    // ----------------
    // this.IdleMove
    //     Pawn moves idly
    // ----------------
    this.IdleMove = function()
    {
      var arrNeighbors = FIELD.GetNodeNeighbors(this.GetNode(), true);
      var iNeighbors = arrNeighbors.length;
      var iRandomIdx = Math.floor(Math.random() * iNeighbors * 3);
      if (iRandomIdx < iNeighbors)
      {
        var cNode = arrNeighbors[iRandomIdx];
        if (cNode != null)
        {
          cNode.PlaceEntity(this);
        }
      }
    };

    // ----------------
    // this.Update
    //     Updates the pawn
    // ----------------
    this.Update = function()
    {

      if (this.cCurrentPath != null)
      {
        if (this.UsePath() == null)
        {
          this.cCurrentPath = null;
        }
      }
      else if (this.taskCurrent == null) // try to get next task if possible
      {
        if (this.arrTaskList && this.arrTaskList.length > 0)
        {
          this.taskCurrent = this.arrTaskList.shift();
        }
        else
        {
          this.arrTaskList.push(new TASK(CONST.TASK_IDLE));
        }
      }

      this.DoTask();
    };

    // ----------------
    // this.Draw
    //     Draws the pawn
    // ----------------
    this.Draw = function(ctx)
    {
      if (SHOW_CURRENT_PATH && this.cCurrentPath != null)
      {
        this.cCurrentPath.Draw(ctx);
      }
      this.entity.Draw(ctx);
    };
  };

  return pawn;
}());
