from dialog import Dialog

class Player:
    def __init__(self, idx, web_socket):
        self.m_idx = idx
        self.m_web_socket = web_socket
        self.m_bWaiting = False

    def GetIdx(self):
        return self.m_idx

    def GetWebSocket(self):
        return self.m_web_socket

    # Get/Set waiting status
    def IsWaiting(self):
        return self.m_bWaiting
    def SetWaiting(self, bWaiting):
        self.m_bWaiting = bWaiting

    def ParseSocket(self, data, objResponse, stateMan):
        if data is None:
            return objResponse
        if "set_state" in data and stateMan is not None:
            stateMan.SetState(data['set_state'])
        if "get_dialog" in data:
            dialog_id = data['dialog_id'] if "dialog_id" in data else -1
            cSampleDialog = Dialog(dialog_id)
            objResponse['dialog'] = cSampleDialog.GetData()
        if "get_status" in data:
            objResponse['status'] = {'status':'very_yes'}
        if "srcImage" in data:
            pass
        elif "srcText" in data:
            pass
        if "submit" in data:
            pass

        return objResponse
