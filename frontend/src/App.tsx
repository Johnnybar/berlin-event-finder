import "./App.css"
import { Link } from "react-router-dom"
import { Box } from "@mui/material"

function App() {
  return (
    <>
      <h1>Event Finder App</h1>
      <Box className="card">
        <Link to="/map">Go to Map to see this year's Berlin events</Link>
      </Box>
    </>
  )
}

export default App
