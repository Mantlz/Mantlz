"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface ApiKeyResponse {
  id: string;
  key: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date;
}

export default function ApiKeysPage() {
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<ApiKeyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentKey();
  }, []);

  const loadCurrentKey = async () => {
    try {
      const response = await client.apiKey.getCurrentKey.$get();
      const key = await response.json() as ApiKeyResponse | null;
      setCurrentKey(key);
    } catch (error) {
      console.error('Failed to load API key:', error);
      toast.error('Failed to load API key');
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!keyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    try {
      setIsLoading(true);
      const response = await client.apiKey.create.$post({
        name: keyName.trim(),
      });
      const newKey = await response.json() as ApiKeyResponse;
      setNewKey(newKey.key);
      setKeyName('');
      await loadCurrentKey();
      toast.success('API key created successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create API key');
      }
      console.error('Failed to create API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeCurrentKey = async () => {
    try {
      setIsLoading(true);
      await client.apiKey.revoke.$post();
      setCurrentKey(null);
      toast.success('API key revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke API key');
      console.error('Failed to revoke API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Key Management</h1>
      
      {currentKey ? (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Current API Key</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {currentKey.name}</p>
            <p><strong>Created:</strong> {new Date(currentKey.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Used:</strong> {new Date(currentKey.lastUsedAt).toLocaleDateString()}</p>
            <div className="mt-4">
              <Button 
                variant="destructive" 
                onClick={revokeCurrentKey}
                disabled={isLoading}
              >
                {isLoading ? 'Revoking...' : 'Revoke Key'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Create API Key</h2>
            <div className="flex gap-4">
              <Input
                placeholder="Key name (e.g., Production API Key)"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={createApiKey}
                disabled={isLoading || !keyName.trim()}
              >
                {isLoading ? 'Creating...' : 'Create Key'}
              </Button>
            </div>
          </Card>

          {newKey && (
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800 mb-2 font-medium">
                Copy your API key now. You won't be able to see it again!
              </p>
              <code className="block p-3 bg-white border rounded font-mono text-sm break-all">
                {newKey}
              </code>
              <p className="text-xs text-yellow-700 mt-2">
                Make sure to store this key securely. It provides access to your forms and submissions.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 