var EVENTS = (function () {
    // consts
    const TYPE_NONE = 0;
    const TYPE_DIALOG = 1;
    const TYPE_FADE_IN = 2;
    const TYPE_FADE_OUT = 3;
    const TYPE_BACKGROUND = 4;
    const TYPE_FOREGROUND = 5;
    const TYPE_WAIT = 6;

    const DEFAULT_WAIT = 1000;
    // main
    var events = {};

    var m_file_name;
    var m_events_data;
    var m_story_name = "";
    var m_event_list = {};
    var m_event_idx = 0;

    // --------------------------------
    // NewEventFile
    // --------------------------------
    events.NewEventFile = function()
    {
        EVENTS.SetEventsData({"events":{"0":{}}});
    };

    // --------------------------------
    // FetchEventsFile
    // --------------------------------
    events.FetchEventsFile = function(strPath)
    {
        var arrPathSplit = strPath.split("/");
        m_file_name = arrPathSplit.pop();
        fetch(strPath)
            .then(response =>
            {
                if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
                return response.json();
            })
            .then(data => EVENTS.SetEventsData(data))
            .catch(error => LoadFailed(error));
    };

    // --------------------------------
    // SetEventsData
    // --------------------------------
    events.SetEventsData = function(data)
    {
        m_events_data = data;
        if (m_events_data != null && "events" in m_events_data)
        {
            m_event_list = m_events_data.events;
            LoadComplete();
            if (InEditMode()) { EDIT.EditFile(); }
            else              { EVENTS.ParseNextEvent(); }
        }
    };

    events.GetFileName = function() { return m_file_name; };

    events.GetEventsData = function() { return m_events_data; };
    events.GetEventsList = function() { return m_event_list; };
    events.GetEventByID = function(idx) { return m_event_list[idx]; }

    events.GetStoryName = function()        { return (m_events_data != null) ? m_events_data.story_name : ""; }
    events.SetStoryName = function(strName) { m_events_data.story_name = strName; };

    // ----------------
    // SetNextEventIdx
    // ----------------
    events.SetNextEventIdx = function(idx)
    {
        m_event_idx = idx;
    };
    // ----------------
    // ParseNextEvent
    // ----------------
    events.ParseNextEvent = function()
    {
        if (m_event_list[m_event_idx] != null)
        {
            var next_event = m_event_list[m_event_idx]
            if (next_event == null) { return; }

            if ("next" in next_event)
            {
                m_event_idx = next_event.next;
            }

            if (next_event.fadein == true)       { RENDER.SetFade(0.0); }
            else if (next_event.fadeout == true) { RENDER.SetFade(1.0, true); }

            if ("background" in next_event)
            {
                RENDER.SetBackground(next_event.background);
            }
            if ("foreground" in next_event)
            {
                if (next_event.foreground == "clear") { RENDER.ClearForeground(); }
                else                                  { RENDER.SetForeground(next_event.foreground); }
            }

            if ("dialog" in next_event)
            {
                DIALOG.SetText(next_event.dialog, next_event.name, next_event.italics, next_event.bold, next_event.choice);
            }
            else
            {
                EVENTS.AutoAdvance(next_event.wait);
            }
        }
        else
        {
            console.log("No next event!");
        }
    };

    // ----------------
    // AutoAdvance
    // ----------------
    events.AutoAdvance = async function(wait_time)
    {
        const x = await EVENTS.WaitOneSec(wait_time);
        EVENTS.ParseNextEvent();
    };

    // ----------------
    // WaitOneSec
    // ----------------
    events.WaitOneSec = function(wait_time = DEFAULT_WAIT)
    {
        return new Promise((resolve) => { setTimeout(() => { resolve(); }, wait_time); });
    };

    // --------
    // Editing functions
    //--------
    events.AddEvent = function(idx)
    {
        m_event_list[idx] = {"next":(idx+1)};
    };

    // --------------------------------
    // InsertEvent
    // --------------------------------
    events.InsertEvent = function(iInsertAtIdx)
    {
        if (m_event_list != null)
        {
            var iNewIdx = iInsertAtIdx +1;
            // copy object
            var list_copy = Object.assign({}, m_event_list);
            // first move everything up
            var idx;
            var iNextEvent;
            for (let [key, item] of Object.entries(list_copy))
            {
                if (item != null && item.next != null)
                {
                    iNextEvent = parseInt(item.next, 10);
                    if (iNextEvent > iNewIdx)
                    {
                        item.next = (iNextEvent + 1);
                    }

                }

                idx = parseInt(key, 10);
                if (idx > iInsertAtIdx)
                {
                    m_event_list[(idx + 1).toString()] = item;
                }
            } // end for loop
            // now insert one at the index
            m_event_list[iNewIdx.toString()] = {};
            return true;
        }

        return false;
    };

    // --------------------------------
    // SaveEvent
    // --------------------------------
    events.SaveEvent = function(idx, obj)
    {
        if (m_event_list != null && idx >= 0) { m_event_list[idx] = obj; }
    };

    // --------------------------------
    // RemoveEvent
    // --------------------------------
    events.RemoveEvent = function(iRemoveIdx)
    {
        if (m_event_list != null && iRemoveIdx >= 0)
        {
            delete m_event_list[iRemoveIdx];
            var list_copy = Object.assign({}, m_event_list);
            var idx;
            var iLargestIdx = 0;
            for (let [key, item] of Object.entries(list_copy))
            {
                if (item != null && item.next != null && item.next > iRemoveIdx)
                {
                    item.next = item.next -= 1;
                }

                idx = parseInt(key, 10);
                if (idx > iLargestIdx) { iLargestIdx = idx; }
                if (idx > iRemoveIdx)
                {
                    m_event_list[(idx - 1).toString()] = item;
                }
            } // end for loop
            delete m_event_list[iLargestIdx.toString()];
            return true;
        }

        return false;
    };

    return events;
}());
