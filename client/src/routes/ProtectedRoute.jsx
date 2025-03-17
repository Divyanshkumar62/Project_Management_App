import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const { auth } = useContext(AuthContext);

  return auth.token ? element : <Navigate to="/login" replace />
}

export default ProtectedRoute