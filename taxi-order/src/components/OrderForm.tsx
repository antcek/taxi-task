import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import {
  validateAddress,
  getCrews,
  createOrder,
} from "../services/taxiService";
import { Crew } from "../types";

const OrderForm: React.FC<{
  onAddressSelect: (address: string) => void;
  selectedCrew: Crew | null;
}> = ({ onAddressSelect, selectedCrew }) => {
  const [address, setAddress] = useState("");
  const [sourceTime, setSourceTime] = useState("");
  const [crewId, setCrewId] = useState<number | null>(null);
  const [addressError, setAddressError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCrew) {
      setCrewId(selectedCrew.crew_id);
    }
  }, [selectedCrew]);

  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAddress(value);
    const isValid = await validateAddress(value);
    if (!isValid) {
      setAddressError("Адрес не найден");
    } else {
      setAddressError("");
      onAddressSelect(value);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (address && !addressError && crewId) {
      await createOrder(address, sourceTime, crewId);
      alert("Заказ создан");
    } else {
      if (!address) setAddressError("Это поле обязательное");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Typography variant="h6">Заказ такси</Typography>
      <TextField
        label="Откуда"
        value={address}
        onChange={handleAddressChange}
        error={!!addressError}
        helperText={addressError}
        fullWidth
        required
      />
      <TextField
        label="Время подачи"
        type="datetime-local"
        value={sourceTime}
        onChange={(e) => setSourceTime(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isSubmitting || !!addressError || !address || !sourceTime}
      >
        Заказать
      </Button>
      {selectedCrew && (
        <Typography variant="subtitle1" color="textSecondary">
          Подходящий экипаж: {selectedCrew.car_mark} {selectedCrew.car_model},
          {selectedCrew.car_color}, {selectedCrew.car_number}
        </Typography>
      )}
    </div>
  );
};

export default OrderForm;
