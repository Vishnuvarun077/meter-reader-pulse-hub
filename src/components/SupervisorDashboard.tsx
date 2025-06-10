
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Users, MapPin, Phone, Mail, Calendar } from 'lucide-react';

interface MeterReader {
  id: string;
  name: string;
  mobile: string;
  email: string;
  area: string;
  status: 'active' | 'inactive' | 'on-field';
  lastReading: string;
  totalReadings: number;
}

interface SupervisorDashboardProps {
  supervisorId: string;
  accessToken: string;
  onLogout: () => void;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  supervisorId,
  accessToken,
  onLogout
}) => {
  const [meterReaders, setMeterReaders] = useState<MeterReader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supervisorInfo, setSupervisorInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeterReaders();
    fetchSupervisorInfo();
  }, []);

  const fetchSupervisorInfo = async () => {
    try {
      // Simulate webhook call to get supervisor details
      const response = await fetch(`/api/supervisor/${supervisorId}/details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSupervisorInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch supervisor info:', error);
    }
  };

  const fetchMeterReaders = async () => {
    setIsLoading(true);
    try {
      // Simulate webhook call to get meter readers under this supervisor
      const response = await fetch(`/api/supervisor/${supervisorId}/meter-readers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMeterReaders(data.meterReaders || []);
      } else {
        throw new Error('Failed to fetch meter readers');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load meter readers. Please try again.",
        variant: "destructive",
      });
      // Mock data for demonstration
      setMeterReaders([
        {
          id: 'MR001',
          name: 'John Smith',
          mobile: '+1234567890',
          email: 'john@example.com',
          area: 'Zone A - Residential',
          status: 'active',
          lastReading: '2024-01-10',
          totalReadings: 245
        },
        {
          id: 'MR002',
          name: 'Sarah Johnson',
          mobile: '+1234567891',
          email: 'sarah@example.com',
          area: 'Zone B - Commercial',
          status: 'on-field',
          lastReading: '2024-01-09',
          totalReadings: 189
        },
        {
          id: 'MR003',
          name: 'Mike Davis',
          mobile: '+1234567892',
          email: 'mike@example.com',
          area: 'Zone C - Industrial',
          status: 'inactive',
          lastReading: '2024-01-08',
          totalReadings: 312
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, color: 'bg-green-500' },
      inactive: { variant: 'secondary' as const, color: 'bg-gray-500' },
      'on-field': { variant: 'default' as const, color: 'bg-blue-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Supervisor Dashboard
              </h1>
              <Badge variant="outline" className="ml-3">
                ID: {supervisorId}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Meter Readers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {meterReaders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Readers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {meterReaders.filter(mr => mr.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                On Field
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {meterReaders.filter(mr => mr.status === 'on-field').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meter Readers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Meter Readers Under Your Supervision
            </CardTitle>
            <CardDescription>
              Manage and monitor your assigned meter readers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading meter readers...</p>
              </div>
            ) : meterReaders.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No meter readers assigned to you.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meterReaders.map((reader) => (
                  <Card key={reader.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{reader.name}</CardTitle>
                        {getStatusBadge(reader.status)}
                      </div>
                      <CardDescription>ID: {reader.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{reader.mobile}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{reader.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{reader.area}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Last Reading: {reader.lastReading}</span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="text-sm text-gray-600">
                          Total Readings: <span className="font-semibold">{reader.totalReadings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
