import { useContext, useEffect, useState } from "react"
import { Box, Button, Dialog, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import "./App.css"
import "mapbox-gl/dist/mapbox-gl.css"
import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox"
import { EventFinderContext, EventsInfo } from "./context/context"
import { eventsInfoMock } from "./mocks"

export const EventMap = () => {
  const { eventsInfo, setEventsInfo } = useContext(EventFinderContext)
  const [eventOpen, setEventOpen] = useState<{
    id: number | null
    open: boolean
  }>({ id: null, open: false })
  const geocodeAddress = async (address: any) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address,
      )}.json?access_token=pk.eyJ1IjoiamllZGQiLCJhIjoiY2t2Ynp0ZWVjOWh3dTJwdDlmZTE4dXl2YyJ9.aTXcAmgOf6hZ04SX-M6eGQ`,
    )
    const data = await response.json()
    const [longitude, latitude] = data.features[0].center

    return { latitude, longitude }
  }

  useEffect(() => {
    fetch("/api/berlin-courses")
      .then((res) => {
        if (!res.ok) {
          setEventsInfo(eventsInfoMock)
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.text()
      })
      .then((text) => {
        try {
          const data = JSON.parse(text)

          const filteredData = data.index
            .filter((course: any) => {
              const datumBeginn = new Date(course.datum_beginn)
              const datumEnde = new Date(course.datum_ende)
              const filterStartDate = new Date()
              const filterEndDate = new Date()
              filterEndDate.setFullYear(filterStartDate.getFullYear() + 1)
              return (
                datumBeginn >= filterStartDate &&
                datumEnde <= filterEndDate &&
                course.ort === "Berlin" &&
                course.va_adresse.includes("Berlin")
              )
            })
            .map((course: any) => ({
              ...course,
              va_adresse: course.va_adresse.replace(/\n/g, " "),
            }))

          // Geocode all addresses
          filteredData.forEach((course: any) => {
            geocodeAddress(course.va_adresse)
              .then((coords) => {
                //set address coordinates and remove any id duplicates
                setEventsInfo((prev: EventsInfo[]) => {
                  const existingIds = prev.map((item: EventsInfo) => item.id)
                  if (existingIds.includes(course.id)) {
                    return prev.map((item: EventsInfo) =>
                      item.id === course.id
                        ? {
                            ...item,
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            eventInfo: course,
                          }
                        : item,
                    ) as EventsInfo[]
                  }
                  return [
                    ...prev,
                    {
                      id: course.id,
                      latitude: coords.latitude,
                      longitude: coords.longitude,
                      eventInfo: course,
                    } as EventsInfo,
                  ]
                })
              })
              .catch((error) => {
                console.error("Error fetching coordinates:", error)
              })
          })
        } catch (e) {
          console.error("Failed to parse JSON:", e)
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fullscreenControlStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  }

  const navStyle: React.CSSProperties = {
    position: "absolute",
    top: 36,
    left: 0,
    padding: "10px",
  }

  const handleOpenEvent = (id: number | null) => {
    setEventOpen({ id, open: true })
  }
  console.log(eventsInfo)

  return (
    <>
      <Box>
        <h1>Map</h1>
      </Box>
      <Box className="card">
        <Box className="card">
          <Link to="/">Go to home</Link>
        </Box>
        <Box className="card">
          <Link to="/dashboard">Go to table</Link>
        </Box>
        <Map
          initialViewState={{
            latitude: 52.52,
            longitude: 13.405,
            zoom: 10,
          }}
          style={{
            width: "1000px",
            height: "1000px",
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          {eventsInfo.map((event) => (
            <Marker
              key={event.id}
              latitude={event.latitude}
              longitude={event.longitude}
              anchor="bottom"
            >
              <Button
                variant="contained"
                sx={{
                  width: "100px",
                  height: "100px",
                  padding: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  display: "block",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  "&:hover": {
                    backgroundColor: "darkblue",
                  },
                }}
                onClick={() => handleOpenEvent(event.id)}
              >
                {event.eventInfo.va_name}
              </Button>

              <Dialog
                open={eventOpen.open && eventOpen.id === event.id}
                onClose={() => setEventOpen({ id: event.id, open: false })}
                sx={{
                  "& .MuiBox-root": {
                    padding: "16px",
                  },
                }}
              >
                <Box>
                  <Typography variant="h6">
                    {event.eventInfo.va_name}
                  </Typography>
                  <Typography variant="h6">
                    <strong>{event.eventInfo.kurztitel}</strong>
                  </Typography>
                  <Typography variant="body1">
                    {event.eventInfo.va_adresse}
                  </Typography>
                  <Typography variant="body1">
                    {new Date(event.eventInfo.datum_beginn).toLocaleDateString(
                      "de-DE",
                    )}
                  </Typography>
                </Box>
              </Dialog>
            </Marker>
          ))}
          <div className="fullscreen" style={fullscreenControlStyle}>
            <FullscreenControl />
          </div>
          <div className="nav" style={navStyle}>
            <NavigationControl />
          </div>
        </Map>
      </Box>
    </>
  )
}
