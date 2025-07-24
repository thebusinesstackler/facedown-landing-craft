
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';

const SettingsSection = () => {
  const [squareSettings, setSquareSettings] = useState({
    applicationId: '',
    accessToken: '',
    environment: 'sandbox'
  });
  const [showTokens, setShowTokens] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSquareSettings();
  }, []);

  const loadSquareSettings = async () => {
    setIsLoading(true);
    try {
      // For now, we'll store these in localStorage since they're admin settings
      // In production, these should be stored securely in Supabase secrets
      const savedSettings = localStorage.getItem('square_settings');
      if (savedSettings) {
        setSquareSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading Square settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSquareSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('square_settings', JSON.stringify(squareSettings));
      
      // Test the connection by making a simple API call
      const testResponse = await supabase.functions.invoke('square-payments', {
        body: {
          action: 'test_connection',
          applicationId: squareSettings.applicationId,
          accessToken: squareSettings.accessToken,
          environment: squareSettings.environment
        }
      });

      if (testResponse.error) {
        throw new Error('Failed to connect to Square API');
      }

      toast({
        title: "Settings Saved",
        description: "Square credentials have been saved and tested successfully.",
      });
    } catch (error) {
      console.error('Error saving Square settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Square settings. Please check your credentials.",
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
            Square Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="environment">Environment</Label>
            <Select 
              value={squareSettings.environment} 
              onValueChange={(value) => setSquareSettings(prev => ({ ...prev, environment: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                <SelectItem value="production">Production (Live)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="applicationId">Application ID</Label>
            <div className="relative">
              <Input
                id="applicationId"
                type={showTokens ? "text" : "password"}
                value={squareSettings.applicationId}
                onChange={(e) => setSquareSettings(prev => ({ ...prev, applicationId: e.target.value }))}
                placeholder="sandbox-sq0idb-..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accessToken">Access Token</Label>
            <div className="relative">
              <Input
                id="accessToken"
                type={showTokens ? "text" : "password"}
                value={squareSettings.accessToken}
                onChange={(e) => setSquareSettings(prev => ({ ...prev, accessToken: e.target.value }))}
                placeholder="EAAa..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTokens(!showTokens)}
            >
              {showTokens ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Credentials
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Credentials
                </>
              )}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={saveSquareSettings} 
              disabled={isSaving || !squareSettings.applicationId || !squareSettings.accessToken}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving & Testing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save & Test Connection
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>How to get your Square credentials:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Square Developer Dashboard</a></li>
              <li>Create or select your application</li>
              <li>Copy the Application ID from the app overview</li>
              <li>Generate or copy an Access Token from the Credentials section</li>
              <li>Use Sandbox credentials for testing, Production for live payments</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
