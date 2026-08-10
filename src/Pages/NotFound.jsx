import React from 'react'
import { Link } from 'react-router-dom'
import img from "../assets/not_found.png"
 
function NotFound() {
  return (
    <main className="notfound-page">
      <div className="container py-5">
        <div className="notfound-card mx-auto">
          <div className="row gx-5 align-items-center">
 
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="notfound-image-placeholder rounded-4 d-flex align-items-center justify-content-center p-4">
                <img src={img} alt="Not Found Illustration" className="img-fluid" />
              </div>
            </div>
 
            <div className="col-lg-6">
              <div className="text-center text-lg-start">
                <p className="text-uppercase fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>Oops!</p>
                <h1 className="display-1 fw-bold notfound-title mb-3">404</h1>
                <h2 className="h3 mb-3">Sorry, this page can't be found.</h2>
                <p className="notfound-text mb-4">
                  The link may be broken, the page may have moved, or it may no longer exist.
                  Return to the homepage or reach out to support if you need help.
                </p>
                <div className="d-flex justify-content-center justify-content-lg-start gap-3 notfound-btn-group">
                  <Link to="/" className="notfound-btn btn">Back to Home</Link>
                  <Link to="/contact" className="notfound-btn btn">Contact Support</Link>
                </div>
              </div>
            </div>
 
          </div>
        </div>
      </div>
    </main>
  )
}
 
export default NotFound