from floor import Floor

class Level:
    def __init__(self, iFloors = 1):
        self.iCurrentFloor = 0
        self.arrFloors = []
        for i in range(iFloors):
            self.arrFloors.append(Floor())

    def check_floor(self, iFloor):
        if iFloor > -1 and iFloor < len(self.arrFloors):
            return iFloor
        else:
            return self.iCurrentFloor

    def get_floor(self, iFloor):
        return self.arrFloors[self.check_floor(iFloor)]

    # make a different function if for some reason you need non-JSON
    def get_tiles(self, iFloor = -1):
        return self.arrFloors[self.check_floor(iFloor)].json_tiles()
