'use client';
import { FeedbackForm, WaitlistForm } from '@mantlz/nextjs';
import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, MessageSquare, Plus, PlayCircle, RefreshCw, Info, Settings, Check, ExternalLink, ChevronDown } from 'lucide-react';

type FormType = 'feedbackForm' | 'waitlistForm' | 'contactForm';

interface FormConfig {
  formId: string;
  active: boolean;
  darkMode: boolean;
  expanded?: boolean; // For mobile view
}

interface FormSettings {
  feedbackForm: FormConfig;
  waitlistForm: FormConfig;
  contactForm: FormConfig;
}

const TestPage = () => {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    feedbackForm: {
      formId: '',
      active: false,
      darkMode: false,
      expanded: true
    },
    waitlistForm: {
      formId: '',
      active: false,
      darkMode: false,
      expanded: false
    },
    contactForm: {
      formId: '',
      active: false,
      darkMode: false,
      expanded: false
    }
  });
  
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport size on mount and window resize
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkViewport();
    
    // Add listener for resize
    window.addEventListener('resize', checkViewport);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const updateFormId = (formType: FormType, id: string) => {
    setFormSettings(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        formId: id
      }
    }));
  };

  const toggleFormActive = (formType: FormType) => {
    setFormSettings(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        active: !prev[formType].active
      }
    }));
  };

  const toggleDarkMode = (formType: FormType) => {
    setFormSettings(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        darkMode: !prev[formType].darkMode
      }
    }));
  };
  
  const toggleExpanded = (formType: FormType) => {
    setFormSettings(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        expanded: !prev[formType].expanded
      }
    }));
  };

  const getActiveFormCount = () => {
    return Object.values(formSettings).filter(form => form.active && form.formId).length;
  };

  const resetAllForms = () => {
    setFormSettings({
      feedbackForm: {
        formId: '',
        active: false,
        darkMode: false,
        expanded: true
      },
      waitlistForm: {
        formId: '',
        active: false,
        darkMode: false,
        expanded: false
      },
      contactForm: {
        formId: '',
        active: false,
        darkMode: false,
        expanded: false
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 px-4 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-50 dark:bg-zinc-900/20 rounded-lg">
                <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Form Playground</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Try out your forms before embedding them</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs py-1 px-2 bg-zinc-100 text-blue-800 dark:bg-zinc-900/30 dark:text-blue-400 rounded-lg flex items-center gap-1.5">
                <Check className="h-3 w-3" />
                <span>{getActiveFormCount()} Live Preview{getActiveFormCount() !== 1 ? 's' : ''}</span>
              </span>
              <button 
                onClick={resetAllForms}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Reset all forms"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Feedback Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div 
            className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer sm:cursor-default"
            onClick={() => isMobile && toggleExpanded('feedbackForm')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900/20 rounded-lg">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Feedback Form</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFormActive('feedbackForm');
                }}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  formSettings.feedbackForm.active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-zinc-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300'
                }`}
              >
                {formSettings.feedbackForm.active && <Check className="h-3 w-3" />}
                <span className="hidden xs:inline">{formSettings.feedbackForm.active ? 'Active' : 'Inactive'}</span>
                <span className="xs:hidden">{formSettings.feedbackForm.active ? 'On' : 'Off'}</span>
              </button>
              {isMobile && (
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${formSettings.feedbackForm.expanded ? 'rotate-180' : ''}`} />
              )}
            </div>
          </div>
          
          {(!isMobile || formSettings.feedbackForm.expanded) && (
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Form ID
                </label>
                <input 
                  type="text" 
                  placeholder="Paste your form ID here"
                  value={formSettings.feedbackForm.formId}
                  onChange={(e) => updateFormId('feedbackForm', e.target.value)}
                  className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Appearance:</span>
                </div>
                <button 
                  onClick={() => toggleDarkMode('feedbackForm')}
                  className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                    formSettings.feedbackForm.darkMode 
                      ? 'bg-zinc-800 text-gray-200' 
                      : 'bg-zinc-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300'
                  }`}
                >
                  {formSettings.feedbackForm.darkMode ? 'Dark' : 'Light'}
                </button>
              </div>
              
              {formSettings.feedbackForm.active && formSettings.feedbackForm.formId && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/30">
                  <div className="w-full overflow-hidden">
                    <FeedbackForm 
                      formId={formSettings.feedbackForm.formId} 
                      darkMode={formSettings.feedbackForm.darkMode}
                    />
                  </div>
                </div>
              )}
              
              {formSettings.feedbackForm.active && !formSettings.feedbackForm.formId && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/30 flex flex-col items-center justify-center py-6 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please enter a form ID to preview
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Waitlist Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div 
            className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer sm:cursor-default"
            onClick={() => isMobile && toggleExpanded('waitlistForm')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Waitlist Form</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFormActive('waitlistForm');
                }}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  formSettings.waitlistForm.active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-zinc-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300'
                }`}
              >
                {formSettings.waitlistForm.active && <Check className="h-3 w-3" />}
                <span className="hidden xs:inline">{formSettings.waitlistForm.active ? 'Active' : 'Inactive'}</span>
                <span className="xs:hidden">{formSettings.waitlistForm.active ? 'On' : 'Off'}</span>
              </button>
              {isMobile && (
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${formSettings.waitlistForm.expanded ? 'rotate-180' : ''}`} />
              )}
            </div>
          </div>
          
          {(!isMobile || formSettings.waitlistForm.expanded) && (
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Form ID
                </label>
                <input 
                  type="text" 
                  placeholder="Paste your form ID here"
                  value={formSettings.waitlistForm.formId}
                  onChange={(e) => updateFormId('waitlistForm', e.target.value)}
                  className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Appearance:</span>
                </div>
                <button 
                  onClick={() => toggleDarkMode('waitlistForm')}
                  className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                    formSettings.waitlistForm.darkMode 
                      ? 'bg-zinc-800 text-gray-200' 
                      : 'bg-zinc-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300'
                  }`}
                >
                  {formSettings.waitlistForm.darkMode ? 'Dark' : 'Light'}
                </button>
              </div>
              
              {formSettings.waitlistForm.active && formSettings.waitlistForm.formId && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/30">
                  <div className="w-full overflow-hidden">
                    <WaitlistForm 
                      formId={formSettings.waitlistForm.formId} 
                      //theme={formSettings.waitlistForm.darkMode ? 'dark' : 'light'}
                    />
                  </div>
                </div>
              )}
              
              {formSettings.waitlistForm.active && !formSettings.waitlistForm.formId && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/30 flex flex-col items-center justify-center py-6 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please enter a form ID to preview
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Card - Contact Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact Form</h3>
            </div>
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1.5">
              <Info className="h-3 w-3" />
              <span className="hidden xs:inline">Coming Soon</span>
              <span className="xs:hidden">Soon</span>
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center px-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Contact Form Support</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 sm:mb-6 max-w-md mx-auto">
            We&apos;re working on adding contact form support to make it easier to gather leads and inquiries.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-zinc-50 dark:text-blue-400 dark:bg-zinc-900/20 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
            Learn more
          </button>
        </div>
      </div>
      
      {/* Developer Note */}
      <div className="bg-zinc-50 dark:bg-zinc-900/10 rounded-lg p-3 sm:p-3.5 border border-blue-100 dark:border-blue-900/20 text-xs sm:text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          This playground processes real form submissions. Any data submitted will be recorded in your Mantlz dashboard.
        </p>
      </div>
    </div>
  );
};

export default TestPage;