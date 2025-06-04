'use client';

import React, { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
// import * as Progress from '@radix-ui/react-progress';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from '../../utils/toast';

import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { MantlzProps, FormType } from './types';
import { FormField } from './components/FormField';
import { useFormLogic } from './hooks/useFormLogic';
import { ThemeProvider } from './context/ThemeContext';
import { themes } from './themes';

export default function Mantlz({
  formId,
  className,
  showUsersJoined = false,
  usersJoinedCount: initialUsersJoinedCount = 0,
  usersJoinedLabel = 'people have joined',
  redirectUrl,
  theme = 'default',
}: MantlzProps) {
  const { client, apiKey } = useMantlz();
  const [usersJoined, setUsersJoined] = useState(initialUsersJoinedCount);
  const [canShowUsersJoined, setCanShowUsersJoined] = useState(false);
  const styles = themes[theme];
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch users joined count
  React.useEffect(() => {
    if (!showUsersJoined || !client || !formId) return;
    
    const fetchUsersCount = async () => {
      try {
        const count = await client.getUsersJoinedCount(formId);
        if (count > 0) {
          setUsersJoined(count);
          setCanShowUsersJoined(true);
        }
      } catch (error) {
        console.error('Failed to fetch users joined count:', error);
      }
    };
    
    fetchUsersCount();
    const intervalId = setInterval(fetchUsersCount, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [showUsersJoined, formId, client]);

  if (!formId) {
    return (
      <Theme appearance="light" accentColor="blue" radius="medium">
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid var(--red-6)',
          backgroundColor: 'var(--red-2)'
        }}>
          <h2 style={{ 
            color: 'var(--red-11)',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>Form Error</h2>
          <p style={{ color: 'var(--red-11)' }}>Form ID is required</p>
        </div>
      </Theme>
    );
  }

  // Use form logic hook
  const {
    formData,
    loading,
    fields,
    formMethods,
    onSubmit,
    isMounted,
  } = useFormLogic(formId, client, apiKey, redirectUrl);

  // Render loading state
  if (!isMounted || loading) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '32px' 
        }}>
          <ReloadIcon style={{ 
            animation: 'spin 1s linear infinite',
            width: '24px',
            height: '24px',
            color: 'var(--blue-9)'
          }} />
        </div>
      </ThemeProvider>
    );
  }

  // Render API key error
  if (!apiKey) {
    return <ApiKeyErrorCard />;
  }

  // Render form error
  if (!formData || fields.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid var(--red-6)',
          backgroundColor: 'var(--red-2)'
        }}>
          <h2 style={{ 
            color: 'var(--red-11)',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>Form Error</h2>
          <p style={{ color: 'var(--red-11)' }}>
            {loading ? 'Loading form...' : 'Form configuration is missing or empty.'}
          </p>
        </div>
      </ThemeProvider>
    );
  }

  // Render success message after submission
  if (submitted) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid var(--green-6)',
          backgroundColor: 'var(--green-2)'
        }}>
          <h2 style={{ 
            color: 'var(--green-11)',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>Thank You!</h2>
          <p style={{ color: 'var(--green-11)' }}>
            Your submission has been received.
          </p>
        </div>
      </ThemeProvider>
    );
  }

  // Extract form type safely
  const formType = formData.formType as FormType;

  // Handle form submission
  const onSubmitHandler = async (data: any) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (formType === 'order') {
        toast.error('Order form functionality is currently under development. Please check back later.', {
          duration: 5000,
          position: 'top-right'
        });
        setSubmitting(false);
        return;
      }

      // For non-order forms, proceed with normal submission
      const result = await onSubmit(data);
      
      if (result?.success) {
        setSubmitted(true);
      } else if (result?.isConflict) {
        // Handle conflict errors with a specific message
        toast.error('Duplicate Entry', {
          description: result.message,
          duration: 5000,
          position: 'top-right'
        });
      } else if (result?.error) {
        // Let the client handle other errors
        throw result.error;
      } else {
        throw new Error(result?.message || 'Form submission failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      // Only throw unhandled errors to the client
      if (!error.alreadyHandled && !error.isConflict) {
        throw error; // Let the client handle the error
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Main form render
  return (
    <ThemeProvider theme={theme}>
      <div 
        className={className}
        style={{
          ...styles.form.container,
          backgroundColor: 'white', // Change from 'transparent' to 'white'
          // Add these properties to ensure content visibility
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        }}
      >
        {formType === 'order' && (
          <div style={{ 
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid var(--amber-6)',
            backgroundColor: 'var(--amber-2)'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--amber-11)',
              fontSize: '14px',
              fontWeight: 500
            }}>
              <span>⚠️</span>
              <span>Order Forms - Coming Soon</span>
            </div>
            <p style={{ 
              marginTop: '4px',
              fontSize: '13px',
              color: 'var(--amber-11)',
              opacity: 0.8
            }}>
              This feature is currently under development. Submissions are disabled.
            </p>
          </div>
        )}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={styles.form.title}>
            {formData?.title || formData?.name}
          </h2>
          {formData?.description && (
            <p style={styles.form.description}>
              {formData.description}
            </p>
          )}
        </div>
        
        <Form.Root onSubmit={formMethods.handleSubmit(onSubmitHandler)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                formMethods={formMethods}
              />
            ))}
            
            {/* Conditional UI for survey form type */}
            {formType === 'survey' && formMethods.getValues('satisfaction') && (
              <div style={{ 
                padding: '8px',
                backgroundColor: 'var(--blue-2)',
                borderRadius: '6px',
                fontSize: '14px',
                color: 'var(--blue-11)'
              }}>
                Thank you for rating your satisfaction!
              </div>
            )}
            
            {/* Show analytics consent info for analytics-opt-in forms */}
            {formType === 'analytics-opt-in' && (
              <div style={{ 
                padding: '8px',
                backgroundColor: 'var(--gray-2)',
                borderRadius: '6px',
                fontSize: '14px',
                color: 'var(--gray-20)',
                marginBottom: '8px'
              }}>
                Your privacy choices matter to us. You can change these preferences at any time.
              </div>
            )}
            
            {showUsersJoined && canShowUsersJoined && usersJoined > 0 && (
              <div style={{ 
                fontSize: '13px',
                color: 'var(--gray-20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginBottom: '2px',
                marginTop: '-2px'
              }}>
                <span style={{ 
                  fontWeight: 600,
                  color: 'black'
                }}>{usersJoined}</span> {usersJoinedLabel}
              </div>
            )}
            
            <Form.Submit asChild>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.button,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: formType === 'order' ? 'var(--green-9)' : styles.button.backgroundColor
                }}
              >
                {submitting ? (
                  <>
                    <ReloadIcon style={{ animation: 'spin 1s linear infinite' }} />
                    {formType === 'order' ? 'Processing...' : 'Submitting...'}
                  </>
                ) : (
                  formType === 'order' ? 'Proceed to Payment' : 'Submit'
                )}
              </button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </ThemeProvider>
  );
}
