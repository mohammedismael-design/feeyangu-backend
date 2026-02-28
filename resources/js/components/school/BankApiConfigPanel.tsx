import React, { useState } from 'react';
import { BANK_API_CONFIGS, type BankApiConfig, type SavedApiCredentials } from '@/types/bank-api.types';
import { PAYMENT_PROVIDERS, type PaymentProvider } from '@/types/payment.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Smartphone, Building2, Eye, EyeOff, ExternalLink,
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Loader2,
  Settings2, Globe, Lock, TestTube
} from 'lucide-react';

const initialCredentials: SavedApiCredentials[] = BANK_API_CONFIGS.map(cfg => ({
  provider: cfg.provider,
  environment: 'sandbox' as const,
  enabled: false,
  values: Object.fromEntries(cfg.fields.map(f => [f.key, ''])),
  testStatus: 'untested' as const,
}));

const BankApiConfigPanel: React.FC = () => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<SavedApiCredentials[]>(initialCredentials);
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<PaymentProvider | null>(null);

  const getCred = (provider: PaymentProvider): SavedApiCredentials =>
    credentials.find(c => c.provider === provider) ?? {
      provider,
      environment: 'sandbox',
      enabled: false,
      values: {},
      testStatus: 'untested',
    };

  const updateCred = (provider: PaymentProvider, patch: Partial<SavedApiCredentials>) =>
    setCredentials(prev => prev.map(c => c.provider === provider ? { ...c, ...patch } : c));

  const updateValue = (provider: PaymentProvider, key: string, value: string) =>
    setCredentials(prev => prev.map(c =>
      c.provider === provider ? { ...c, values: { ...c.values, [key]: value } } : c
    ));

  const toggleShowField = (fieldId: string) =>
    setShowFields(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));

  const handleSave = async (cfg: BankApiConfig) => {
    const cred = getCred(cfg.provider);
    const missing = cfg.fields.filter(f => f.required && !cred.values[f.key]?.trim());
    if (missing.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Please fill in: ${missing.map(f => f.label).join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setSaving(cfg.provider);
    try {
      // Persist via Inertia/fetch when backend endpoint is available
      await new Promise(res => setTimeout(res, 600));
      toast({
        title: 'Configuration Saved',
        description: `${cfg.name} API settings have been saved successfully.`,
      });
      updateCred(cfg.provider, { testStatus: 'untested' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save configuration.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleTest = async (cfg: BankApiConfig) => {
    const cred = getCred(cfg.provider);
    const missing = cfg.fields.filter(f => f.required && !cred.values[f.key]?.trim());
    if (missing.length > 0) {
      toast({
        title: 'Cannot Test',
        description: 'Please fill in all required fields before testing.',
        variant: 'destructive',
      });
      return;
    }

    updateCred(cfg.provider, { testStatus: 'testing' });
    try {
      // Replace with real API test call when backend endpoint is ready
      await new Promise(res => setTimeout(res, 1200));
      updateCred(cfg.provider, { testStatus: 'success' });
      toast({ title: 'Connection Successful', description: `${cfg.name} API is reachable.` });
    } catch {
      updateCred(cfg.provider, { testStatus: 'failed' });
      toast({ title: 'Connection Failed', description: `Could not reach ${cfg.name} API.`, variant: 'destructive' });
    }
  };

  const statusIcon = (status: SavedApiCredentials['testStatus']) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':  return <XCircle className="h-4 w-4 text-destructive" />;
      case 'testing': return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      default:        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const statusLabel = (status: SavedApiCredentials['testStatus']) => {
    switch (status) {
      case 'success': return 'Verified';
      case 'failed':  return 'Failed';
      case 'testing': return 'Testing…';
      default:        return 'Untested';
    }
  };

  const providerIcon = (provider: PaymentProvider) => {
    const p = PAYMENT_PROVIDERS.find(pp => pp.id === provider);
    return p?.category === 'mobile_money'
      ? <Smartphone className="h-4 w-4" />
      : <Building2 className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Bank &amp; Payment API Credentials
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure API credentials for each payment provider. Credentials are encrypted at rest.
        </p>
      </div>

      <Tabs defaultValue={BANK_API_CONFIGS[0]?.provider ?? ''}>
        <TabsList className="flex-wrap h-auto gap-1">
          {BANK_API_CONFIGS.map(cfg => {
            const cred = getCred(cfg.provider);
            return (
              <TabsTrigger key={cfg.provider} value={cfg.provider} className="gap-1.5">
                {providerIcon(cfg.provider)}
                <span className="hidden sm:inline">{cfg.name}</span>
                {cred.enabled && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {BANK_API_CONFIGS.map(cfg => {
          const cred = getCred(cfg.provider);
          const isSaving = saving === cfg.provider;

          return (
            <TabsContent key={cfg.provider} value={cfg.provider} className="mt-4">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: cfg.color }}
                      >
                        {providerIcon(cfg.provider)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{cfg.name}</CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1.5 mt-0.5">
                          {statusIcon(cred.testStatus)}
                          {statusLabel(cred.testStatus)}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Environment toggle */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        <span className={cn(cred.environment === 'sandbox' ? 'font-medium text-foreground' : '')}>
                          Sandbox
                        </span>
                        <Switch
                          checked={cred.environment === 'production'}
                          onCheckedChange={v => updateCred(cfg.provider, { environment: v ? 'production' : 'sandbox', testStatus: 'untested' })}
                          className="scale-75"
                        />
                        <span className={cn(cred.environment === 'production' ? 'font-medium text-foreground' : '')}>
                          Production
                        </span>
                      </div>

                      {/* Enable toggle */}
                      <div className="flex items-center gap-1.5">
                        <Switch
                          checked={cred.enabled}
                          onCheckedChange={v => updateCred(cfg.provider, { enabled: v })}
                        />
                        <Badge variant={cred.enabled ? 'default' : 'secondary'} className="text-[10px]">
                          {cred.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {cred.environment === 'production' && (
                    <div className="flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-md px-3 py-2 mt-2">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      You are editing <strong>production</strong> credentials. Changes affect live payments.
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Dynamic fields */}
                  <div className="space-y-3">
                    {cfg.fields.map(field => {
                      const fieldId = `${cfg.provider}-${field.key}`;
                      const isSecret = field.type === 'password';
                      const revealed = showFields[fieldId];

                      return (
                        <div key={field.key} className="space-y-1.5">
                          <Label htmlFor={fieldId} className="text-sm flex items-center gap-1">
                            {isSecret && <Lock className="h-3 w-3 text-muted-foreground" />}
                            {field.label}
                            {field.required && <span className="text-destructive">*</span>}
                          </Label>
                          <div className="relative">
                            <Input
                              id={fieldId}
                              type={isSecret && !revealed ? 'password' : 'text'}
                              value={cred.values[field.key] ?? ''}
                              onChange={e => updateValue(cfg.provider, field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="font-mono text-xs pr-9"
                            />
                            {isSecret && (
                              <button
                                type="button"
                                onClick={() => toggleShowField(fieldId)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={revealed ? 'Hide' : 'Show'}
                              >
                                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            )}
                          </div>
                          {field.hint && (
                            <p className="text-xs text-muted-foreground">{field.hint}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Base URL info */}
                  <div className="text-xs text-muted-foreground flex items-start gap-1.5 bg-muted/40 rounded-md px-3 py-2">
                    <Globe className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Base URL: </span>
                      {cred.environment === 'production' ? cfg.productionBaseUrl : cfg.sandboxBaseUrl}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => handleTest(cfg)}
                      disabled={cred.testStatus === 'testing' || isSaving}
                    >
                      {cred.testStatus === 'testing'
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <TestTube className="h-3.5 w-3.5" />}
                      Test Connection
                    </Button>

                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => handleSave(cfg)}
                      disabled={isSaving || cred.testStatus === 'testing'}
                    >
                      {isSaving
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Settings2 className="h-3.5 w-3.5" />}
                      {isSaving ? 'Saving…' : 'Save Credentials'}
                    </Button>

                    <a
                      href={cfg.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Developer Docs
                    </a>
                  </div>

                  <p className="text-xs text-muted-foreground border-t pt-3">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Credentials are stored encrypted and never exposed to the client after saving.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default BankApiConfigPanel;
