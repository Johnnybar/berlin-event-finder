import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  MapOutlined,
  TableChartOutlined,
  ExploreOutlined,
  LocationCityOutlined,
} from "@mui/icons-material";
import "./App.css";

function App() {
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
            Berlin Further Education Events Finder
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              variant="outlined"
              startIcon={<ExploreOutlined />}
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
              startIcon={<MapOutlined />}
            >
              Map View
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 800,
            width: "100%",
            textAlign: "center",
            p: 4,
            mb: 4,
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Welcome to Berlin Events Finder
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Discover upcoming further education events in Berlin, easy to browse
            and explore.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" paragraph>
            Find the fitting further education events in Berlin with our
            interactive map and detailed listings. Whether you're looking for
            courses, workshops, or programs, we've got you covered.
          </Typography>
        </Paper>

        <Grid container spacing={3} maxWidth={800}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4 }}>
                <MapOutlined
                  sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  fontWeight="bold"
                >
                  Interactive Map View
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Explore events geographically on our interactive map. See
                  where events are happening across Berlin and find those
                  closest to you.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
                <Button
                  component={Link}
                  to="/map"
                  variant="contained"
                  size="large"
                  startIcon={<ExploreOutlined />}
                  sx={{ borderRadius: 2 }}
                >
                  Open Map View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4 }}>
                <TableChartOutlined
                  sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  fontWeight="bold"
                >
                  Detailed Table View
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse all events in a comprehensive table format. Sort,
                  filter, and search through events to find exactly what you're
                  looking for.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<TableChartOutlined />}
                  sx={{ borderRadius: 2 }}
                >
                  Open Table View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LocationCityOutlined sx={{ mr: 1, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Berlin Events Finder • {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
