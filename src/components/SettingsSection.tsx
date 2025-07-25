
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';

const SettingsSection = () => {
  const [squareSettings, setSquareSettings] = useState({
    applicationId: '',
    accessToken: '',
    locationId: '',
    environment: 'sandbox'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

      if (testResponse.data?.success) {
        setSquareSettings(prev => ({
          ...prev,
          applicationId: testResponse.data.applicationId || 'Not configured',
          accessToken: '***configured***',
          locationId: testResponse.data.locationId || 'Not configured',
          environment: testResponse.data.environment || 'sandbox'
        }));
      } else {
        const storedLocationId = localStorage.getItem('square_location_id') || '';
        setSquareSettings(prev => ({
          ...prev,
          locationId: storedLocationId || 'Not configured'
        }));
      }
    } catch (error) {
      console.error('Error loading Square settings:', error);
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

      toast({
        title: "Connection Test Successful",
        description: `Square sandbox credentials are working correctly. Found ${testResponse.data.locations || 0} locations.`,
      });
    } catch (error) {
      console.error('Error testing Square settings:', error);
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Square Payment Settings (Sandbox Mode)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Sandbox Setup Required</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You need to configure these Supabase secrets with your Square sandbox credentials:
                </p>
                <div className="mt-3">
                  <p className="text-sm font-medium text-blue-800">Steps to get sandbox credentials:</p>
                  <ol className="text-sm text-blue-700 mt-2 ml-4 list-decimal">
                    <li>Go to <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Square Developer Dashboard</a></li>
                    <li>Select your application</li>
                    <li>Click on "Sandbox" tab</li>
                    <li>Copy your <strong>Sandbox Application ID</strong> (starts with "sandbox-")</li>
                    <li>Copy your <strong>Sandbox Access Token</strong></li>
                    <li>Get your <strong>Sandbox Location ID</strong> from the locations list</li>
                  </ol>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Update these Supabase secrets:</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• <code className="bg-blue-200 px-1 rounded">SQUARE_APPLICATION_ID</code> → Your sandbox app ID (starts with "sandbox-")</li>
                    <li>• <code className="bg-blue-200 px-1 rounded">SQUARE_ACCESS_TOKEN</code> → Your sandbox access token</li>
                    <li>• <code className="bg-blue-200 px-1 rounded">SQUARE_ENVIRONMENT</code> → Set to "sandbox"</li>
                    <li>• <code className="bg-blue-200 px-1 rounded">SQUARE_LOCATION_ID</code> → Your sandbox location ID</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Current Issue</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your current configuration appears to be using production credentials with sandbox environment settings. 
                  Please update to use proper sandbox credentials for testing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Application ID</Label>
              <Input
                type="text"
                value={squareSettings.applicationId}
                readOnly
                className="bg-gray-50"
                placeholder="sandbox-sq0idp-..."
              />
            </div>
            <div>
              <Label>Access Token</Label>
              <Input
                type="text"
                value={squareSettings.accessToken}
                readOnly
                className="bg-gray-50"
                placeholder="Not configured"
              />
            </div>
            <div>
              <Label>Location ID</Label>
              <Input
                type="text"
                value={squareSettings.locationId}
                readOnly
                className="bg-gray-50"
                placeholder="Not configured"
              />
            </div>
            <div>
              <Label>Environment</Label>
              <Input
                type="text"
                value={squareSettings.environment}
                readOnly
                className="bg-gray-50"
                placeholder="sandbox"
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
                  Test Sandbox Connection
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Quick Setup Guide:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to <a href="https://supabase.com/dashboard/project/qeqljbfnfubqfnsvicce/settings/functions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Functions Settings</a></li>
              <li>Update these secrets with your sandbox values:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><code>SQUARE_APPLICATION_ID</code> → sandbox-sq0idp-...</li>
                  <li><code>SQUARE_ACCESS_TOKEN</code> → your sandbox access token</li>
                  <li><code>SQUARE_ENVIRONMENT</code> → "sandbox"</li>
                  <li><code>SQUARE_LOCATION_ID</code> → your sandbox location ID</li>
                </ul>
              </li>
              <li>Use "Test Sandbox Connection" button to verify</li>
            </ol>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Sandbox Test Cards:</strong> Once configured, you can use test cards like 4111 1111 1111 1111 (Visa) or 5555 5555 5555 4444 (Mastercard) with any future expiry date and any CVV.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
