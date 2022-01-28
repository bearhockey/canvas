from chain import Chain

class Player:
    def __init__(self, idx, web_socket):
        self.m_idx = idx
        self.m_web_socket = web_socket
        self.m_bWaiting = False
        self.m_cOwnedChain = None
        self.m_cCurrentChain = None

    def GetIdx(self):
        return self.m_idx

    def GetWebSocket(self):
        return self.m_web_socket

    # Get/Set waiting status
    def IsWaiting(self):
        return self.m_bWaiting
    def SetWaiting(self, bWaiting):
        self.m_bWaiting = bWaiting

    # Get/Set chain
    def GetOwnedChain(self):
        return self.m_cOwnedChain
    def SetOwnedChain(self, cChain):
        self.m_cOwnedChain = cChain
        self.m_cCurrentChain = cChain # first current chain should be owned chain

    def GetCurrentChain(self):
        return self.m_cCurrentChain
    def SetCurrentChain(self, cChain):
        self.m_cCurrentChain = cChain

    def AddImageToChain(self, srcImage):
        if self.m_cOwnedChain is not None:
            self.m_cOwnedChain.AddImage(srcImage)

    def AddCaptionToChain(self, strText):
        if self.m_cOwnedChain is not None:
            self.m_cOwnedChain.AddCaption(strText)
