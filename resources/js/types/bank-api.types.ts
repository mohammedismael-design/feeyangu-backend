import type { PaymentProvider } from '@/types/payment.types';

export interface BankApiField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url';
  placeholder: string;
  required: boolean;
  hint?: string;
}

export interface BankApiConfig {
  provider: PaymentProvider;
  name: string;
  color: string;
  docsUrl: string;
  sandboxBaseUrl: string;
  productionBaseUrl: string;
  fields: BankApiField[];
}

export interface SavedApiCredentials {
  provider: PaymentProvider;
  environment: 'sandbox' | 'production';
  enabled: boolean;
  values: Record<string, string>;
  testStatus: 'untested' | 'testing' | 'success' | 'failed';
}

export const BANK_API_CONFIGS: BankApiConfig[] = [
  {
    provider: 'mpesa',
    name: 'M-Pesa (Daraja)',
    color: 'hsl(142, 72%, 35%)',
    docsUrl: 'https://developer.safaricom.co.ke/',
    sandboxBaseUrl: 'https://sandbox.safaricom.co.ke',
    productionBaseUrl: 'https://api.safaricom.co.ke',
    fields: [
      {
        key: 'consumerKey',
        label: 'Consumer Key',
        type: 'text',
        placeholder: 'Enter your Daraja consumer key',
        required: true,
      },
      {
        key: 'consumerSecret',
        label: 'Consumer Secret',
        type: 'password',
        placeholder: 'Enter your Daraja consumer secret',
        required: true,
      },
      {
        key: 'shortCode',
        label: 'Business Short Code (Paybill / Till)',
        type: 'text',
        placeholder: 'e.g. 174379',
        required: true,
      },
      {
        key: 'passKey',
        label: 'Lipa na M-Pesa Online Passkey',
        type: 'password',
        placeholder: 'Enter your STK Push passkey',
        required: true,
        hint: 'Obtained from the Daraja portal under "My Apps".',
      },
      {
        key: 'callbackUrl',
        label: 'Callback URL',
        type: 'url',
        placeholder: 'https://yourapp.com/api/mpesa/callback',
        required: false,
        hint: 'Leave blank to use the platform default.',
      },
    ],
  },
  {
    provider: 'equity',
    name: 'Equity Bank (Jenga)',
    color: 'hsl(25, 90%, 45%)',
    docsUrl: 'https://developer.jengaapi.io/',
    sandboxBaseUrl: 'https://uat.jengahq.io',
    productionBaseUrl: 'https://api.jengahq.io',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'text',
        placeholder: 'Enter your Jenga API key',
        required: true,
      },
      {
        key: 'apiSecret',
        label: 'API Secret',
        type: 'password',
        placeholder: 'Enter your Jenga API secret',
        required: true,
      },
      {
        key: 'merchantCode',
        label: 'Merchant Code',
        type: 'text',
        placeholder: 'e.g. 0011',
        required: true,
      },
      {
        key: 'privateKey',
        label: 'Private Key (RSA)',
        type: 'password',
        placeholder: 'Paste your RSA private key (PEM format)',
        required: false,
        hint: 'Required for request signing. Obtain from the Jenga Developer Portal.',
      },
    ],
  },
  {
    provider: 'kcb',
    name: 'KCB Bank',
    color: 'hsl(210, 80%, 40%)',
    docsUrl: 'https://developer.kcbgroup.com/',
    sandboxBaseUrl: 'https://uat.developer.kcbgroup.com',
    productionBaseUrl: 'https://api.developer.kcbgroup.com',
    fields: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        placeholder: 'Enter your KCB client ID',
        required: true,
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'Enter your KCB client secret',
        required: true,
      },
      {
        key: 'merchantId',
        label: 'Merchant ID',
        type: 'text',
        placeholder: 'Enter your merchant ID',
        required: true,
      },
    ],
  },
  {
    provider: 'ncba',
    name: 'NCBA Bank',
    color: 'hsl(200, 70%, 35%)',
    docsUrl: 'https://developer.ncbagroup.com/',
    sandboxBaseUrl: 'https://sandbox.ncbagroup.com',
    productionBaseUrl: 'https://api.ncbagroup.com',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'text',
        placeholder: 'Enter your NCBA API key',
        required: true,
      },
      {
        key: 'apiSecret',
        label: 'API Secret',
        type: 'password',
        placeholder: 'Enter your NCBA API secret',
        required: true,
      },
      {
        key: 'accountNumber',
        label: 'Collection Account Number',
        type: 'text',
        placeholder: 'e.g. 1234567890',
        required: true,
      },
    ],
  },
  {
    provider: 'coop',
    name: 'Co-operative Bank',
    color: 'hsl(160, 60%, 35%)',
    docsUrl: 'https://developer.co-opbank.co.ke/',
    sandboxBaseUrl: 'https://developer.co-opbank.co.ke:8280',
    productionBaseUrl: 'https://api.co-opbank.co.ke:8243',
    fields: [
      {
        key: 'consumerKey',
        label: 'Consumer Key',
        type: 'text',
        placeholder: 'Enter your Co-op consumer key',
        required: true,
      },
      {
        key: 'consumerSecret',
        label: 'Consumer Secret',
        type: 'password',
        placeholder: 'Enter your Co-op consumer secret',
        required: true,
      },
      {
        key: 'accountNumber',
        label: 'Collection Account Number',
        type: 'text',
        placeholder: 'e.g. 36001873000',
        required: true,
      },
    ],
  },
];
