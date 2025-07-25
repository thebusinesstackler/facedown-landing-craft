
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SquarePaymentFormProps {
  applicationId: string;
  locationId?: string;
  environment: 'sandbox' | 'production';
  onPaymentSuccess: (token: string, verificationToken?: string) => void;
  onPaymentError: (error: string) => void;
  amount: number;
  disabled?: boolean;
  buttonText?: string;
}

declare global {
  interface Window {
    Square: any;
  }
}

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  applicationId,
  locationId,
  environment,
  onPaymentSuccess,
  onPaymentError,
  amount,
  disabled = false,
  buttonText = "Pay Now"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [effectiveLocationId, setEffectiveLocationId] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get location ID from props or localStorage
    const storedLocationId = localStorage.getItem('square_location_id');
    const finalLocationId = locationId || storedLocationId || '';
    setEffectiveLocationId(finalLocationId);

    if (!finalLocationId) {
      onPaymentError('Square location ID not configured');
      return;
    }

    const initializeSquare = async () => {
      try {
        // Load Square SDK
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = environment === 'production' 
            ? 'https://web.squarecdn.com/v1/square.js'
            : 'https://sandbox.web.squarecdn.com/v1/square.js';
          script.async = true;
          script.onload = () => initPayments();
          document.head.appendChild(script);
        } else {
          initPayments();
        }
      } catch (error) {
        console.error('Failed to load Square SDK:', error);
        onPaymentError('Failed to load payment system');
      }
    };

    const initPayments = async () => {
      try {
        const paymentsInstance = window.Square.payments(applicationId, finalLocationId);
        setPayments(paymentsInstance);
        
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach(cardRef.current);
        setCard(cardInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Square payments:', error);
        onPaymentError('Failed to initialize payment form');
      }
    };

    initializeSquare();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, [applicationId, locationId, environment]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    try {
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        console.log('Payment token generated:', tokenResult.token);
        onPaymentSuccess(tokenResult.token, tokenResult.verificationToken);
      } else {
        console.error('Tokenization failed:', tokenResult.errors);
        onPaymentError(tokenResult.errors?.[0]?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!effectiveLocationId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-sm text-red-600">Square location ID not configured</p>
              <p className="text-xs text-gray-500 mt-1">Please configure your Square location ID in settings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-green mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading payment form...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div 
            ref={cardRef} 
            className="min-h-[100px] p-4 border border-gray-200 rounded-lg"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Total: ${amount.toFixed(2)}
            </span>
            <Button
              onClick={handlePayment}
              disabled={disabled || isProcessing}
              className="bg-medical-green hover:bg-medical-green/90"
            >
              {isProcessing ? 'Processing...' : buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentForm;
