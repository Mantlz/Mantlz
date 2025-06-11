import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { client } from '@/lib/client';
import { useRouter } from 'next/navigation';

interface DeleteFormProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function DeleteForm({ formId, isOpen, onClose, onOpen }: DeleteFormProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (deleteConfirmation !== 'delete') {
      return;
    }

    try {
      setIsDeleting(true);
      
      const response = await client.forms.delete.$post({
        formId: formId
      });

      toast.success('Form and all associated data deleted successfully');
      onClose();
      
      router.push('/dashboard');
      router.refresh();
      
    } catch (error) {
      toast.error('Failed to delete form', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setDeleteConfirmation('');
    setIsDeleting(false);
    onClose();
  };

  return (
    <>
      {/* Danger Zone Section */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Irreversible and destructive actions</p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-red-800 dark:text-red-400 mb-2">Delete Form</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-6 leading-relaxed max-w-md">
                Once you delete a form, there is no going back. This will permanently delete:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 mb-6 leading-relaxed max-w-md list-disc list-inside space-y-1">
                <li>The form and all its settings</li>
                <li>All form submissions and data</li>
                <li>Email campaigns and recipients</li>
                <li>Stripe orders and payment data</li>
                <li>Email logs and analytics</li>
                <li>All associated notifications</li>
              </ul>
              <button 
                onClick={onOpen}
                className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-zinc-900 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Delete Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Delete Form & All Data
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                This action cannot be undone. This will permanently delete your form and ALL associated data including submissions, campaigns, orders, and analytics.
              </DialogDescription>
            </div>

            {/* Warning Box */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                <strong>This will permanently delete:</strong>
              </p>
              <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 mb-3 list-disc list-inside">
                <li>Form configuration and settings</li>
                <li>All submissions and customer data</li>
                <li>Email campaigns and recipient lists</li>
                <li>Stripe orders and payment records</li>
                <li>Email logs and delivery analytics</li>
                <li>Notification history</li>
              </ul>
              <p className="text-sm text-red-700 dark:text-red-300">
                Please type <span className="font-mono font-semibold text-red-800 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">delete</span> to confirm.
              </p>
            </div>

            {/* Input */}
            <div className="mb-8">
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="font-mono text-base py-3 px-4 border-gray-300 dark:border-gray-600 focus:border-red-400 dark:focus:border-red-400 focus:ring-red-400/20"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 py-2.5 font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteConfirmation !== 'delete' || isDeleting}
                className="flex-1 py-2.5 font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting Everything...</span>
                  </div>
                ) : (
                  'Delete Everything'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}