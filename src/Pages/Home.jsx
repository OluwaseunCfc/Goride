import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../Components/Banner";
import ScrollToTop from "../Components/ScrollToTop";
import { BsCashCoin } from "react-icons/bs";
import { GiCheckedShield } from "react-icons/gi";
import { IoIosGift } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import { FaUserPlus, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { FaMoneyBillWave, FaShieldAlt, FaClock, FaBolt, FaStar, FaQuoteRight } from "react-icons/fa";
 
import img from "../assets/driver.png";
 
function Home() {
  const location = useLocation();
 
  useEffect(() => {
    if (location.hash === "#about") {
      const section = document.getElementById("about");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
    if (location.hash === "#testimonials") {
      const section = document.getElementById("testimonials");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);
 
  const steps = [
    {
      icon: <FaUserPlus size={28} />,
      title: "Create an account",
      description: "Sign up in seconds with your phone number or social media profiles.",
    },
    {
      icon: <FaCar size={28} />,
      title: "Request a ride",
      description: "Enter your destination and choose the ride type that fits your needs.",
    },
    {
      icon: <FaMapMarkerAlt size={28} />,
      title: "Get picked up",
      description: "Track your driver in real-time and enjoy a comfortable journey to your destination.",
    },
  ];
 
  const features = [
    {
      icon: <FaMoneyBillWave size={22} />,
      title: "Affordable rides",
      description: "High-end service at prices that won't break the bank.",
    },
    {
      icon: <FaShieldAlt size={22} />,
      title: "Trusted drivers",
      description: "Fully vetted professionals focused on your comfort and safety.",
    },
    {
      icon: <FaClock size={22} />,
      title: "24/7 services",
      description: "Round the clock availability, no matter the time or weather.",
    },
    {
      icon: <FaBolt size={22} />,
      title: "Fast Pickup",
      description: "Optimized routing algorithms to get you moving within minutes.",
    },
  ];
 
  const testimonials = [
    {
      rating: 5,
      quote: '"The best taxi experience I\'ve had. The app is incredibly intuitive, and the driver was professional and on time. Highly recommended for business travel."',
      initials: "JH",
      name: "James Hunt",
      role: "Corporate Client",
    },
    {
      rating: 5,
      quote: '"Safety was my main concern, but GoRide\'s tracking features and driver vetting put me at ease. Exceptional service every single time."',
      initials: "SB",
      name: "Sandra Blake",
      role: "Daily Commuter",
    },
  ];
 
  return (
    <div>
      <Banner />
 
      {/* Benefits */}
      
      <section className="benefits">
        <p className="section-label">Why we stand out</p>
        <h2>Benefits of the App</h2>
        <p className="section-sub">Everything you need for a smooth, stress-free ride.</p>
 
        <div className="container pb-5">
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 mx-auto">
                <div className="card-body">
                  <div className="icon-box"><BsCashCoin size={24} /></div>
                  <h4 className="card-title">Fare Estimates</h4>
                  <p className="card-text">Know your cost upfront, no surprises.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 mx-auto">
                <div className="card-body">
                  <div className="icon-box"><GiCheckedShield size={24} /></div>
                  <h4 className="card-title">Secure Payment</h4>
                  <p className="card-text">Multi safe digital payment options.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 mx-auto">
                <div className="card-body">
                  <div className="icon-box"><IoIosGift size={24} /></div>
                  <h4 className="card-title">Exclusive Offers</h4>
                  <p className="card-text">Special discount for frequent riders.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 mx-auto">
                <div className="card-body">
                  <div className="icon-box"><MdLocationPin size={24} /></div>
                  <h4 className="card-title">SOS Support</h4>
                  <p className="card-text">24/7 emergency assistance button.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* About Section */}

      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-image">
            <img src={img} alt="Taxi" className="img-fluid" />
          </div>
          <div className="about-copy">
            <h4>About us</h4>
            <h2>Redefining the way you navigate the city.</h2>
            <p>
              GoRide is more than just a taxi service. We are an urban vanguard
              dedicated to providing premium, reliable, and safe transportation.
              Our mission is to make every journey as seamless as the destination
              itself, leveraging cutting-edge technology and a fleet of professional drivers.
            </p>
            <button className="about-btn">Download the App</button>
          </div>
        </div>
      </section>
 
      {/* How It Works */}

      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to start your journey</p>
          </div>
          <div className="row justify-content-center g-3">
            {steps.map((step, index) => (
              <div className="col-12 col-md-4" key={index}>
                <div className="step-card">
                  <div className="step-number">Step {index + 1}</div>
                  <div className="step-icon-wrapper">{step.icon}</div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Why Choose Us */}

      <section className="why-section">
        <div className="container">
          <p className="why-label">Why Choose Us</p>
          <h2 className="why-heading">
            Premium features for your<br />daily commute.
          </h2>
 
          <div className="row g-3">
            {features.map((feature, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">{feature.icon}</div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
 
          {/* Testimomial Section */}

          <div className="testimonials-block" id="testimonials">
            <div className="text-center mb-4">
              <h3 className="testimonials-title">What our riders say</h3>
              <p className="testimonials-subtitle">Join thousands of happy commuters across the city.</p>
            </div>
 
            <div className="row g-4">
              {testimonials.map((t, index) => (
                <div className="col-12 col-md-6" key={index}>
                  <div className="testimonial-card">
                    <FaQuoteRight className="quote-icon" />
                    <div className="stars">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <FaStar key={i} size={15} />
                      ))}
                    </div>
                    <p className="testimonial-text">{t.quote}</p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-circle">{t.initials}</div>
                      <div>
                        <p className="reviewer-name">{t.name}</p>
                        <p className="reviewer-role">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating "back to top" button — appears once the user scrolls down */}
      <ScrollToTop />
    </div>
  );
}

 
export default Home;