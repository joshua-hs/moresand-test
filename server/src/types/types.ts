export type Route = {
  airline: string;
  airlineId?: number;
  sourceAirport: string;
  sourceAirportId?: number;
  destinationAirport: string;
  destinationAirportId?: number;
  codeshare: string;
  stops: number;
  equipment: string;
};

export type Airport = {
  id: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: string;
  longitude: string;
  altitude: string;
  timezone: string;
  dst: string;
  tz: string;
  type: string;
  source: string;
};

export type AirportDTO = {
  name: string;
  iata: string;
};
