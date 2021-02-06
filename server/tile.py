from const import Direction as dir

class Tile:
    def __init__(self, idx, x=0, y=0):
        self.idx = idx
        self.x = x
        self.y = y
        self.iState = 0
        self.arrDoors = [0,0,0,0]
        self.arrPawns = []

    def get_json(self):
        objJson = {
            'idx':self.idx,
            'x':self.x,
            'y':self.y,
            'arrDoors':self.arrDoors,
            'arrPawns':self.arrPawns
        }
        return objJson

    def get_cords(self):
        return [self.x, self.y]
        # return { 'x':self.x, 'y':self.y }

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
