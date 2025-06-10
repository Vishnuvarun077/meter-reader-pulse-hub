
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

interface OTPVerificationProps {
  supervisorId: string;
  mobile: string;
  tempToken: string;
  onVerificationSuccess: (token: string) => void;
  onGoBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  supervisorId,
  mobile,
  tempToken,
  onVerificationSuccess,
  onGoBack
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate webhook call for OTP verification
      const response = await fetch('/api/supervisor/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`,
        },
        body: JSON.stringify({
          supervisorId,
          mobile,
          otp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Verification Successful",
          description: "Welcome to the supervisor dashboard!",
        });
        onVerificationSuccess(data.accessToken);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // Simulate resend OTP webhook call
      await fetch('/api/supervisor/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supervisorId,
          mobile,
        }),
      });

      setTimeLeft(300);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your mobile number.",
      });
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-gray-900">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {mobile.replace(/(\d{6})\d{4}/, '$1****')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block">
              Enter OTP
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            {timeLeft > 0 ? (
              <p>OTP expires in {formatTime(timeLeft)}</p>
            ) : (
              <p className="text-red-600">OTP has expired</p>
            )}
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleResendOTP}
            className="w-full"
            disabled={isLoading || timeLeft > 0}
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
