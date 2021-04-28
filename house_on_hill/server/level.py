import csv
from floor import Floor
from room import Room

class Level:
    def __init__(self, iFloors = 1, iStartingFloor = 0):
        self.arrRooms = self.load_room_tiles()
        self.arrFloors = []
        for i in range(iFloors):
            self.arrFloors.append(Floor(i, self.arrRooms))
        if iStartingFloor < 0 or iStartingFloor >= len(self.arrFloors):
            self.iCurrentFloor = 0
        else:
            self.iCurrentFloor = iStartingFloor

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

    def load_room_tiles(self):
        arrRooms = []
        with open("./../data/room_data.csv", mode='r') as room_file:
            room_reader = csv.reader(room_file, delimiter='|')
            line_count = 0
            for row in room_reader:
                if line_count > 0: # idx 0 is header
                    arrRooms.append(Room(row))
                line_count += 1
        return arrRooms
