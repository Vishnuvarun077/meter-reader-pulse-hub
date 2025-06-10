
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import OTPVerification from '@/components/OTPVerification';
import SupervisorDashboard from '@/components/SupervisorDashboard';

type AuthState = 'login' | 'otp-verification' | 'dashboard';

interface AuthData {
  supervisorId: string;
  mobile: string;
  tempToken?: string;
  accessToken?: string;
}

const Index = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [authData, setAuthData] = useState<AuthData>({
    supervisorId: '',
    mobile: '',
  });

  const handleLoginSuccess = (data: { supervisorId: string; mobile: string; token: string }) => {
    setAuthData({
      supervisorId: data.supervisorId,
      mobile: data.mobile,
      tempToken: data.token,
    });
    setAuthState('otp-verification');
  };

  const handleOTPVerificationSuccess = (accessToken: string) => {
    setAuthData(prev => ({
      ...prev,
      accessToken,
    }));
    setAuthState('dashboard');
  };

  const handleBackToLogin = () => {
    setAuthState('login');
    setAuthData({
      supervisorId: '',
      mobile: '',
    });
  };

  const handleLogout = () => {
    setAuthState('login');
    setAuthData({
      supervisorId: '',
      mobile: '',
    });
  };

  switch (authState) {
    case 'login':
      return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    
    case 'otp-verification':
      return (
        <OTPVerification
          supervisorId={authData.supervisorId}
          mobile={authData.mobile}
          tempToken={authData.tempToken!}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onGoBack={handleBackToLogin}
        />
      );
    
    case 'dashboard':
      return (
        <SupervisorDashboard
          supervisorId={authData.supervisorId}
          accessToken={authData.accessToken!}
          onLogout={handleLogout}
        />
      );
    
    default:
      return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }
};

export default Index;
