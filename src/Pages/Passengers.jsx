import React, { useEffect, useState } from 'react';
// NOTE: this page previously imported a `Hero` component and
// `getPassengerBookings`/`deletePassengerBooking` from ../api/rides — none of
// which exist, so `npm run build` failed. It now uses the ride-request API
// that actually backs the passenger booking flow.
import { getMyRideRequests, updateRideRequestStatus } from '../api/rideRequests';
import { LAGOS_AREAS } from '../utils/lagosAreas';

function Passengers() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getMyRideRequests();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const getAreaLabel = (value) => {
    const area = LAGOS_AREAS.find((a) => a.value === value);
    return area ? area.label : value;
  };

  const handleCancel = async (bookingId) => {
    try {
      await updateRideRequestStatus(bookingId, 'cancelled');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (error) {
      console.error(error);
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="dashboard-section-header mb-4">My Bookings</h2>

      {loading && <p className="text-center">Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-center text-muted">No bookings yet.</p>
      )}

      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.id} className="col-lg-4 col-md-6 col-12 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <p className="ride-route">
                  {getAreaLabel(booking.pickup)}
                  <span className="arrow">→</span>
                  {getAreaLabel(booking.dropoff)}
                </p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Price:</strong> ₦{booking.price}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`badge ${
                      booking.status === 'completed'
                        ? 'bg-success'
                        : booking.status === 'cancelled'
                          ? 'bg-danger'
                          : booking.status === 'accepted'
                            ? 'bg-primary'
                            : 'bg-secondary'
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>

                {(booking.status === 'pending' || booking.status === 'accepted') && (
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Passengers;
