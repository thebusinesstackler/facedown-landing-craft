
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Code, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmbedSection: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState('100%');
  const [containerHeight, setContainerHeight] = useState('800px');

  const baseUrl = 'https://order.facedownrecoveryequipment.com';
  const embedUrl = `${baseUrl}/order1`;
  
  // Generate div embed code (no iframe)
  const generateDivEmbedCode = () => {
    return `<!-- Place this div where you want the form to appear -->
<div id="facedown-order-form" style="width: ${containerWidth}; min-height: ${containerHeight}; max-width: 100%;"></div>

<!-- Include the embed script -->
<script src="${baseUrl}/embed-div-order.js"></script>

<!-- Optional: Customize the form -->
<script>
  // The form will automatically load into the div above
  // You can also manually initialize with custom options:
  // embedFacedownOrderForm({
  //   containerId: 'facedown-order-form',
  //   minHeight: '${containerHeight}'
  // });
</script>`;
  };

  // Generate fetch-based embed code
  const generateFetchEmbedCode = () => {
    return `<!-- Place this div where you want the form to appear -->
<div id="order-form-container" style="width: ${containerWidth}; min-height: ${containerHeight}; max-width: 100%;"></div>

<script>
async function loadOrderForm() {
  const container = document.getElementById('order-form-container');
  if (!container) return;
  
  // Show loading
  container.innerHTML = \`
    <div style="text-align: center; padding: 40px; color: #666;">
      <div style="margin-bottom: 16px;">Loading order form...</div>
      <div style="width: 40px; height: 40px; border: 3px solid #159764; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
    </div>
    <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
  \`;
  
  try {
    const response = await fetch('${embedUrl}');
    const html = await response.text();
    
    // Extract main content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mainContent = doc.querySelector('main') || doc.querySelector('[class*="container"]') || doc.body;
    
    if (mainContent) {
      container.innerHTML = mainContent.innerHTML;
      
      // Execute any scripts
      const scripts = container.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.head.appendChild(newScript);
      });
    }
  } catch (error) {
    container.innerHTML = \`
      <div style="text-align: center; padding: 40px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;">
        <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
        <div>Unable to load order form. Please try again later.</div>
      </div>
    \`;
  }
}

// Load when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadOrderForm);
} else {
  loadOrderForm();
}
</script>`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard`,
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    });
  };

  const openPreview = () => {
    window.open(embedUrl, '_blank');
  };

  const openExample = () => {
    window.open(`${baseUrl}/embed-example.html`, '_blank');
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Embed Order Form (No iframe)
            </h2>
            <p className="text-gray-600 mt-1">Get the code to embed your order form directly into any website</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={openPreview} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Form
            </Button>
            <Button 
              onClick={openExample} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Example
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg">
            <CardTitle className="text-purple-700">Form Settings</CardTitle>
            <CardDescription>Customize the embedded form dimensions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={containerWidth}
                onChange={(e) => setContainerWidth(e.target.value)}
                placeholder="e.g., 100%, 800px"
                className="border-2 border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={containerHeight}
                onChange={(e) => setContainerHeight(e.target.value)}
                placeholder="e.g., 800px, 100vh"
                className="border-2 border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-600">
                <strong>Form URL:</strong><br />
                <code className="bg-gray-100 p-1 rounded text-xs break-all">{embedUrl}</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Embed Codes */}
        <Card className="lg:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
            <CardTitle className="text-blue-700">Embed Codes (No iframe)</CardTitle>
            <CardDescription>Choose your preferred embedding method - all without iframes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="div-embed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="div-embed">Script Embed</TabsTrigger>
                <TabsTrigger value="fetch-embed">Fetch Embed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="div-embed" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Script-Based Embed (Recommended)</h4>
                    <Button
                      onClick={() => copyToClipboard(generateDivEmbedCode(), 'Script Embed')}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                  <Textarea
                    value={generateDivEmbedCode()}
                    readOnly
                    className="font-mono text-sm min-h-[200px] bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">
                    <strong>✅ Recommended</strong> - Uses our optimized script that handles loading, styling, and error handling automatically.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="fetch-embed" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Fetch-Based Embed</h4>
                    <Button
                      onClick={() => copyToClipboard(generateFetchEmbedCode(), 'Fetch Embed')}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                  <Textarea
                    value={generateFetchEmbedCode()}
                    readOnly
                    className="font-mono text-sm min-h-[300px] bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">
                    Manual implementation using fetch API - gives you full control over the loading process and error handling.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 rounded-t-lg">
          <CardTitle className="text-green-700">How to Embed (No iframe)</CardTitle>
          <CardDescription>Step-by-step instructions for embedding your form directly</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Script Embed Method (Recommended)
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Copy the script embed code above</li>
                <li>Paste it directly into your website's HTML</li>
                <li>The script handles all loading and styling automatically</li>
                <li>Works on all platforms including those that block iframes</li>
                <li>Includes loading indicators and error handling</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Fetch Embed Method
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Copy the fetch embed code above</li>
                <li>Paste it into your website's HTML</li>
                <li>Customize the loading and error handling as needed</li>
                <li>Full control over the embedding process</li>
                <li>No external dependencies required</li>
              </ol>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 No iframe restrictions:</strong> Both methods load the form content directly into your page without using iframes, 
              so they work on platforms like Shopify, WordPress, and other sites that may block iframe content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedSection;
