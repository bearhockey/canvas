# from const import FloorNum as FLR

class Ship:
    def __init__(self, strIcon, idx=-1):
        self.m_idx = idx
        self.m_strIcon = strIcon

        self.m_nPower = 1
        self.m_nEngine = 1
        self.m_nShields = 1
        self.m_nWeapons = 1
    
    def GetIcon(self):
        return self.m_strIcon
