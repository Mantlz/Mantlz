'use client';

import React, { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
// import * as Progress from '@radix-ui/react-progress';
import { ReloadIcon } from '@radix-ui/react-icons';

import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { MantlzProps } from './types';
import { StarRating } from './components/StarRating';
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
  const [starRating, setStarRating] = useState(0);
  const [usersJoined, setUsersJoined] = useState(initialUsersJoinedCount);
  const [canShowUsersJoined, setCanShowUsersJoined] = useState(false);
  const styles = themes[theme];

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
    submitting,
    submitted,
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

  // Main form render
  return (
    <ThemeProvider theme={theme}>
      <div 
        className={className}
        style={{
          ...styles.form.container,
          backgroundColor: 'transparent',
        }}
      >
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
        
        <Form.Root onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                formMethods={formMethods}
              />
            ))}
            
            {formData.formType === 'feedback' && (
              <Form.Field name="rating">
                <Form.Label style={styles.field.label}>
                  Rating<span style={{ color: 'var(--red-9)' }}>*</span>
                </Form.Label>
                <StarRating 
                  rating={starRating} 
                  setRating={setStarRating} 
                />
                {formMethods.formState.errors.rating && (
                  <Form.Message style={styles.field.error}>
                    {formMethods.formState.errors.rating?.message as string}
                  </Form.Message>
                )}
              </Form.Field>
            )}
            
            {showUsersJoined && canShowUsersJoined && usersJoined > 0 && (
              <div style={{ 
                fontSize: '14px',
                color: 'var(--gray-11)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  fontWeight: 600,
                  color: 'var(--gray-12)'
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
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <>
                    <ReloadIcon style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </ThemeProvider>
  );
}
