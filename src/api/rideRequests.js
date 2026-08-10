import api from "./axios";

// Create a new ride request (passenger)
export async function createRideRequest(data) {
  try {
    const response = await api.post("/ride-requests/create/", data);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Get my ride requests (passenger sees their own, driver sees accepted ones)
export async function getMyRideRequests() {
  try {
    const response = await api.get("/ride-requests/mine/");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Get all pending ride requests (driver only)
export async function getPendingRideRequests() {
  try {
    const response = await api.get("/ride-requests/pending/");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Accept a ride request (driver only)
export async function acceptRideRequest(rideId) {
  try {
    const response = await api.patch(`/ride-requests/${rideId}/accept/`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Update ride request status (completed/cancelled)
export async function updateRideRequestStatus(rideId, status) {
  try {
    const response = await api.patch(`/ride-requests/${rideId}/status/`, { status });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}