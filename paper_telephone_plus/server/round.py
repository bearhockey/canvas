from chain import Chain
from state import StateManager
from state import StateConst as STATE

class Round:
    def __init__(self):
        self.m_stateManager = StateManager()
        self.m_arrPlayers = []
        self.m_arrChains = []

    def GetState(self):
        return self.m_stateManager.GetState()

    def ResetPlayerStatus(self):
        for player in self.m_arrPlayers:
            player.SetWaiting(False)

    # StartRound
    def StartRound(self, arrPlayers):
        self.m_arrPlayers = arrPlayers
        self.m_arrChains = []
        iChainID = 0
        for player in self.m_arrPlayers:
            chain = Chain(iChainID, player)
            player.SetOwnedChain(chain)
            self.m_arrChains.append(chain)
            iChainID += 1

        self.m_stateManager.SetState(STATE.DRAW)

    # IsRoundOver
    def IsRoundOver(self):
        iState = -1
        bSomeoneIsNotReady = False
        for player in self.m_arrPlayers:
            if player.IsWaiting() == False:
                bSomeoneIsNotReady = True
                break

        if bSomeoneIsNotReady != True:
            if self.m_stateManager.GetState() == STATE.DRAW:
                self.m_stateManager.SetState(STATE.TEXT)
            else:
                self.m_stateManager.SetState(STATE.DRAW)

            iState = self.m_stateManager.GetState()
            self.ResetPlayerStatus()
            # shift chains and reassign them
            self.m_arrChains = self.m_arrChains[-1:] + self.m_arrChains[:-1]
            for idx, player in enumerate(self.m_arrPlayers):
                player.SetCurrentChain(self.m_arrChains[idx])

        return iState

    def AdvanceRound(self):
        pass
