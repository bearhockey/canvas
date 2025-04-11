var CONST = (function () {
    var c = {};

      // canvas consts
      c.CANVAS_WIDTH = 1560;
      c.CANVAS_HEIGHT = 820;
      c.CANVAS_VIEW_AREA = { left:0, top:0, right:1560, bottom:820 };
      c.CANVAS_PLAY_WIDTH = 1160;
      c.CANVAS_PLAY_HEIGHT = 820-64;
      c.CANVAS_PLAY_AREA = { left:0, top:64, right:1160, bottom:820 };
      // panel consts
      c.RIGHT_PANEL_WIDTH = 400;
      c.TOP_PANEL_HEIGHT = 64;
      // dialog consts
      c.DIALOG_X = 80;
      c.DIALOG_Y = 164;
      c.DIALOG_WIDTH = 1000;
      c.DIALOG_HEIGHT = 556;
      // color consts
      c.COLOR_BLACK     = "#101010";
      c.COLOR_GREY      = "#8B8B8B";
      c.COLOR_WHITE     = "#EEEEEE";
      c.COLOR_HIGHLIGHT = "#FFFFFF66";
      // card consts
      c.CARD_WIDTH = 75;
      c.CARD_HEIGHT = 100;
      c.CARD_WIDTH_LARGE = 150;
      c.CARD_HEIGHT_LARGE = 200;
      c.CARD_BACK_IMG = "./img/card_back.png";
      c.CARD_HIGHLIGHT_IMG = "./img/card_back_highlight.png";
      c.CARD_SLOT_IMG = "./img/card_slot.png";
      c.CARD_SLOT_ADD_IMG = "./img/card_slot_add.png";
      c.CARD_MAX_SLOTS = 4;
      c.CARD_PREVIEW_SPACING = 10;
      // button consts
      c.CLOSE_BUTTON_SIZE = 32;
      // pip consts
      c.PIP_EMPTY_IMG = "./img/pip_empty.png";
      c.PIP_FILLED_IMG = "./img/pip_filled.png";
      c.PIP_SIZE = 32;
      c.PIP_SPACING = 4;
    
      return c;
    }());