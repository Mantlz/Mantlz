import React from 'react';

export function CreateFormButton({ 
  templateId, 
  onSuccess 
}: { 
  templateId: 'feedback' | 'waitlist';
  onSuccess?: (formId: string) => void;
}) {
  const handleClick = async () => {
    try {
      const form = await window.mantlz.createFromTemplate({
        templateId,
        // Optionally provide custom name/description
      });
      onSuccess?.(form.id);
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      Create {templateId === 'feedback' ? 'Feedback' : 'Waitlist'} Form
    </button>
  );
} 