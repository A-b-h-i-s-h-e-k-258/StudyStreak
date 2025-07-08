
import { useState, forwardRef } from 'react';
import { QrCode, Share2, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useHabits } from '@/hooks/useHabits';

export const QRSection = forwardRef<HTMLDivElement>((_, ref) => {
  const [selectedType, setSelectedType] = useState<'habit' | 'custom'>('habit');
  const [selectedId, setSelectedId] = useState('');
  const [customText, setCustomText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { toast } = useToast();
  const { habits } = useHabits();

  const generateQRCode = () => {
    let textToEncode = '';
    
    switch (selectedType) {
      case 'habit':
        const selectedHabit = habits.find(h => h.id === selectedId);
        if (selectedHabit) {
          textToEncode = `Habit: ${selectedHabit.name}\nGoal: ${selectedHabit.goal} times per month`;
        }
        break;
      case 'custom':
        textToEncode = customText;
        break;
    }

    if (!textToEncode) {
      toast({
        title: "Error",
        description: "Please select an item or enter custom text",
        variant: "destructive",
      });
      return;
    }

    // Using QR Server API for generating QR codes
    const encodedText = encodeURIComponent(textToEncode);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;
    setQrCodeUrl(qrUrl);
  };

  const copyToClipboard = async () => {
    if (qrCodeUrl) {
      try {
        await navigator.clipboard.writeText(qrCodeUrl);
        toast({
          title: "Success",
          description: "QR code URL copied to clipboard!",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${selectedType}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card ref={ref} className="backdrop-blur-xl bg-white/5 dark:bg-white/80 border border-white/10 dark:border-gray-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <QrCode className="h-6 w-6 text-emerald-400 dark:text-emerald-600" />
          <CardTitle className="text-white dark:text-black">QR Code Generator</CardTitle>
        </div>
        <CardDescription className="text-gray-400 dark:text-gray-600">
          Generate QR codes for easy sharing of habits or custom content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300 dark:text-gray-700">Content Type</Label>
            <Select value={selectedType} onValueChange={(value: 'habit' | 'custom') => setSelectedType(value)}>
              <SelectTrigger className="bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300 text-white dark:text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300">
                <SelectItem value="habit" className="text-white dark:text-black">Habit</SelectItem>
                <SelectItem value="custom" className="text-white dark:text-black">Custom Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedType === 'habit' && (
            <div className="space-y-2">
              <Label className="text-gray-300 dark:text-gray-700">Select Habit</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300 text-white dark:text-black">
                  <SelectValue placeholder="Choose a habit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300">
                  {habits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id} className="text-white dark:text-black">
                      {habit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedType === 'custom' && (
            <div className="space-y-2">
              <Label className="text-gray-300 dark:text-gray-700">Custom Text</Label>
              <Input
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text to encode in QR code"
                className="bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300 text-white dark:text-black"
              />
            </div>
          )}

          <Button
            onClick={generateQRCode}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </div>

        {qrCodeUrl && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="Generated QR Code" 
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1 bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300 text-gray-300 dark:text-gray-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button
                onClick={downloadQR}
                variant="outline"
                className="flex-1 bg-gray-800 dark:bg-white border-gray-600 dark:border-gray-300 text-gray-300 dark:text-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

QRSection.displayName = 'QRSection';
