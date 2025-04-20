import { Box } from "@mui/material"
import { Link } from "react-router-dom"
import { DataGrid } from "@mui/x-data-grid"
import { useContext, useEffect } from "react"
import { EventFinderContext } from "./context/context"
import { eventsInfoMock } from "./mocks"

export const Dashboard = () => {
  const { eventsInfo, setEventsInfo, loading } = useContext(EventFinderContext)

  useEffect(() => {
    if (!eventsInfo.length) {
      setEventsInfo(eventsInfoMock)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!Array.isArray(eventsInfo) || eventsInfo.length === 0) {
    return <div>Loading events...</div>
  }

  const adjustedRows = eventsInfo.map((event) => event.eventInfo)

  return (
    <>
      <h1>Events</h1>
      <Box className="card">
        <Link to="/map">Go to map</Link>
      </Box>
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        rows={adjustedRows && !loading ? adjustedRows : []}
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          {
            field: "kurztitel",
            headerName: "Event Name",
            width: 200,
          },
          {
            field: "ort",
            headerName: "Location",
            width: 150,
          },
        ]}
        pageSizeOptions={[10, 25, 50]}
      />
    </>
  )
}
