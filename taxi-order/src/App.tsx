import React, { useState } from "react";
import OrderForm from "./components/OrderForm";
import Map from "./components/Map";
import { Container, Grid } from "@mui/material";
import { Crew } from "./types";

const App: React.FC = () => {
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  const handleAddressSelect = (address: string) => {
    console.log("Address selected:", address);
  };

  const handleCrewSelect = (crews: Crew[]) => {
    if (crews.length > 0) {
      setSelectedCrew(crews[0]);
    } else {
      setSelectedCrew(null);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <OrderForm
            onAddressSelect={handleAddressSelect}
            selectedCrew={selectedCrew}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Map
            onAddressSelect={handleAddressSelect}
            onCrewSelect={handleCrewSelect}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
