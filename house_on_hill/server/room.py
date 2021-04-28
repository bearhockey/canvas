from const import FloorNum as FLR

class Room:
    def __init__(self, arrData):
        self.idx = int(arrData[0])
        self.arrCategories = list(map(int, arrData[1].split(',')))
        self.strLabel = arrData[2]
        self.strDescription = arrData[3]
        self.strImage = arrData[4]
        self.iDoors = int(arrData[5])
        self.iStairs = int(arrData[6])
        self.iEvent = int(arrData[7])

    @staticmethod
    def filter_category(cRoom, iFloor):
        if iFloor in cRoom.arrCategories:
            return True
        else:
            return False

    @staticmethod
    def filter_basement(cRoom):
        return Room.filter_category(cRoom, FLR.BASEMENT)

    @staticmethod
    def filter_ground(cRoom):
        return Room.filter_category(cRoom, FLR.GROUND)

    @staticmethod
    def filter_upper(cRoom):
        return Room.filter_category(cRoom, FLR.UPPER)
