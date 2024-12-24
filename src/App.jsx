import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/home/index'; // Update this import
import QuestionnaireForm from './components/questionnaireForm';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
    <Analytics />
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route 
          path="/questionnaire" 
          element={
            <ProtectedRoute>
              <QuestionnaireForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
