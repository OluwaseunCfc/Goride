import api from "./axios";

// Get available slots for a driver
export async function fetchDriverSlots(driverId) {
  try {
    const response = await api.get(`/drivers/${driverId}/slots/`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Book a ride
export async function bookRide({ slotId, reason }) {
  try {
    const response = await api.post("/rides/book/", {
      slot_id: slotId,
      reason,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(
      error.response?.data || {
        detail: "Ride booking failed",
      }
    );
  }
}

// Passenger rides
export async function getPassengerRides() {
  try {
    const response = await api.get("/passenger/rides/");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Driver rides
export async function getDriverRides() {
  try {
    const response = await api.get("/driver/rides/");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Get a single ride
export async function getRide(rideId) {
  try {
    const response = await api.get(`/ride/${rideId}/`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Update ride status
export async function updateRideStatus(rideId, status) {
  try {
    const response = await api.patch(`/ride/${rideId}/`, {
      status,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}