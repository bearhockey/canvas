# from const import FloorNum as FLR

class Chain:
    def __init__(self, idx, cOwner):
        self.m_idx = idx
        self.m_cOwner = cOwner # Player class
        self.m_arrNodes = []

    def AddImage(self, srcImage):
        self.m_arrNodes.append( {'type':'image', 'data':srcImage} )

    def AddCaption(self, strText):
        self.m_arrNodes.append( {'type':'text', 'data':strText} )

    def GetLastObject(self):
        return self.m_arrNodes[-1]
