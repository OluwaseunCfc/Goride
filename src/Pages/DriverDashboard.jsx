import React, { useContext, useEffect, useState } from 'react'
import { getPendingRideRequests, getMyRideRequests, acceptRideRequest, updateRideRequestStatus } from '../api/rideRequests'
import { LAGOS_AREAS } from '../utils/lagosAreas'
import { AuthContext } from '../Context/AuthContext'
import Sidebar from '../Components/Sidebar'
import { LuClipboardList, LuCircleCheck, LuClock, LuMapPin } from 'react-icons/lu'

function DriverDashboard() {
  // Read from context rather than re-parsing localStorage, so the UI
  // updates on login/logout and can't crash on malformed JSON.
  const { user } = useContext(AuthContext);

  const [pendingRides, setPendingRides] = useState([]);

  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const loadData = async () => {
    try {
      const pending = await getPendingRideRequests();
      setPendingRides(pending);

      const mine = await getMyRideRequests();
      setMyRides(mine);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAreaLabel = (value) => {
    const area = LAGOS_AREAS.find(a => a.value === value);
    return area ? area.label : value;
  };

  const handleAccept = async (rideId) => {
    setAcceptingId(rideId);
    try {
      await acceptRideRequest(rideId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to accept ride");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleStatusChange = async (rideId, status) => {
    try {
      await updateRideRequestStatus(rideId, status);
      setMyRides(prev =>
        prev.map(r => r.id === rideId ? { ...r, status } : r)
      );
    } catch (err) {
      alert("Failed to update ride status");
    }
  };

  const totalAccepted = myRides.length;
  const completedRides = myRides.filter(r => r.status === 'completed').length;
  const activeRides = myRides.filter(r => r.status === 'accepted').length;
  const totalPending = pendingRides.length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">

        {/* Welcome Banner */}
        <div className="dashboard-banner">
          <div className="dashboard-banner-text">
            <h2>Welcome back, <span>{user?.first_name || user?.email?.split('@')[0]}!</span></h2>
            <p>Accept ride requests from passengers and manage your active trips.</p>
          </div>
          <div className="dashboard-banner-img">
            {/* image placeholder - add illustration here later */}
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-red">
              <LuClipboardList size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{totalPending}</span>
              <span className="dash-stat-label">Available Requests</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-blue">
              <LuClock size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{activeRides}</span>
              <span className="dash-stat-label">Active Rides</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-green">
              <LuCircleCheck size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{completedRides}</span>
              <span className="dash-stat-label">Completed</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon icon-orange">
              <LuMapPin size={20} />
            </div>
            <div>
              <span className="dash-stat-number">{totalAccepted}</span>
              <span className="dash-stat-label">Total Rides</span>
            </div>
          </div>
        </div>

        {/* Available Ride Requests */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3>Available Ride Requests</h3>
          </div>

          {loading && <p>Loading...</p>}

          {!loading && pendingRides.length === 0 && (
            <p className="text-muted">No ride requests available right now.</p>
          )}

          {pendingRides.map((ride) => (
            <div key={ride.id} className="ride-row">
              <div className="ride-row-info">
                <p className="ride-route">
                  {getAreaLabel(ride.pickup)} <span className="arrow">→</span> {getAreaLabel(ride.dropoff)}
                </p>
                <p className="ride-meta">
                  {ride.date} • {ride.time} • {ride.distance_km} km • ₦{ride.price}
                </p>
                <p className="ride-meta">
                  Passenger: {ride.passenger?.first_name} {ride.passenger?.last_name}
                </p>
                {ride.reason && <p className="ride-meta">Reason: {ride.reason}</p>}
              </div>

              <button
                className="btn btn-sm btn-success"
                onClick={() => handleAccept(ride.id)}
                disabled={acceptingId === ride.id}
              >
                {acceptingId === ride.id ? "Accepting..." : "Accept Ride"}
              </button>
            </div>
          ))}
        </div>

        {/* My Accepted Rides */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3>My Rides</h3>
          </div>

          {!loading && myRides.length === 0 && (
            <p className="text-muted">You haven't accepted any rides yet.</p>
          )}

          {myRides.map((ride) => (
            <div key={ride.id} className="ride-row">
              <div className="ride-row-info">
                <p className="ride-route">
                  {getAreaLabel(ride.pickup)} <span className="arrow">→</span> {getAreaLabel(ride.dropoff)}
                </p>
                <p className="ride-meta">
                  {ride.date} • {ride.time} • ₦{ride.price}
                </p>
                <p className="ride-meta">
                  Passenger: {ride.passenger?.first_name} {ride.passenger?.last_name}
                </p>
              </div>

              <div className="ride-row-status">
                <span className={`badge ${
                  ride.status === 'completed' ? 'bg-success' :
                  ride.status === 'cancelled' ? 'bg-danger' :
                  'bg-primary'
                }`}>
                  {ride.status}
                </span>

                {ride.status === 'accepted' && (
                  <div className="d-flex gap-1 mt-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusChange(ride.id, 'completed')}
                    >
                      Complete
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleStatusChange(ride.id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default DriverDashboard;