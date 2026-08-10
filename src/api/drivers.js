import api from "./axios";

// Get all drivers
export async function getDrivers() {
  try {
    const response = await api.get("/drivers/");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Get public slots for a driver
export async function getDriverSlots(driverId) {
  try {
    const response = await api.get(`/drivers/${driverId}/slots/`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Driver's own slots
export async function getMySlots() {
  try {
    const response = await api.get("/driver/slots/");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Create availability slot
export async function createSlot(slotData) {
  try {
    const response = await api.post("/driver/slots/", slotData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Delete slot
export async function deleteSlot(slotId) {
  try {
    const response = await api.delete(`/driver/slots/${slotId}/`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}