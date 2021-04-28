from const import Direction as dir

class Tile:
    def __init__(self, idx, x=0, y=0):
        self.idx = idx
        self.x = x
        self.y = y
        self.iState = 0
        self.arrDoors = [0,0,0,0]
        self.arrPawns = []

        self.iStairs = 0
        self.iEvent = 0

        self.strLabel = "DEFAULT"
        self.strDescription = "DESCRIPTION"
        self.strImage = ''

    def get_json(self):
        objJson = {
            'idx':self.idx,
            'x':self.x,
            'y':self.y,
            'arrDoors':self.arrDoors,
            'arrPawns':self.arrPawns,
            'strLabel':self.strLabel,
            'strDescription':self.strDescription,
            'strImage':self.strImage
        }
        return objJson

    def get_cords(self):
        return [self.x, self.y]

    def get_cords_by_direction(self, iDirection):
        xReturn = self.x
        yReturn = self.y
        if iDirection == dir.NORTH:
            yReturn -= 1
        elif iDirection == dir.SOUTH:
            yReturn += 1
        elif iDirection == dir.WEST:
            xReturn -= 1
        elif iDirection == dir.EAST:
            xReturn += 1

        return [xReturn, yReturn]

    def set_room_data(self, cRoom):
        self.iStairs = cRoom.iStairs
        self.iEvent = cRoom.iEvent

        self.strLabel = cRoom.strLabel
        self.strDescription = cRoom.strDescription
        self.strImage = cRoom.strImage
