var STRINGUTILS = (function () {
    // consts

    // private vars

    // main
    var s = {};

    // ----------------
    // Draw?
    // ----------------
    s.GetLines = function(text, iMaxWidth)
    {
        var ctx = GetCanvas();
        var arrWords = text.split(" ");
        var arrLines = [];
        var arrCurrentLine = arrWords[0];

        var strWord;
        var iWordsLength = arrWords.length;
        var idx;
        var iWidth;
        for (idx = 1; idx < iWordsLength; ++idx)
        {
            strWord = arrWords[idx];
            iWidth = ctx.measureText(arrCurrentLine + " " + strWord).width;
            if (iWidth < iMaxWidth)
            {
                arrCurrentLine += " " + strWord;
            }
            else
            {
                arrLines.push(arrCurrentLine);
                arrCurrentLine = strWord;
            }
        }
        
        arrLines.push(arrCurrentLine);
        return arrLines;
    };
  
    return s;
  }());
  