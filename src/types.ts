interface Directions {
  searchType: number;
  outTrafficCheck: number;
  busCount: number;
  subwayCount: number;
  subwayBusCount: number;
  pointDistance: number;
  startRadius: number;
  endRadius: number;
  path: Path[];
}

interface Path {
  pathType: number;
  info: Info;
  subPath: SubPath[];
}

interface Info {
  trafficDistance: number;
  totalWalk: number;
  totalTime: number;
  payment: number;
  busTransitCount: number;
  subwayTransitCount: number;
  mapObj: string;
  firstStartStation: string;
  lastEndStation: string;
  totalStationCount: number;
  busStationCount: number;
  subwayStationCount: number;
  totalDistance: number;
  totalWalkTime: number;
  checkIntervalTime: number;
  checkIntervalTimeOverYn: string;
  totalIntervalTime: number;
}

interface SubPath {
  trafficType: number;
  distance: number;
  sectionTime: number;
  stationCount?: number;
  lane?: Lane[];
  intervalTime?: number;
  startName?: string;
  startX?: number;
  startY?: number;
  endName?: string;
  endX?: number;
  endY?: number;
  way?: string;
  wayCode?: number;
  door?: string;
  startID?: number;
  endID?: number;
  startExitNo?: string;
  startExitX?: number;
  startExitY?: number;
  endExitNo?: string;
  endExitX?: number;
  endExitY?: number;
  passStopList?: PassStopList;
}

interface Lane {
  name: string;
  subwayCode: number;
  subwayCityCode: number;
  busNo?: string;
  type?: number;
  busID?: number;
  busLocalBlID?: string;
  busCityCode?: number;
  busProviderCode?: number;
}

interface PassStopList {
  stations: Station[];
}

interface Station {
  index: number;
  stationID: number;
  stationName: string;
  x: string;
  y: string;
  stationCityCode?: number;
  stationProviderCode?: number;
  localStationID?: string;
  arsID?: string;
  isNonStop?: string;
}

export { Directions, Path, Info, SubPath, Lane, PassStopList, Station }