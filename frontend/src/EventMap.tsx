import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Typography,
  Container,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  MapOutlined,
  TableChartOutlined,
  Home,
  Close,
} from "@mui/icons-material";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl/mapbox";
import { EventFinderContext, EventsInfo } from "./context/context";
import { eventsInfoMock } from "./mocks";

export const EventMap = () => {
  const { eventsInfo, setEventsInfo } = useContext(EventFinderContext);
  const [eventOpen, setEventOpen] = useState<{
    id: number | null;
    open: boolean;
  }>({ id: null, open: false });
  const [loading, setLoading] = useState<boolean>(true);
  const [viewState, setViewState] = useState({
    latitude: 52.52,
    longitude: 13.405,
    zoom: 10,
  });

  const geocodeAddress = async (
    address: string
  ): Promise<{ latitude: number; longitude: number }> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.features || data.features.length === 0) {
        throw new Error("No location found for this address");
      }

      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    } catch (error) {
      console.error("Geocoding failed:", error);
      return { latitude: 52.52, longitude: 13.405 }; // Default to Berlin center
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/berlin-courses");

        if (!response.ok) {
          setEventsInfo(eventsInfoMock);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        const data = JSON.parse(text);

        const filteredData = data.index
          .filter((course: any) => {
            const datumBeginn = new Date(course.datum_beginn);
            const datumEnde = new Date(course.datum_ende);
            const filterStartDate = new Date();
            const filterEndDate = new Date();
            filterEndDate.setFullYear(filterStartDate.getFullYear() + 1);

            return (
              datumBeginn >= filterStartDate &&
              datumEnde <= filterEndDate &&
              course.ort === "Berlin" &&
              course.va_adresse.includes("Berlin")
            );
          })
          .map((course: any) => ({
            ...course,
            va_adresse: course.va_adresse.replace(/\n/g, " "),
          }));

        // Process all addresses with Promise.all for efficiency
        const geocodingPromises = filteredData.map(async (course: any) => {
          try {
            const coords = await geocodeAddress(course.va_adresse);
            return {
              id: course.id,
              latitude: coords.latitude,
              longitude: coords.longitude,
              eventInfo: course,
            } as EventsInfo;
          } catch (error) {
            console.error(`Error geocoding ${course.va_adresse}:`, error);
            return null;
          }
        });

        const geocodedEvents = (await Promise.all(geocodingPromises)).filter(
          Boolean
        ) as EventsInfo[];
        setEventsInfo(geocodedEvents);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setEventsInfo(eventsInfoMock);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [setEventsInfo]);

  const handleOpenEvent = (id: number | null) => {
    setEventOpen({ id, open: true });
  };

  const handleCloseEvent = () => {
    setEventOpen({ id: null, open: false });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Berlin Events Finder
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<Home />}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              color="inherit"
              startIcon={<TableChartOutlined />}
            >
              Table View
            </Button>
            <Button
              component={Link}
              to="/map"
              color="inherit"
              variant="outlined"
              startIcon={<MapOutlined />}
            >
              Map View
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ position: "relative", flexGrow: 1, width: "100%" }}>
        {loading ? (
          <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          >
            {eventsInfo.map((event, index) => (
              <Marker
                key={event.id}
                latitude={event.latitude}
                longitude={event.longitude}
                anchor="bottom"
              >
                <Paper
                  elevation={3}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    color: "white",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => handleOpenEvent(event.id)}
                >
                  <Typography variant="subtitle2">{index}</Typography>
                </Paper>
              </Marker>
            ))}

            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <NavigationControl />
            </div>
            <div style={{ position: "absolute", top: 120, right: 10 }}>
              <FullscreenControl />
            </div>
            <div style={{ position: "absolute", top: 160, right: 10 }}>
              <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
              />
            </div>
          </Map>
        )}
      </Box>

      {eventOpen.id !== null &&
        eventsInfo.find((event) => event.id === eventOpen.id) && (
          <Dialog
            open={eventOpen.open}
            onClose={handleCloseEvent}
            maxWidth="sm"
            fullWidth
          >
            {eventsInfo.map((event, index) => {
              if (event.id === eventOpen.id) {
                return (
                  <Card key={event.id} elevation={0}>
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          p: 2,
                          pb: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h2"
                          fontWeight="bold"
                        >
                          {event.eventInfo.kurztitel}
                        </Typography>
                        <IconButton onClick={handleCloseEvent} size="small">
                          <Close />
                        </IconButton>
                      </Box>

                      <Box sx={{ px: 2, pb: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {event.eventInfo.va_name}
                        </Typography>
                      </Box>

                      <Box sx={{ px: 2, pb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Paper
                              variant="outlined"
                              sx={{ p: 2, bgcolor: "background.default" }}
                            >
                              <Typography
                                variant="body2"
                                component="p"
                                fontWeight="medium"
                              >
                                <strong>Address:</strong>{" "}
                                {event.eventInfo.va_adresse}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Chip
                              label={`Start: ${formatDate(event.eventInfo.datum_beginn)}`}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ width: "100%" }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Chip
                              label={`End: ${formatDate(event.eventInfo.datum_ende)}`}
                              color="secondary"
                              variant="outlined"
                              size="small"
                              sx={{ width: "100%" }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })}
          </Dialog>
        )}
    </Container>
  );
};
