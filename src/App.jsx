import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Loading from './Components/Loading'
import Footer from './Components/Footer'
import SplashScreen from './Components/SplashScreen'
import { AuthProvider } from './Context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoutes'


const Home = React.lazy(() => import('./Pages/Home'))
const Contact = React.lazy(() => import('./Pages/Contact'))
const Login = React.lazy(() => import('./Pages/Login'))
const Signup = React.lazy(() => import('./Pages/Signup'))
const NotFound = React.lazy(() => import('./Pages/NotFound'))
const PassengerDashboard = React.lazy(() => import('./Pages/PassengerDashboard'))
const DriverDashboard = React.lazy(() => import('./Pages/DriverDashboard'))
const DashboardRouter = React.lazy(() => import('./Pages/DashboardRouter'))
const Drivers = React.lazy(() => import('./Pages/Drivers'))
const DriverDetail = React.lazy(() => import('./Pages/DriverDetail'))
const Passengers = React.lazy(() => import('./Pages/Passengers'))
const BookRide = React.lazy(() => import('./Pages/BookRide'))

function App() {
  return (
    <AuthProvider>
      {/* Overlays the app on first load; the router keeps working underneath. */}
      <SplashScreen />

      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">

          <Navbar />

          <main className="flex-grow-1">
            <React.Suspense
              fallback={
                <div style={{ width: '100%', height: '100vh' }}>
                  <Loading />
                </div>
              }
            >
              <Routes>
                {/* Public routes */}
                <Route path='/' element={<Home />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />

                {/* Protected routes */}
                <Route path='/dashboard' element={
                  <ProtectedRoute><DashboardRouter /></ProtectedRoute>
                } />
                <Route path='/drivers' element={
                  <ProtectedRoute><Drivers /></ProtectedRoute>
                } />
                <Route path='/drivers/:id' element={
                  <ProtectedRoute><DriverDetail /></ProtectedRoute>
                } />
                <Route path='/my-bookings' element={
                  <ProtectedRoute><Passengers /></ProtectedRoute>
                } />
                <Route path='/book-ride' element={
                  <ProtectedRoute><BookRide /></ProtectedRoute>
                } />

                <Route path='*' element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App