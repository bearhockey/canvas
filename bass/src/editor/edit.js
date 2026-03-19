var EDIT = (function () {
    // consts
    const OUTPUT_FILE_DEFAULT = "new_story.json";
    // main
    var edit = {};

    var s_story_name;
    var s_export_file;

    var s_event_list;

    var s_idx_label;
    var s_label_edit;
    var s_name_edit;
    var s_italics;
    var s_bold;
    var s_dialog_edit;

    var s_next_event;
    var s_background_scene;
    var s_foreground_scene;
    var s_effects_scene;
    var s_fade_in;
    var s_fade_out;
    var s_wait_time;


    var s_choice_div_a;
    var s_choice_div_b;
    var s_choice_div_c;
    var s_choice_div_d;
    var m_arrChoices;

    var s_save_event;

    var m_iChoices = 0;

    var m_bPendingEventChange = false;

    // --------------------------------
    // AddEvent
    // --------------------------------
    edit.AddEvent = function()
    {
        if (s_event_list != null)
        {
            var count = s_event_list.options.length;
            EVENTS.AddEvent(count);
            EDIT.EditFile();
        }
    };

    // --------------------------------
    // EditEvent
    // --------------------------------
    edit.EditEvent = function()
    {
        if (s_event_list != null)
        {
            var idx = s_event_list.selectedIndex;
            var ev = EVENTS.GetEventByID(idx);
            if (ev != null)
            {
                // center panel
                if (s_idx_label != null)   { s_idx_label.innerHTML = idx; }
                if (s_label_edit != null)  { s_label_edit.value = ev["label"] != null ? ev["label"] : ""; }
                if (s_name_edit != null)   { s_name_edit.value = ev["name"] != null ? ev["name"] : ""; }
                if (s_italics != null)     { s_italics.checked = ev["italics"] != null ? ev["italics"] : false; }
                if (s_bold != null)        { s_bold.checked = ev["bold"] != null ? ev["bold"] : false; }
                if (s_dialog_edit != null) { s_dialog_edit.value = ev["dialog"] != null ? ev["dialog"] : ""; }
                // left side panel
                if (s_next_event != null)       { s_next_event.value = ev["next"] != null ? ev["next"] : ""; }
                if (s_wait_time != null)        { s_wait_time.value = ev["wait"] != null ? ev["wait"] : ""; }
                if (s_background_scene != null) { s_background_scene.value = ev["background"] != null ? ev["background"] : ""; }
                EDIT.PreviewBackground();
                if (s_foreground_scene != null) { s_foreground_scene.value = ev["foreground"] != null ? ev["foreground"] : ""; }
                EDIT.PreviewForeground();
                if (s_effects_scene != null) { s_effects_scene.value = ev["effects"] != null ? ev["effects"] : ""; }
                EDIT.PreviewEffects();
                if (s_fade_in != null)          { s_fade_in.checked = ev["fadein"] != null ? ev["fadein"] : false; }
                if (s_fade_out != null)         { s_fade_out.checked = ev["fadeout"] != null ? ev["fadeout"] : false; }
                // choice panel
                if (m_arrChoices != null && m_arrChoices.length > 0)
                {
                    var arrEventChoices = ev["choice"];
                    var objChoice;
                    var divChoice;
                    var iChoice;
                    var iLength = m_arrChoices.length;
                    for (iChoice = 0; iChoice < iLength; ++iChoice)
                    {
                        divChoice = m_arrChoices[iChoice];
                        if (divChoice != null)
                        {
                            objChoice = (arrEventChoices != null && iChoice < arrEventChoices.length) ? arrEventChoices[iChoice] : null;
                            var arrInputs = divChoice.getElementsByClassName("choice_text");
                            var choice_text = (arrInputs != null && arrInputs.length > 0) ? arrInputs[0] : null;
                            if (choice_text != null)
                            {
                                choice_text.value = (objChoice != null) ? objChoice.text : "";
                            }
                            var arrNumbers = divChoice.getElementsByClassName("short");
                            var choice_target = (arrNumbers != null && arrNumbers.length > 0) ? arrNumbers[0] : null;
                            if (choice_target != null)
                            {
                                choice_target.value = (objChoice != null) ? objChoice.target : "";
                            }
                        }
                    } // end for loop
                }

            } // end event data null check
        } // end s_event_list check
    };

    // --------------------------------
    // EditFile
    // --------------------------------
    edit.EditFile = function()
    {
        if (s_story_name != null && EVENTS.GetStoryName() != null)
        {
            s_story_name.value = EVENTS.GetStoryName();
        }
        if (s_export_file != null && EVENTS.GetFileName() != null)
        {
            s_export_file.value = EVENTS.GetFileName();
        }

        if (s_event_list != null)
        {
            s_event_list.options.length = 0;
            var events = EVENTS.GetEventsList();
            var strLabel = "";
            for (let [key, item] of Object.entries(events))
            {
                strLabel = "[" + key + "] " + (events[key]["label"] != null ? events[key]["label"] : "Event: " + key);
                s_event_list.add(new Option(strLabel, key, false, false));
            }
        }
    };

    // --------------------------------
    // FieldChanged
    // --------------------------------
    edit.FieldChanged = function()
    {
        if (m_bPendingEventChange == false && s_save_event != null)
        {
            m_bPendingEventChange = true;
            s_save_event.className = "unsaved";
        }
    };

    // --------------------------------
    // InsertEvent
    // --------------------------------
    edit.InsertEvent = function()
    {
        if (s_event_list != null)
        {
            var idx = s_event_list.selectedIndex;
            var bSuccess = EVENTS.InsertEvent(idx);
            if (bSuccess == true)
            {
                EDIT.EditFile();
            }
        }
    };

    // --------------------------------
    // NewFile
    // --------------------------------
    edit.NewFile = function()
    {
        EVENTS.NewEventFile();
    };

    // --------------------------------
    // Populate
    // --------------------------------
    edit.Populate = function()
    {
        s_story_name = document.getElementById('story_name');
        s_export_file = document.getElementById('file_name');
        s_event_list = document.getElementById('eventList');

        s_idx_label = document.getElementById('idx');
        s_label_edit = document.getElementById('event_label');
        s_name_edit = document.getElementById('dialog_name');
        s_italics = document.getElementById('italics');
        s_bold = document.getElementById('bold');
        s_dialog_edit = document.getElementById('dialog');

        s_next_event = document.getElementById('next');
        s_wait_time = document.getElementById('wait_time');
        s_background_scene = document.getElementById('background');
        s_foreground_scene = document.getElementById('foreground');
        s_effects_scene = document.getElementById('effects');
        s_fade_in = document.getElementById('fadein');
        s_fade_out = document.getElementById('fadeout');

        s_choice_a = document.getElementById("divChoice_a");
        s_choice_b = document.getElementById("divChoice_b");
        s_choice_c = document.getElementById("divChoice_c");
        s_choice_d = document.getElementById("divChoice_d");
        m_arrChoices = [s_choice_a, s_choice_b, s_choice_c, s_choice_d];

        s_save_event = document.getElementById('save_event');
    };

    // --------------------------------
    // PreviewBackground
    // --------------------------------
    edit.PreviewBackground = function()
    {
        if (s_background_scene != null && s_background_scene.value != "")
        {
            RENDER.SetBackground(s_background_scene.value);
        }
    };

    // --------------------------------
    // PreviewForeground
    // --------------------------------
    edit.PreviewForeground = function()
    {
        if (s_foreground_scene != null && s_foreground_scene.value != "")
        {
            RENDER.SetForeground(s_foreground_scene.value);
        }
    }

    // --------------------------------
    // PreviewEffects
    // --------------------------------
    edit.PreviewEffects = function()
    {
        if (s_effects_scene != null && s_effects_scene.value != "")
        {
            RENDER.SetBackground(s_foreground_scene.value);
        }
    }

    // --------------------------------
    // RemoveEvent
    // --------------------------------
    edit.RemoveEvent = function()
    {
        if (s_event_list != null)
        {
            var idx = s_event_list.selectedIndex;
            var bSuccess = EVENTS.RemoveEvent(idx);
            if (bSuccess == true)
            {
                EDIT.EditFile();
            }
        }
    };

    // --------------------------------
    // SaveChoices
    // --------------------------------
    edit.SaveChoices = function()
    {
        var idx;
        var iLength = m_arrChoices.length;
        var arrSavedChoices = [];
        for (idx = 0; idx < iLength; ++idx)
        {
            var divChoice = m_arrChoices[idx];
            if (divChoice != null)
            {
                var arrInputs = divChoice.getElementsByClassName("choice_text");
                var strText = (arrInputs != null && arrInputs.length > 0) ? arrInputs[0].value : "";
                var arrNumbers = divChoice.getElementsByClassName("short");
                var iTarget = (arrNumbers != null && arrNumbers.length > 0) ? arrNumbers[0].value : "";
                if (strText != "" && iTarget != "")
                {
                    arrSavedChoices.push( {"text":strText, "target":iTarget} );
                }
            }
        } // end for loop

        return arrSavedChoices;
    };

    // --------------------------------
    // SaveEvent
    // --------------------------------
    edit.SaveEvent = function()
    {
        if (s_event_list != null)
        {
            if (m_bPendingEventChange == false)
            {
                console.log("Nothing was changed so nothing to save!");
                return;
            }

            var idx = s_event_list.selectedIndex;
            var objSaveData = {};

            if (s_label_edit != null && s_label_edit.value != "") { objSaveData.label = s_label_edit.value; }
            if (s_name_edit != null && s_name_edit.value != "") { objSaveData.name = s_name_edit.value; }
            if (s_italics != null && s_italics.checked) { objSaveData.italics = true; }
            if (s_bold != null && s_bold.checked) { objSaveData.bold = true; }
            if (s_dialog_edit != null && s_dialog_edit.value != "") { objSaveData.dialog = s_dialog_edit.value; }

            if (s_next_event != null && s_next_event.value != "") { objSaveData.next = s_next_event.value; }
            if (s_wait_time != null && s_wait_time.value != "") { objSaveData.wait = s_wait_time.value; }
            if (s_background_scene != null && s_background_scene.value != "") { objSaveData.background = s_background_scene.value; }
            if (s_foreground_scene != null && s_foreground_scene.value != "") { objSaveData.foreground = s_foreground_scene.value; }

            if (s_fade_in != null && s_fade_in.checked) { objSaveData.fadein = true; }
            if (s_fade_out != null && s_fade_out.checked) { objSaveData.fadeout = true; }

            var arrChoices = EDIT.SaveChoices();
            if (arrChoices != null && arrChoices.length > 0)
            {
                objSaveData.choice = arrChoices;
            }

            EVENTS.SaveEvent(idx, objSaveData);
            EDIT.EditFile(); // reload side bar

            m_bPendingEventChange = false;
            if (s_save_event != null) { s_save_event.className = "saved"; }
        }
    };

    // --------------------------------
    // SaveFile
    // --------------------------------
    edit.SaveFile = function()
    {
        if (s_story_name != null && s_story_name.value != "")
        {
            EVENTS.SetStoryName(s_story_name.value);
        }

        var data = EVENTS.GetEventsData();
        var jsonData = JSON.stringify(data);
        var a = document.createElement("a");
        var file = new Blob([jsonData], {type:'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = (s_export_file != null && s_export_file.value != "") ? s_export_file.value : OUTPUT_FILE_DEFAULT;
        a.click();
    };

    return edit;
}());
