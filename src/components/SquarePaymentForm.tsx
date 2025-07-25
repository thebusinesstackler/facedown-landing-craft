
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [squareConfig, setSquareConfig] = useState<any>(null);
  const [cardValidationState, setCardValidationState] = useState<any>({});
  const [isCardValid, setIsCardValid] = useState(false);
  const [initError, setInitError] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSquareConfig = async () => {
      try {
        console.log('Fetching Square configuration...');
        const response = await supabase.functions.invoke('square-payments', {
          body: { action: 'test_connection' }
        });

        console.log('Square config response:', response);

        if (response.data?.success) {
          const config = {
            applicationId: response.data.applicationId,
            locationId: response.data.locationId,
            environment: response.data.environment
          };
          
          console.log('Square config received:', config);
          
          // Validate applicationId format
          if (!config.applicationId || config.applicationId.length < 10) {
            throw new Error('Invalid Square Application ID format');
          }
          
          setSquareConfig(config);
          setEffectiveLocationId(config.locationId);
          await initializeSquare(config);
        } else {
          throw new Error('Square configuration not found');
        }
      } catch (error) {
        console.error('Error getting Square config:', error);
        setInitError('Failed to load Square configuration. Please check your Square settings.');
        setIsLoading(false);
      }
    };

    const initializeSquare = async (config: any) => {
      try {
        console.log('Initializing Square with config:', config);
        
        // Load Square SDK if not already loaded
        if (!window.Square) {
          await loadSquareSDK(config.environment);
        }
        
        await initPayments(config);
      } catch (error) {
        console.error('Failed to initialize Square:', error);
        setInitError('Failed to initialize payment system. Please try again.');
        setIsLoading(false);
      }
    };

    const loadSquareSDK = (env: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        console.log('Loading Square SDK for environment:', env);
        const script = document.createElement('script');
        script.src = env === 'production' 
          ? 'https://web.squarecdn.com/v1/square.js'
          : 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => {
          console.log('Square SDK loaded successfully');
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Square SDK');
          reject(new Error('Failed to load Square SDK'));
        };
        document.head.appendChild(script);
      });
    };

    const initPayments = async (config: any) => {
      try {
        console.log('Initializing payments with:', config);
        
        if (!config.applicationId || !config.locationId) {
          throw new Error('Square configuration incomplete');
        }

        const paymentsInstance = window.Square.payments(config.applicationId, config.locationId);
        setPayments(paymentsInstance);
        
        // Initialize card with proper styling and validation
        const cardInstance = await paymentsInstance.card({
          style: {
            '.input-container': {
              borderColor: '#d1d5db',
              borderRadius: '8px',
              borderWidth: '1px',
              padding: '12px',
            },
            '.input-container.is-focus': {
              borderColor: '#10b981',
              outline: 'none',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
            },
            '.input-container.is-error': {
              borderColor: '#ef4444',
            },
            '.message-text': {
              color: '#6b7280',
              fontSize: '14px',
              marginTop: '4px',
            },
            '.message-text.is-error': {
              color: '#ef4444',
            },
            input: {
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#374151',
            },
            'input::placeholder': {
              color: '#9ca3af',
            },
          },
          includeInputLabels: true,
        });

        // Add event listeners for card validation
        cardInstance.addEventListener('cardBrandChanged', (event: any) => {
          console.log('Card brand changed:', event.cardBrand);
          setCardValidationState(prev => ({ ...prev, cardBrand: event.cardBrand }));
        });

        cardInstance.addEventListener('postalCodeChanged', (event: any) => {
          console.log('Postal code changed:', event.postalCode);
          setCardValidationState(prev => ({ ...prev, postalCode: event.postalCode }));
        });

        await cardInstance.attach(cardRef.current);
        setCard(cardInstance);
        setIsLoading(false);
        console.log('Square payment form initialized successfully');

        // Validate card state periodically
        const validateCard = async () => {
          try {
            const validation = await cardInstance.validateCard();
            setIsCardValid(validation.isValid);
            setCardValidationState(prev => ({ ...prev, ...validation }));
          } catch (error) {
            console.log('Card validation check:', error);
            setIsCardValid(false);
          }
        };

        // Check validation every 2 seconds
        const validationInterval = setInterval(validateCard, 2000);

        return () => {
          clearInterval(validationInterval);
          if (cardInstance) {
            cardInstance.destroy();
          }
        };

      } catch (error) {
        console.error('Failed to initialize Square payments:', error);
        setInitError('Failed to initialize payment form. Please check your Square configuration.');
        setIsLoading(false);
      }
    };

    getSquareConfig();
  }, []);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Starting payment process...');
      
      // First, validate the card
      const validation = await card.validateCard();
      if (!validation.isValid) {
        const errors = validation.errors || [];
        const errorMessages = errors.map((error: any) => error.message).join(', ');
        onPaymentError(`Card validation failed: ${errorMessages || 'Please check your card details'}`);
        return;
      }

      console.log('Card validation passed, tokenizing...');
      
      // Tokenize the card
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        console.log('Payment token generated:', tokenResult.token);
        
        // Check if we need 3D Secure verification
        let verificationToken = tokenResult.verificationToken;
        
        if (tokenResult.details?.card?.prepaid === false && amount > 100) {
          console.log('Attempting 3D Secure verification...');
          
          try {
            const verificationDetails = {
              amount: {
                amount: Math.round(amount * 100),
                currency: 'USD'
              },
              billingContact: {
                givenName: 'Test',
                familyName: 'Customer',
                email: 'test@example.com'
              },
              intent: 'CHARGE'
            };

            const verificationResult = await payments.verifyBuyer(
              tokenResult.token,
              verificationDetails
            );

            if (verificationResult.status === 'OK') {
              console.log('3D Secure verification successful');
              verificationToken = verificationResult.token;
            } else {
              console.log('3D Secure verification failed or not required');
            }
          } catch (verificationError) {
            console.log('3D Secure verification error (continuing):', verificationError);
          }
        }

        onPaymentSuccess(tokenResult.token, verificationToken);
      } else {
        console.error('Tokenization failed:', tokenResult.errors);
        const errorMessage = tokenResult.errors?.[0]?.message || 'Payment failed';
        onPaymentError(errorMessage);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (initError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{initError}</p>
            <p className="text-sm text-gray-500">
              Please contact support if this issue persists.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!effectiveLocationId && !isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-red-600">Square location ID not configured</p>
            <p className="text-xs text-gray-500 mt-1">Please configure your Square location ID in settings</p>
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Card Information</label>
            <div 
              ref={cardRef} 
              className="min-h-[120px] p-4 border border-gray-200 rounded-lg bg-white"
            />
            
            {/* Card validation feedback */}
            {cardValidationState.cardBrand && (
              <div className="text-xs text-gray-600">
                Card type: {cardValidationState.cardBrand}
              </div>
            )}
            
            {/* Real-time validation messages */}
            {!isCardValid && cardValidationState.errors && (
              <div className="text-xs text-red-600">
                Please complete all card fields
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-2">
              Test Card Numbers (Sandbox):
            </div>
            <div className="text-xs text-gray-800">
              • 4111 1111 1111 1111 (Visa)
              • 5555 5555 5555 4444 (Mastercard)
              • Use any future expiry date and any CVV
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Total: ${amount.toFixed(2)}
            </span>
            <Button
              onClick={handlePayment}
              disabled={disabled || isProcessing || !isCardValid}
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
