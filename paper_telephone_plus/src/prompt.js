var PROMPT = (function () {
  // const
  const DIV_TEXT_ID  = "divTextInput";
  const PROMPT_ID = "textPrompt";
  const PROMPT_INPUT = "text_input";
  // function
  var p = {};

  p.x = 1;

  // ----------------
  // LoadPrompt
  // ----------------
  p.LoadPrompt = function(strText)
  {
    var idPrompt  = document.getElementById(PROMPT_ID);
    if (strText != null && strText != "")
    {
      idPrompt.innerHTML = strText;
    }
  };

  // ----------------
  // GetPromptText
  // ----------------
  p.GetPromptText = function()
  {
    var idInput = document.getElementById(PROMPT_INPUT);
    return idInput.value;
  };

  p.ClearInput = function()
  {
    var idInput = document.getElementById(PROMPT_INPUT);
    idInput.value = "";
  };

  p.ShowInput = function()
  {
    var divText = document.getElementById(DIV_TEXT_ID);
    divText.style.display = "block";
  }

  // ----------------
  // HideInput
  // ----------------
  p.HideInput = function()
  {
    var idInput = document.getElementById(PROMPT_INPUT);
    idInput.value = "";
    var divText = document.getElementById(DIV_TEXT_ID);
    // we need to slightly delay the hiding because for some reason it tries to hide before input value is clear
    setTimeout(() => { divText.style.display = "none"; }, 10);
  };

  return p;
}());
