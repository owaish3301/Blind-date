import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/home/index';
import QuestionnaireForm from './components/questionnaireForm';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Chat from "./components/chat/index";
import { Analytics } from "@vercel/analytics/react"
import { SupabaseProvider } from "./context/SupabaseContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <>
      <Analytics />
      <SupabaseProvider>
        <NotificationProvider>
          <ChatProvider>
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
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/signin" />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </NotificationProvider>
      </SupabaseProvider>
    </>
  );
}

export default App;
