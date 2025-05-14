import { FormField } from '../types';

// Default fields by form type
export const defaultFieldsByType: Record<string, FormField[]> = {
  waitlist: [
    { id: 'name', name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
  ],
  contact: [
    { id: 'name', name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
    { id: 'message', name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message...' },
  ],
  feedback: [
     { id: 'rating', name: 'rating', label: 'Rating', type: 'number', required: true, placeholder: '5' },
    { id: 'feedback', name: 'feedback', label: 'Feedback', type: 'textarea', required: true, placeholder: 'Your feedback...' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: false, placeholder: 'your@email.com' },
  ],
};

// Form-type specific available fields
export const availableFieldsByType: Record<string, FormField[]> = {
  waitlist: [
    { id: 'referral', name: 'referralSource', label: 'How did you hear about us?', type: 'text', required: false, placeholder: 'Friend, social media, etc.' },
    { id: 'company', name: 'company', label: 'Company', type: 'text', required: false, placeholder: 'Your company' },
    { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: false, placeholder: 'Your job title' },
    { id: 'updates', name: 'updates', label: 'Receive updates', type: 'checkbox', required: false },
  ],
  contact: [
    { id: 'company', name: 'company', label: 'Company', type: 'text', required: false, placeholder: 'Your company' },
    { id: 'phone', name: 'phone', label: 'Phone', type: 'text', required: false, placeholder: 'Your phone number' },
    { id: 'subject', name: 'subject', label: 'Subject', type: 'text', required: false, placeholder: 'Subject' },
    { id: 'subscribe', name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox', required: false },
    { 
      id: 'attachment', 
      name: 'attachment', 
      label: 'Attachment', 
      type: 'file', 
      required: false, 
      accept: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'], 
      maxSize: 10 * 1024 * 1024, // 10MB max
      premium: true // Mark as premium feature
    },
  ],
  feedback: [
    { id: 'improvement', name: 'improvement', label: 'Suggested improvement', type: 'textarea', required: false, placeholder: 'Your suggestions...' },
    { id: 'wouldRecommend', name: 'wouldRecommend', label: 'Would recommend', type: 'checkbox', required: false },
    { id: 'contactMe', name: 'contactMe', label: 'Contact me about my feedback', type: 'checkbox', required: false },
    { 
      id: 'screenshot', 
      name: 'screenshot', 
      label: 'Screenshot (optional)', 
      type: 'file', 
      required: false, 
      accept: ['.jpg', '.jpeg', '.png'], 
      maxSize: 5 * 1024 * 1024, // 5MB max
      premium: true // Mark as premium feature
    },
  ],
};

// Form title and description by type
export const formMetaByType: Record<string, { title: string, description: string }> = {
  waitlist: {
    title: 'Join our Waitlist',
    description: 'Sign up to be notified when we launch'
  },
  contact: {
    title: 'Contact Us',
    description: 'We\'d love to hear from you. Please fill out this form.'
  },
  feedback: {
    title: 'Give us Feedback',
    description: 'Your feedback helps us improve our product'
  },
}; 