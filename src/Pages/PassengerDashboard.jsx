import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyRideRequests, updateRideRequestStatus } from "../api/rideRequests";
import { LAGOS_AREAS } from "../utils/lagosAreas";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Components/Sidebar";
import { LuCar, LuCircleCheck, LuClock } from "react-icons/lu";

function PassengerDashboard() {
  // Read from context rather than re-parsing localStorage, so the UI
  // updates on login/logout and can't crash on malformed JSON.
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyRideRequests();
        setRides(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (rideId) => {
    try {
      await updateRideRequestStatus(rideId, "cancelled");
      setRides((prev) =>
        prev.map((r) => (r.id === rideId ? { ...r, status: "cancelled" } : r)),
      );
    } catch (err) {
      alert("Failed to cancel ride");
    }
  };

  const getAreaLabel = (value) => {
    const area = LAGOS_AREAS.find((a) => a.value === value);
    return area ? area.label : value;
  };

  const totalRides = rides.length;
  const completed = rides.filter((r) => r.status === "completed").length;
  const upcoming = rides.filter(
    (r) => r.status === "pending" || r.status === "accepted"
  ).length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* Welcome Banner */}
        <div className="dashboard-banner">
          <div className="dashboard-banner-text">
            <h2>
              Welcome back, <span>{user?.email?.split("@")[0]}!</span>
            </h2>
            <p>
              Ready to go? Book a ride and enjoy a safe, comfortable journey
              with GoRide.
            </p>
            <Link to="/book-ride" className="banner-btn">
              Book Your First Ride
            </Link>
          </div>
          <div className="dashboard-banner-img">
            {/* image placeholder - add illustration here later */}
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-orange">
              <LuCar size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{totalRides}</span>
              <span className="dash-stat-label">Total Rides</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-green">
              <LuCircleCheck size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{completed}</span>
              <span className="dash-stat-label">Completed</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-blue">
              <LuClock size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{upcoming}</span>
              <span className="dash-stat-label">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Rides List */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3>Your Rides</h3>
          </div>

          {loading && <p>Loading rides...</p>}

          {!loading && rides.length === 0 && (
            <p className="text-muted">
              No rides yet. Book your first ride now!
            </p>
          )}

          {rides.map((ride) => (
            <div key={ride.id} className="ride-row">
              <div className="ride-row-info">
                <p className="ride-route">
                  {getAreaLabel(ride.pickup)} <span className="arrow">→</span> {getAreaLabel(ride.dropoff)}
                </p>
                <p className="ride-meta">
                  {ride.date} • {ride.time} • ₦{ride.price}
                </p>
                {ride.driver ? (
                  <p className="ride-meta">
                    Driver: {ride.driver.first_name} {ride.driver.last_name}
                  </p>
                ) : (
                  <p className="ride-meta">Waiting for a driver to accept...</p>
                )}
                {ride.reason && (
                  <p className="ride-meta">Reason: {ride.reason}</p>
                )}
              </div>

              <div className="ride-row-status">
                <span
                  className={`badge ${
                    ride.status === "completed"
                      ? "bg-success"
                      : ride.status === "cancelled"
                        ? "bg-danger"
                        : ride.status === "accepted"
                          ? "bg-primary"
                          : "bg-secondary"
                  }`}
                >
                  {ride.status}
                </span>

                {(ride.status === "pending" || ride.status === "accepted") && (
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => handleCancel(ride.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;