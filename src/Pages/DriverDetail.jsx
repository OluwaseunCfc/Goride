import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDriverSlots, bookRide } from '../api/rides';

function DriverDetail() {
  const { id } = useParams();

  const [slots, setSlots] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        setLoading(true);
        const data = await fetchDriverSlots(id);
        setSlots(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load available slots");
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [id]);

  const handleBooking = async (slotId) => {
    try {
      setBookingLoadingId(slotId);

      await bookRide({ slotId, reason });

      alert("Ride booked successfully");

      setSlots(prev => prev.filter(slot => slot.id !== slotId));
      setReason("");
    } catch (err) {
      alert(err.response?.data?.detail || err.detail || "Booking failed");
    } finally {
      setBookingLoadingId(null);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Driver Availability</h2>

      <input
        type="text"
        className="form-control w-75 mx-auto my-3"
        placeholder="Reason for ride (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      {loading && <p className="text-center mb-4">Loading slots...</p>}
      {!loading && error && <p className="text-center text-danger mb-4">{error}</p>}
      {!loading && !error && slots.length === 0 && (
        <p className="text-center mb-4">No available slots yet.</p>
      )}

      <div className="row">
        {slots.map((slot) => {
          const startDate = new Date(slot.start);
          const endDate = new Date(slot.end);

          const dateLabel = startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          const startTime = startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });

          const endTime = endDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });

          return (
            <div key={slot.id} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <p><strong>Date:</strong> {dateLabel}</p>
                    <p><strong>Time:</strong> {startTime} - {endTime}</p>
                  </div>
                  <button
                    className="btn btn-dark mt-2"
                    disabled={bookingLoadingId === slot.id}
                    onClick={() => handleBooking(slot.id)}
                  >
                    {bookingLoadingId === slot.id ? "Booking..." : "Book Ride"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DriverDetail;