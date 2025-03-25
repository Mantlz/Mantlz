import { Calendar, Copy, Share, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { useMantlz } from '@/hooks/use-mantlz';
import { toast } from 'sonner';
import { useState } from 'react';

interface FormHeaderProps {
  id: string
  name: string
  createdAt?: Date | string
  responsesCount?: number
  emailSettings?: {
    enabled: boolean;
    fromEmail?: string;
    subject?: string;
    template?: string;
    replyTo?: string;
  }
}

export function FormHeader({ id, name, createdAt, responsesCount = 0, emailSettings }: FormHeaderProps) {
  const [emailEnabled, setEmailEnabled] = useState(emailSettings?.enabled ?? false);
  const { client } = useMantlz();

  const copyId = () => {
    if (id) {
      navigator.clipboard.writeText(id)
    }
  }

  const handleEmailToggle = async (checked: boolean) => {
    // Immediately update UI state for responsiveness
    setEmailEnabled(checked);
    
    try {
      if (!client) {
        throw new Error('Client not initialized');
      }
      
      await client.updateFormEmailSettings(id, {
        enabled: checked,
        fromEmail: emailSettings?.fromEmail || process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app',
      });
      
      toast.success('Email notifications ' + (checked ? 'enabled' : 'disabled'));
    } catch (error) {
      // Revert state if update fails
      setEmailEnabled(!checked);
      console.error('Failed to update email settings:', error);
      toast.error('Failed to update email settings');
    }
  };

  // Convert string to Date if needed
  const createdAtDate = createdAt 
    ? (createdAt instanceof Date ? createdAt : new Date(createdAt))
    : new Date();

  return (
    <Card className="p-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium text-slate-900 dark:text-slate-50">{name}</h1>
          <div className="flex items-center mt-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-4 w-4 mr-1" />
            Created {format(createdAtDate, "MMM d, yyyy")}
            {responsesCount > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{responsesCount} {responsesCount === 1 ? 'response' : 'responses'}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-900 px-4 py-2 rounded-lg">
            <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Email Notifications</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">{emailEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={handleEmailToggle}
              className="ml-2"
            />
          </div>
          
          {id && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
              onClick={copyId}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 