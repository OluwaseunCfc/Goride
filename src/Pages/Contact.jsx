import React from 'react'
import { IoLocationOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import img from "../assets/taxi.png"
 
function Contact() {
  return (
    <div className="contact-page-wrapper">
      <div className="contact-inner">
        <div className="row g-4 align-items-start">
 
          {/* Left: image + contact info card */}
          <div className="col-12 col-md-5 contact-left">
            <div className="contact-img">
              <img src={img} className='img-fluid' alt="Contact" />
            </div>
 
            <div className="contact-info-card">
              <div className="contact-info-item">
                <div className="contact-icon-wrap">
                  <IoLocationOutline size={20} />
                </div>
                <p>No 25, Broad Street, Marina, Lagos-Island, Lagos State.</p>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon-wrap">
                  <CiPhone size={20} />
                </div>
                <p>+234 805 042 6392</p>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon-wrap">
                  <CiMail size={20} />
                </div>
                <p>goride@gmail.com</p>
              </div>
            </div>
          </div>
 
          {/* Right: form card */}
          <div className="col-12 col-md-7">
            <div className="contact-form-card">
              <div className="contact-title mb-4">
                <h2>Get in touch</h2>
                <p>We are here for you! How can we help?</p>
              </div>
 
              <form onSubmit={(e) => e.preventDefault()}>
                <div className='mb-4'>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Enter your full name" />
                </div>
                <div className='mb-4'>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter your email" />
                </div>
                <div className='mb-4'>
                  <label className="form-label">Message</label>
                  <textarea
                    className='form-control'
                    rows={5}
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>
                <button className="contact-btn" type='submit'>Send Message</button>
              </form>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  )
}
 
export default Contact