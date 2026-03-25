// ----------------------------------------------------------------
// main.js
//     The main JS file loaded on start
// ----------------------------------------------------------------
// consts
const CANVAS_WIDTH = 1170;
const CANVAS_HEIGHT = 540;
const PREVIEW_WIDTH = 585;
const PREVIEW_HEIGHT = 270;
const LOGO_URL = "./res/logo_screen.png";

var m_bEditMode = false;

var myGameArea =
{
    canvas : document.createElement("canvas"),
    start  : function()
    {
        this.canvas.width = (m_bEditMode) ? PREVIEW_WIDTH : CANVAS_WIDTH;
        this.canvas.height = (m_bEditMode) ? PREVIEW_HEIGHT : CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        document.getElementById("divCanvas").appendChild(this.canvas);
        this.canvas.addEventListener("mousemove", MOUSE.Move);
        this.canvas.addEventListener("click", MOUSE.LeftClick);
        RENDER.DrawImage(LOGO_URL);
    },
    clear : function(strFill=null)
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (strFill != null)
        {
            this.context.fillStyle = strFill;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// --------------------------------
// GetCanvas
//     Returns the canvas object
// --------------------------------
function GetCanvas() { return myGameArea.context; }

// --------------------------------
// GetCanvasWidth
// GetCanvasHeight
//     Returns how wide / tall the canvas object is
// --------------------------------
function GetCanvasWidth()  { return myGameArea.canvas.width;  }
function GetCanvasHeight() { return myGameArea.canvas.height; }

// --------------------------------
// InEditMode
//     Returns if we are in edit mode or player mode
// --------------------------------
function InEditMode() { return m_bEditMode; }

// --------------------------------
// Update
//     Main update loop for animating
// --------------------------------
function Update()
{
    RENDER.Render();
    requestAnimationFrame(Update);
}

// --------------------------------
// StartGame
//     Starts the game
// --------------------------------
function StartGame()
{
    myGameArea.start();
    DIALOG.Init();
}

// --------------------------------
// EditGame
//     Starts the game in edit mode
// --------------------------------
function EditGame()
{
    m_bEditMode = true;
    EDIT.Populate();
    StartGame();
}

// --------------------------------
// LoadFile
//     Loads a story file for editing or playing
// --------------------------------
function LoadFile()
{
    var load_file = document.getElementById("load_file");
    if (load_file != null && load_file.value != null)
    {
        EVENTS.FetchEventsFile(load_file.value);
    }
}

// --------------------------------
// LoadComplete
//     Callback after the story file has been loaded
// --------------------------------
function LoadComplete()
{
    if (m_bEditMode == false) { Update(); }
    let s_load_div = document.getElementById("divLoad");
    let s_file_div = document.getElementById("divFile");
    let s_edit_div = document.getElementById("divEdit");

    if (s_load_div != null) { s_load_div.style.display = "none"; }
    if (s_file_div != null) { s_file_div.style.display = "block"; }
    if (s_edit_div != null) { s_edit_div.style.display = "flex";  }
}

// --------------------------------
// LoadFailed
//     xcallback after a failed file load
// --------------------------------
function LoadFailed(err)
{
    window.alert("ERROR loading file : " + err);
}

// end of main
