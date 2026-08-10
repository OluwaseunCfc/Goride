import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDrivers } from '../api/drivers'
import { LuCar, LuCalendar } from 'react-icons/lu'

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDrivers();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Available Drivers</h2>

      {loading && <p>Loading drivers...</p>}

      {!loading && drivers.length === 0 && (
        <p className="text-muted">No drivers available at the moment.</p>
      )}

      <div className="row">
        {drivers.map((driver) => (
          <div key={driver.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-3" style={{ borderRadius: '15px' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,167,38,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color)',
                  }}
                >
                  <LuCar size={22} />
                </div>
                <div>
                  <h6 className="mb-0">{driver.first_name} {driver.last_name}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{driver.email}</p>
                </div>
              </div>

              <Link to={`/drivers/${driver.id}`}>
                <button className="btn btn-sm bg-dark text-white w-100 d-flex align-items-center justify-content-center gap-2">
                  <LuCalendar size={15} />
                  View Availability
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Drivers;