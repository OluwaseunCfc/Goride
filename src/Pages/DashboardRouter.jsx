import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import PassengerDashboard from './PassengerDashboard'
import DriverDashboard from './DriverDashboard'

function DashboardRouter() {
  const { isDriver } = useContext(AuthContext);
  return isDriver ? <DriverDashboard /> : <PassengerDashboard />;
}

export default DashboardRouter;