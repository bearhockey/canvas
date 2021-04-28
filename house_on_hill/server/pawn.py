class Pawn:
    def __init__(self, iTileIdx=-1):
        self.strName = "Fred"
        self.iTileIdx = iTileIdx

    def get_json(self):
        return { 'iTileIdx':self.iTileIdx }
