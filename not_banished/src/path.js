var PATH = (function () {
  // privates
  const PATH_COLOR = "#6666CC88";
  // main
  var path = function()
  {
    this.arrNodes = [];

    this.IsEmpty = function() { return (this.arrNodes.length < 1); };

    // ----------------
    // this.GetNextNode
    //     Returns the next node in the path
    // ----------------
    this.GetNextNode = function()
    {
      if (this.arrNodes.length > 0)
      {
        return this.arrNodes.shift();
      }

      return null;
    };

    // ----------------
    // this.GeneratePath
    //     Generates a path from one node to another, saves it in this.arrNodes
    //     Based off of A* algorithm
    //     https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/
    // @params - cStartNode:NODE - The starting node
    // @params - cEndNode  :NODE - The ending node
    // ----------------
    this.GeneratePath = function(cStartNode, cEndNode)
    {
      this.arrNodes = [];
      cStartNode.AddPathData({ f:0, g:0 });
      var arrOpenNodes = [cStartNode];
      var arrClosedNodes = [];
      var arrPath;

      // dont declare stuff in a while loop
      var cNode;
      var cCurrentNode;
      var cParentNode;
      var cNeighbor;
      var arrNeighbors;

      var nLowestIdx;
      var objPathData;

      var idx;
      while (arrOpenNodes.length > 0)
      {
        // grab the closest item so far
        for (idx = 0, nLowestIdx = 0; idx < arrOpenNodes.length; ++idx)
        {
          objPathData = arrOpenNodes[idx].GetPathData();
          if (objPathData != null && objPathData.f < arrOpenNodes[nLowestIdx].GetPathData().f)
          {
            nLowestIdx = idx;
          }
        } // end for loop

        cCurrentNode = arrOpenNodes[nLowestIdx];

        // if current node is end node, we win
        if (cCurrentNode == cEndNode)
        {
          cNode = cCurrentNode;

          while (cNode && cNode.objPathData && cNode.objPathData.cParent)
          {
            cParentNode = cNode.objPathData.cParent;
            cNode.ClearPathData();
            this.arrNodes.push(cNode);
            cNode = cParentNode;
          }
          this.arrNodes.reverse();
          return;
        }

        // Normal case
        idx = arrOpenNodes.indexOf(cCurrentNode);
        if (idx > -1) { arrOpenNodes.splice(idx, 1); }
        arrClosedNodes.push(cCurrentNode);
        arrNeighbors = FIELD.GetNodeNeighbors(cCurrentNode, true);

        for (idx = 0; idx < arrNeighbors.length; ++idx)
        {
          cNeighbor = arrNeighbors[idx];
          if (arrClosedNodes.indexOf(cNeighbor) > -1) { continue; }

          // check the g score
          var nGScore = cCurrentNode.objPathData.g + 1;
          var bIsBestG = false;

          // if neighbor is not on open list
          if (arrOpenNodes.indexOf(cNeighbor) < 0)
          {
            bIsBestG = true;
            cNeighbor.AddPathData({ h:cNeighbor.GetDistance(cEndNode) });
            arrOpenNodes.push(cNeighbor);
          }
          else if (nGScore < cNeighbor.objPathData.g)
          {
            bIsBestG = true;
          }

          if (bIsBestG)
          {
            cNeighbor.AddPathData({ cParent:cCurrentNode,
                                    g:nGScore,
                                    f:nGScore+cNeighbor.objPathData.h});
          }
        } // end for loop
      } // end while loop
    };

    // ----------------
    // this.Draw
    //     Draws the path - useful for debug purposes
    // ----------------
    this.Draw = function(ctx)
    {
      var cNode;
      var idx;
      var iLength = this.arrNodes.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cNode = this.arrNodes[idx];
        if (cNode != null) { cNode.Draw(ctx, PATH_COLOR); }
      }
    };
  }; // end of class

  return path;
}());
