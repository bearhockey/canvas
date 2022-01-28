
class StateConst:
    DRAW = 1
    TEXT = 2

class StateManager:
    def __init__(self):
        self.m_iCurrentState = 0

    def GetState(self):
        return self.m_iCurrentState

    def SetState(self, iState):
        self.m_iCurrentState = iState
