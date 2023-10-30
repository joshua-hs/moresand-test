import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles.css";
import {
  Container,
  FormControl,
  Autocomplete,
  TextField,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { Airport, Route } from "./types/types";
import axios from "axios";
import { AIRPORTS_API_URL, ROUTES_API_URL } from "./constants";

export default function App() {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [airports, setAirports] = useState<Airport[] | undefined>(undefined);

  const [routes, setRoutes] = useState<Route[] | undefined>(undefined);

  function findAirports(substring: string) {
    return airports?.filter(
      (airport: Airport) =>
        airport.name?.toLowerCase().includes(substring) ||
        airport.iata?.toLowerCase().includes(substring)
    );
  }

  const originOptions = origin.length >= 3 ? findAirports(origin) : [];

  const destinationOptions =
    destination.length >= 3 ? findAirports(destination) : [];

  async function fetchAirports() {
    const res = await axios.get(AIRPORTS_API_URL);
    const { data } = res;
    setAirports(data);
  }

  useEffect(() => {
    fetchAirports();
  }, []);

  async function handleSubmit() {
    const response = await axios.post(ROUTES_API_URL, {
      origin,
      destination,
    });

    setRoutes(response.data);
  }

  function handleSetOrigin(newOrigin: Airport | null) {
    setOrigin(newOrigin?.iata ?? "");
  }

  function handleSetDestination(newDestination: Airport | null) {
    setDestination(newDestination?.iata ?? "");
  }

  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginTop: "3em" }}>
        <FormControl
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit;
          }}
          fullWidth={true}
        >
          <Stack direction="row" spacing={4} justifyContent="center">
            <Autocomplete
              options={originOptions ?? []}
              fullWidth={true}
              onInputChange={(_event, newValue) => setOrigin(newValue)}
              onChange={(_event, newValue) => handleSetOrigin(newValue)}
              getOptionLabel={(option: any) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Origin (type 3 characters)" />
              )}
            />
            <Autocomplete
              options={destinationOptions ?? []}
              fullWidth={true}
              onInputChange={(_event, newValue) => setDestination(newValue)}
              onChange={(_event, newValue) => handleSetDestination(newValue)}
              getOptionLabel={(option: any) => option.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destination (type 3 characters)"
                />
              )}
            />
          </Stack>
          <Button
            sx={{ marginTop: "4em" }}
            variant="contained"
            fullWidth={true}
            type="submit"
            onClick={handleSubmit}
          >
            Search
          </Button>
        </FormControl>

        <Box>
          <List>
            {routes?.map((route: Route, index: number) => (
              <ListItem
                key={index}
                sx={{ justifyContent: "center", textAlign: "center" }}
              >
                <ListItemText
                  primary={`${route.sourceAirport} -> ${route.destinationAirport}`}
                />
                <ListItemText primary={`Airline: ${route.airline}`} />
              </ListItem>
            ))}
            {routes?.length === 0 && (
              <Typography>Sorry, no direct flights found.</Typography>
            )}
          </List>
        </Box>
      </Container>
    </div>
  );
}
