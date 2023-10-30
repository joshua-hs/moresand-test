import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import { Airport, AirportDTO, Route } from './types/types';
import { AIRPORTS_API_URL, ROUTES_API_URL } from './constants';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const allRoutes: Route[] = [];
const allAirports: Airport[] = [];

app.get('/airports', (req: Request, res: Response) => {
  const airportNames: AirportDTO[] = allAirports.map((airport) => ({
    name: airport.name,
    iata: airport.iata,
  }));
  res.status(200).send(airportNames);
});

app.post('/routes', async (req: Request, res: Response) => {
  const { origin, destination } = req.body;

  const directFlights = allRoutes.filter(
    (route) =>
      route.sourceAirport === origin && route.destinationAirport === destination
  );

  res.status(200).send(directFlights);
});

async function fetchAndStoreAirports() {
  const airports = await axios.get(AIRPORTS_API_URL);

  const { data } = airports;

  const rows: string[] = data.split('\n');

  for (const row of rows) {
    const splitRow = row
      .split(',')
      .map((data: string) => data.replace(/"/g, ''));
    allAirports.push({
      id: +splitRow[0],
      name: splitRow[1],
      city: splitRow[2],
      country: splitRow[3],
      iata: splitRow[4],
      icao: splitRow[5],
      latitude: splitRow[6],
      longitude: splitRow[7],
      altitude: splitRow[8],
      timezone: splitRow[9],
      dst: splitRow[10],
      tz: splitRow[11],
      type: splitRow[12],
      source: splitRow[13],
    });
  }
}

async function fetchAndStoreRoutes() {
  const routes = await axios.get(ROUTES_API_URL);

  const { data } = routes;

  const rows: string[] = data.split('\n');

  for (const row of rows) {
    const splitRow = row
      .split(',')
      .map((data: string) => (data === `\\N` ? '' : data));
    allRoutes.push({
      airline: splitRow[0],
      airlineId: +splitRow[1],
      sourceAirport: splitRow[2],
      sourceAirportId: +splitRow[3],
      destinationAirport: splitRow[4],
      destinationAirportId: +splitRow[5],
      codeshare: splitRow[6],
      stops: +splitRow[7],
      equipment: splitRow[8],
    });
  }
}

app.listen(4005, async () => {
  await fetchAndStoreRoutes();
  await fetchAndStoreAirports();

  console.log('Listening on 4005');
});
