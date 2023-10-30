export type Airport = {
  name: string;
  iata: string;
};

export type Route = {
  airline: string;
  airlineId: number;
  sourceAirport: string;
  sourceAirportId: number;
  destinationAirport: string;
  destinationAirportId: number;
  codeshare: string;
  stops: number;
  equipment: string;
};
