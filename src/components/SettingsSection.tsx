
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const SettingsSection = () => {
  const [squareSettings, setSquareSettings] = useState({
    applicationId: '',
    accessToken: '',
    locationId: '',
    environment: 'sandbox'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    loadSquareSettings();
  }, []);

  const loadSquareSettings = async () => {
    setIsLoading(true);
    try {
      const testResponse = await supabase.functions.invoke('square-payments', {
        body: { action: 'test_connection' }
      });

      console.log('Square config response:', testResponse);

      if (testResponse.data?.success) {
        setSquareSettings(prev => ({
          ...prev,
          applicationId: testResponse.data.applicationId || 'Not configured',
          accessToken: testResponse.data.success ? '***configured***' : 'Not configured',
          locationId: testResponse.data.locationId || 'Not configured',
          environment: testResponse.data.environment || 'sandbox'
        }));
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        const storedLocationId = localStorage.getItem('square_location_id') || '';
        setSquareSettings(prev => ({
          ...prev,
          locationId: storedLocationId || 'Not configured'
        }));
      }
    } catch (error) {
      console.error('Error loading Square settings:', error);
      setConnectionStatus('error');
      const storedLocationId = localStorage.getItem('square_location_id') || '';
      setSquareSettings(prev => ({
        ...prev,
        locationId: storedLocationId || 'Not configured'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testSquareConnection = async () => {
    setIsSaving(true);
    try {
      const testResponse = await supabase.functions.invoke('square-payments', {
        body: { action: 'test_connection' }
      });

      if (testResponse.error) {
        throw new Error('Failed to connect to Square API. Please check your Supabase secrets.');
      }

      if (testResponse.data?.success) {
        setConnectionStatus('success');
        toast({
          title: "Connection Test Successful",
          description: `Square ${testResponse.data.environment} credentials are working correctly. Found ${testResponse.data.locations || 0} locations.`,
        });
      } else {
        setConnectionStatus('error');
        throw new Error('Connection test failed');
      }
    } catch (error) {
      console.error('Error testing Square settings:', error);
      setConnectionStatus('error');
      toast({
        title: "Connection Test Failed",
        description: "Failed to test Square connection. Please check your sandbox credentials in Supabase secrets.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <div className="flex items-center space-x-2">
          {connectionStatus === 'success' && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Connected
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              Connection Error
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Square Payment Settings ({squareSettings.environment})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectionStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Square Connection Successful</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your Square {squareSettings.environment} credentials are properly configured and working.
                  </p>
                </div>
              </div>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Square Connection Failed</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Please check your Square credentials in Supabase secrets.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Application ID</Label>
              <Input
                type="text"
                value={squareSettings.applicationId}
                readOnly
                className="bg-gray-50"
                placeholder="sandbox-sq0idp-... or sq0idp-..."
              />
            </div>
            <div>
              <Label>Access Token</Label>
              <Input
                type="text"
                value={squareSettings.accessToken}
                readOnly
                className="bg-gray-50"
                placeholder="***configured***"
              />
            </div>
            <div>
              <Label>Location ID</Label>
              <Input
                type="text"
                value={squareSettings.locationId}
                readOnly
                className="bg-gray-50"
                placeholder="Location ID"
              />
            </div>
            <div>
              <Label>Environment</Label>
              <Input
                type="text"
                value={squareSettings.environment}
                readOnly
                className="bg-gray-50"
                placeholder="sandbox or production"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={testSquareConnection} 
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>

          {squareSettings.environment === 'sandbox' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Sandbox Test Cards:</strong> You can use test cards like 4111 1111 1111 1111 (Visa) or 5555 5555 5555 4444 (Mastercard) with any future expiry date and any CVV.
              </p>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Quick Setup Reference:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to <a href="https://supabase.com/dashboard/project/qeqljbfnfubqfnsvicce/settings/functions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Functions Settings</a></li>
              <li>Update these secrets with your {squareSettings.environment} values</li>
              <li>Use "Test Connection" button to verify</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
