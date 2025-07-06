
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
  
  // Generate simple HTML iframe code
  const generateSimpleHtmlCode = () => {
    return `<iframe 
  src="${embedUrl}" 
  width="${containerWidth}" 
  height="${containerHeight}" 
  frameborder="0" 
  scrolling="auto"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 100%;"
  title="Face-Down Recovery Equipment Order Form">
</iframe>`;
  };

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

  // Generate JavaScript embed code (iframe-based)
  const generateJsEmbedCode = () => {
    return `<!-- Place this div where you want the form to appear -->
<div id="recovery-order-form"></div>

<!-- Include the embed script -->
<script src="${baseUrl}/embed-script.js"></script>

<!-- Optional: Customize the form -->
<script>
  embedRecoveryOrderForm({
    containerId: 'recovery-order-form',
    width: '${containerWidth}',
    height: '${containerHeight}'
  });
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
              Embed Order Form
            </h2>
            <p className="text-gray-600 mt-1">Get the code to embed your order form on any website</p>
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
            <CardTitle className="text-blue-700">Embed Codes</CardTitle>
            <CardDescription>Choose your preferred embedding method</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="simple-html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="simple-html">Simple HTML</TabsTrigger>
                <TabsTrigger value="div-embed">Div Embed</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript Iframe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simple-html" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Simple HTML Iframe</h4>
                    <Button
                      onClick={() => copyToClipboard(generateSimpleHtmlCode(), 'Simple HTML')}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                  <Textarea
                    value={generateSimpleHtmlCode()}
                    readOnly
                    className="font-mono text-sm min-h-[120px] bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">
                    <strong>✅ Recommended</strong> - Pure HTML iframe that works everywhere. Just copy and paste this code into your website.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="div-embed" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Div Embed Code (No Iframe)</h4>
                    <Button
                      onClick={() => copyToClipboard(generateDivEmbedCode(), 'Div Embed')}
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
                    className="font-mono text-sm min-h-[160px] bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">
                    Advanced option - Content loads directly into a div without iframe restrictions, but requires JavaScript.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="javascript" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">JavaScript Iframe Code</h4>
                    <Button
                      onClick={() => copyToClipboard(generateJsEmbedCode(), 'JavaScript')}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                  <Textarea
                    value={generateJsEmbedCode()}
                    readOnly
                    className="font-mono text-sm min-h-[200px] bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">
                    Advanced iframe embedding with customization options and responsive features.
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
          <CardTitle className="text-green-700">How to Embed</CardTitle>
          <CardDescription>Step-by-step instructions for embedding your form</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Simple HTML Method (Recommended)
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Copy the Simple HTML code above</li>
                <li>Paste it directly into your website's HTML</li>
                <li>No additional setup required</li>
                <li>Works on all platforms and websites</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Div Embed Method
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Copy the div embed code above</li>
                <li>Paste it into your website's HTML</li>
                <li>The form loads directly without iframe restrictions</li>
                <li>Works on platforms that block iframes</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                JavaScript Iframe Method
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Add the container div to your HTML</li>
                <li>Include the embed script</li>
                <li>Optionally customize with JavaScript</li>
                <li>Provides responsive behavior and loading indicators</li>
              </ol>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Recommendation:</strong> Use the <strong>Simple HTML</strong> method for easiest setup. 
              It's a standard iframe that works everywhere and requires no additional configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedSection;
