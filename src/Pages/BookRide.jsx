import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRideRequest } from '../api/rideRequests'
import { LAGOS_AREAS, WHATSAPP_NUMBER } from '../utils/lagosAreas'
import { LuMapPin, LuCalendar, LuClock, LuShieldCheck, LuZap, LuBanknote } from 'react-icons/lu'
import { FaWhatsapp, FaCar } from 'react-icons/fa'

function BookRide() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedRide, setBookedRide] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.pickup === form.dropoff) {
      setError('Pickup and dropoff cannot be the same location.');
      return;
    }

    setLoading(true);

    try {
      const ride = await createRideRequest(form);
      setBookedRide(ride);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getAreaLabel = (value) => {
    const area = LAGOS_AREAS.find(a => a.value === value);
    return area ? area.label : value;
  };

  const buildWhatsAppMessage = () => {
    if (!bookedRide) return '';
    const message = `Hi GoRide, I just booked a ride.\n\nPickup: ${getAreaLabel(bookedRide.pickup)}\nDropoff: ${getAreaLabel(bookedRide.dropoff)}\nDate: ${bookedRide.date}\nTime: ${bookedRide.time}\nDistance: ${bookedRide.distance_km} km\nPrice: ₦${bookedRide.price}\n\nPlease confirm my ride.`;
    return encodeURIComponent(message);
  };

  return (
    <div className="book-ride-page">
      <div className="book-ride-split">

        {/* Left Panel */}
        <div className="book-ride-left-panel">
          <div className="book-ride-left-inner">
            <div className="login-brand-badge">
              <FaCar size={16} /> GoRide
            </div>

            {!bookedRide ? (
              <>
                <h2 className="login-left-heading">Book a ride in seconds.</h2>
                <p className="login-left-sub">
                  Tell us where you're going and we'll instantly calculate your fare.
                  A verified driver will accept your request shortly.
                </p>

                <div className="book-ride-features">
                  <div className="book-ride-feature">
                    <div className="book-ride-feature-icon"><LuZap size={18} /></div>
                    <div>
                      <h6>Instant Pricing</h6>
                      <p>Get your fare immediately, no surprises.</p>
                    </div>
                  </div>
                  <div className="book-ride-feature">
                    <div className="book-ride-feature-icon"><LuShieldCheck size={18} /></div>
                    <div>
                      <h6>Verified Drivers</h6>
                      <p>Every driver on GoRide is vetted and reliable.</p>
                    </div>
                  </div>
                  <div className="book-ride-feature">
                    <div className="book-ride-feature-icon"><LuBanknote size={18} /></div>
                    <div>
                      <h6>Transparent Rates</h6>
                      <p>₦1500 per km, calculated automatically by distance.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="login-left-heading">Request sent!</h2>
                <p className="login-left-sub">
                  Your ride request has been submitted. A driver will accept it shortly.
                  Confirm your booking on WhatsApp to speed things up.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="book-ride-right-panel">
          <div className="book-ride-right-inner">

            {!bookedRide ? (
              <>
                <h3 className="login-form-title">Trip Details</h3>
                <p className="login-form-sub">Fill in your pickup and dropoff to continue.</p>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-3">
                    <label className="form-label"><LuMapPin size={14} /> Pickup Location</label>
                    <select
                      name="pickup"
                      className="form-control custom-input"
                      value={form.pickup}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select pickup area</option>
                      {LAGOS_AREAS.map(area => (
                        <option key={area.value} value={area.value}>{area.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><LuMapPin size={14} /> Dropoff Location</label>
                    <select
                      name="dropoff"
                      className="form-control custom-input"
                      value={form.dropoff}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select dropoff area</option>
                      {LAGOS_AREAS.map(area => (
                        <option key={area.value} value={area.value}>{area.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label"><LuCalendar size={14} /> Date</label>
                      <input
                        type="date"
                        name="date"
                        className="form-control custom-input"
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label"><LuClock size={14} /> Time</label>
                      <input
                        type="time"
                        name="time"
                        className="form-control custom-input"
                        value={form.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Reason (optional)</label>
                    <input
                      type="text"
                      name="reason"
                      className="form-control custom-input"
                      placeholder="e.g. Going to the airport"
                      value={form.reason}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn-login w-100" disabled={loading}>
                    {loading ? 'Booking...' : 'Book Ride'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="login-form-title">Booking Confirmed</h3>
                <p className="login-form-sub">Here's a summary of your trip.</p>

                <div className="ride-summary mt-4">
                  <div className="ride-summary-row">
                    <span>Pickup</span>
                    <strong>{getAreaLabel(bookedRide.pickup)}</strong>
                  </div>
                  <div className="ride-summary-row">
                    <span>Dropoff</span>
                    <strong>{getAreaLabel(bookedRide.dropoff)}</strong>
                  </div>
                  <div className="ride-summary-row">
                    <span>Date & Time</span>
                    <strong>{bookedRide.date} at {bookedRide.time}</strong>
                  </div>
                  <div className="ride-summary-row">
                    <span>Distance</span>
                    <strong>{bookedRide.distance_km} km</strong>
                  </div>
                  <div className="ride-summary-row total">
                    <span>Total Price</span>
                    <strong>₦{bookedRide.price}</strong>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn w-100 mt-4"
                >
                  <FaWhatsapp size={18} /> Confirm via WhatsApp
                </a>

                <button
                  className="btn btn-outline-dark w-100 mt-3"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default BookRide;