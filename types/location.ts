interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationType {
  coordinates: LocationCoordinates;
  name: string;
}