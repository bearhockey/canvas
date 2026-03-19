// consts
const CANVAS_WIDTH = 1170;
const CANVAS_HEIGHT = 540;
const PREVIEW_WIDTH = 585;
const PREVIEW_HEIGHT = 270;


var m_bEditMode = false;

var myGameArea =
{
    canvas : document.createElement("canvas"),
    start  : function()
    {
        this.canvas.width = (m_bEditMode) ? PREVIEW_WIDTH : CANVAS_WIDTH;
        this.canvas.height = (m_bEditMode) ? PREVIEW_HEIGHT : CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        document.getElementById('divCanvas').appendChild(this.canvas);
        this.canvas.addEventListener('mousemove', MOUSE.Move);
        this.canvas.addEventListener('click', MOUSE.LeftClick);
        // this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
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

// ----------------
// GetCanvas
//     Returns the canvas object
// ----------------
function GetCanvas() { return myGameArea.context; }

// ----------------
// GetCanvasWidth
//     Returns how wide ( and thus how tall ) the canvas is in pixels
// ----------------
function GetCanvasWidth()  { return myGameArea.canvas.width;  }
function GetCanvasHeight() { return myGameArea.canvas.height; }

function InEditMode() { return m_bEditMode; }

// ----------------
// Update
// ----------------
function Update()
{
    RENDER.Render();
    requestAnimationFrame(Update);
}

// ----------------
// StartGame
//     Starts the game
// ----------------
function StartGame()
{
    myGameArea.start();
    DIALOG.Init();
}

// ----------------
function EditGame()
{
    m_bEditMode = true;
    EDIT.Populate();
    StartGame();
}

// --------------------------------
// LoadFile
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
// --------------------------------
function LoadComplete()
{
    if (m_bEditMode == false) { Update(); }
    var s_load_div = document.getElementById('divLoad');
    var s_file_div = document.getElementById('divFile');
    var s_edit_div = document.getElementById('divEdit');
    if (s_load_div != null)
    {
        s_load_div.style.display = 'none';
    }
    if (s_file_div != null)
    {
        s_file_div.style.display = 'inline';
    }
    if (s_edit_div != null)
    {
        s_edit_div.style.display = 'flex';
    }
}

// --------------------------------
// LoadFailed
// --------------------------------
function LoadFailed(err)
{
    window.alert("ERROR loading file : " + err);
}
// ----------------
// end of main
