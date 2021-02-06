from tile import Tile

class Floor:
    def __init__(self):
        self.arrTiles = []
        firstTile = self.add_tile(0, 0)
        firstTile.arrDoors = [1,1,1,1]

    # wrapper function so the idx of the tile is accurate
    def add_tile(self, x, y):
        newTile = Tile(len(self.arrTiles), x, y)
        self.arrTiles.append(newTile)
        return newTile

    def get_tiles(self):
        return self.arrTiles

    def json_tiles(self):
        arrJSONTiles = []
        for cTile in self.arrTiles:
            arrJSONTiles.append(cTile.get_json())
        return arrJSONTiles

    def get_tile_by_cords(self, x, y):
        bFound = False
        for cTile in self.arrTiles:
            if cTile.x == x and cTile.y == y:
                bFound = True
                break
        if bFound:
            return cTile
        else:
            return None

    def get_tile_by_idx(self, idx):
        bFound = False
        for cTile in self.arrTiles:
            if cTile.idx == idx:
                bFound = True
                break
        if bFound:
            return cTile
        else:
            return None

    def get_tile_by_direction(self, idx, iDirection):
        cTile = self.get_tile_by_idx(idx)
        if cTile is None:
            return None
        arrNewCords = cTile.get_cords_by_direction(iDirection)
        return self.get_tile_by_cords(arrNewCords[0], arrNewCords[1])

    def move_pawn(self, cPawn, iDirection):
        bTileGenerated = False
        cTile = self.get_tile_by_idx(cPawn.iTileIdx)
        if cTile is None:
            return False# soemthing bad happen
        arrNewCords = cTile.get_cords_by_direction(iDirection)
        cNewTile = self.get_tile_by_cords(arrNewCords[0], arrNewCords[1])
        if cNewTile is not None:
            # cTile.arrPawns.append(cPawn)
            h = 0
        else:
            # generate
            cNewTile = self.add_tile(arrNewCords[0], arrNewCords[1])
            cNewTile.arrDoors = [1,1,1,1]
            bTileGenerated = True

        cPawn.iTileIdx = cNewTile.idx
        return bTileGenerated
