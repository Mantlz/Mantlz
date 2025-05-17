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
  custom: [
    { id: 'name', name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
  ],
  survey: [
    { id: 'name', name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
    { id: 'satisfaction', name: 'satisfaction', label: 'Satisfaction', type: 'number', required: true, placeholder: '1-10' },
    { id: 'feedback', name: 'feedback', label: 'Additional Comments', type: 'textarea', required: false, placeholder: 'Your comments...' },
  ],
  application: [
    { id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your full name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
    { id: 'experience', name: 'experience', label: 'Experience', type: 'textarea', required: true, placeholder: 'Tell us about your experience...' },
  ],
  order: [
    { id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your full name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
    { id: 'product', name: 'product', label: 'Product', type: 'text', required: true, placeholder: 'Product name' },
    { id: 'quantity', name: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '1' },
  ],
  'analytics-opt-in': [
    { id: 'name', name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
    { id: 'allowCookies', name: 'allowCookies', label: 'Allow Cookies', type: 'checkbox', required: true },
    { id: 'allowAnalytics', name: 'allowAnalytics', label: 'Allow Analytics', type: 'checkbox', required: true },
  ],
  rsvp: [
    { id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your full name' },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
    { id: 'attending', name: 'attending', label: 'Will you attend?', type: 'checkbox', required: true },
    { id: 'guests', name: 'guests', label: 'Number of Guests', type: 'number', required: false, placeholder: '0' },
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
  custom: [
    { id: 'phone', name: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'Your phone number' },
    { id: 'address', name: 'address', label: 'Address', type: 'textarea', required: false, placeholder: 'Your address' },
    { id: 'birthdate', name: 'birthdate', label: 'Birth Date', type: 'text', required: false, placeholder: 'MM/DD/YYYY' },
    { id: 'comment', name: 'comment', label: 'Comments', type: 'textarea', required: false, placeholder: 'Additional comments...' },
    { id: 'subscribe', name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox', required: false },
    { id: 'company', name: 'company', label: 'Company', type: 'text', required: false, placeholder: 'Your company' },
    { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: false, placeholder: 'Your job title' },
    { id: 'website', name: 'website', label: 'Website', type: 'text', required: false, placeholder: 'https://your-website.com' },
    { 
      id: 'photo', 
      name: 'photo', 
      label: 'Photo', 
      type: 'file', 
      required: false, 
      accept: ['.jpg', '.jpeg', '.png'], 
      maxSize: 5 * 1024 * 1024, // 5MB max
      premium: true
    },
    { 
      id: 'document', 
      name: 'document', 
      label: 'Document', 
      type: 'file', 
      required: false, 
      accept: ['.pdf', '.doc', '.docx'], 
      maxSize: 10 * 1024 * 1024, // 10MB max
      premium: true
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
  survey: [
    { id: 'age', name: 'age', label: 'Age', type: 'number', required: false, placeholder: 'Your age' },
    { id: 'occupation', name: 'occupation', label: 'Occupation', type: 'text', required: false, placeholder: 'Your occupation' },
    { id: 'wouldRecommend', name: 'wouldRecommend', label: 'Would you recommend us?', type: 'checkbox', required: false },
    { id: 'comments', name: 'comments', label: 'Additional Comments', type: 'textarea', required: false, placeholder: 'Any additional comments...' },
  ],
  application: [
    { id: 'phone', name: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'Your phone number' },
    { id: 'education', name: 'education', label: 'Education', type: 'textarea', required: false, placeholder: 'Your educational background' },
    { id: 'workHistory', name: 'workHistory', label: 'Work History', type: 'textarea', required: false, placeholder: 'Your work history' },
    { 
      id: 'resume', 
      name: 'resume', 
      label: 'Resume', 
      type: 'file', 
      required: false, 
      accept: ['.pdf', '.doc', '.docx'], 
      maxSize: 10 * 1024 * 1024, // 10MB max
      premium: true
    },
  ],
  order: [
    { id: 'address', name: 'address', label: 'Shipping Address', type: 'textarea', required: false, placeholder: 'Your shipping address' },
    { id: 'phone', name: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'Your phone number' },
    { id: 'notes', name: 'notes', label: 'Order Notes', type: 'textarea', required: false, placeholder: 'Any special instructions' },
    { id: 'subscribe', name: 'subscribe', label: 'Subscribe to newsletters', type: 'checkbox', required: false },
  ],
  'analytics-opt-in': [
    { id: 'allowFunctionalCookies', name: 'allowFunctionalCookies', label: 'Allow Functional Cookies', type: 'checkbox', required: false },
    { id: 'allowMarketing', name: 'allowMarketing', label: 'Allow Marketing', type: 'checkbox', required: false },
    { id: 'country', name: 'country', label: 'Country', type: 'text', required: false, placeholder: 'Your country' },
  ],
  rsvp: [
    { id: 'dietaryRestrictions', name: 'dietaryRestrictions', label: 'Dietary Restrictions', type: 'textarea', required: false, placeholder: 'Any dietary restrictions' },
    { id: 'message', name: 'message', label: 'Message', type: 'textarea', required: false, placeholder: 'Any message for the host' },
    { id: 'phone', name: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'Your phone number' },
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
  custom: {
    title: 'Custom Form',
    description: 'A completely customized form for your specific needs'
  },
  survey: {
    title: 'Survey',
    description: 'Please complete this survey to help us improve'
  },
  application: {
    title: 'Application Form',
    description: 'Please fill out this application form'
  },
  order: {
    title: 'Order Form',
    description: 'Complete this form to place your order'
  },
  'analytics-opt-in': {
    title: 'Data Privacy Preferences',
    description: 'Manage your data privacy preferences'
  },
  rsvp: {
    title: 'RSVP',
    description: 'Please confirm your attendance'
  },
}; 