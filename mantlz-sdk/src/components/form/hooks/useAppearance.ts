import { CSSProperties } from 'react';
import { Appearance, AppearanceVariables } from '../types';
import { useDarkMode } from './useDarkMode';
import { themes } from '../themes';

export const useAppearance = (theme: string, appearance?: Appearance) => {
  const isDarkMode = useDarkMode();
  const baseTheme = themes[theme || 'default'];
  
  // Determine if we should use dark mode based on appearance.baseTheme or system preference
  const shouldUseDarkMode = appearance?.baseTheme 
    ? appearance.baseTheme === 'dark'
    : isDarkMode;

  // Helper function to apply appearance variables to CSS properties
  const applyVariables = (baseStyles: CSSProperties, variables?: AppearanceVariables): CSSProperties => {
    if (!variables) return baseStyles;

    const updatedStyles = { ...baseStyles };

    // Apply color variables
    if (variables.colorBackground) {
      updatedStyles.backgroundColor = variables.colorBackground;
    }
    if (variables.colorText) {
      updatedStyles.color = variables.colorText;
    }
    if (variables.borderRadius) {
      updatedStyles.borderRadius = variables.borderRadius;
    }
    if (variables.fontFamily) {
      updatedStyles.fontFamily = variables.fontFamily;
    }
    if (variables.fontSize) {
      updatedStyles.fontSize = variables.fontSize;
    }
    if (variables.fontWeight) {
      updatedStyles.fontWeight = variables.fontWeight;
    }

    return updatedStyles;
  };

  // Helper function to merge CSS classes
  const mergeClasses = (baseClasses: string = '', customClasses: string = ''): string => {
    return [baseClasses, customClasses].filter(Boolean).join(' ');
  };

  // Get container styles with appearance customization
  const getContainerStyles = (): CSSProperties => {
    const baseStyles = shouldUseDarkMode && baseTheme.form.containerDark 
      ? baseTheme.form.containerDark 
      : baseTheme.form.container;
    
    return applyVariables(baseStyles, appearance?.variables);
  };

  // Get title styles with appearance customization
  const getTitleStyles = (): CSSProperties => {
    const baseStyles = shouldUseDarkMode && baseTheme.form.titleDark 
      ? baseTheme.form.titleDark 
      : baseTheme.form.title;
    
    return applyVariables(baseStyles, appearance?.variables);
  };

  // Get description styles with appearance customization
  const getDescriptionStyles = (): CSSProperties => {
    const baseStyles = shouldUseDarkMode && baseTheme.form.descriptionDark 
      ? baseTheme.form.descriptionDark 
      : baseTheme.form.description;
    
    return applyVariables(baseStyles, appearance?.variables);
  };

  // Get label styles with appearance customization
  const getLabelStyles = (): CSSProperties => {
    const baseStyles = shouldUseDarkMode && baseTheme.field.labelDark 
      ? baseTheme.field.labelDark 
      : baseTheme.field.label;
    
    return applyVariables(baseStyles, appearance?.variables);
  };

  // Get input styles with appearance customization
  const getInputStyles = (): CSSProperties => {
    const baseStyles = shouldUseDarkMode && baseTheme.field.inputDark 
      ? baseTheme.field.inputDark 
      : baseTheme.field.input;
    
    let updatedStyles = applyVariables(baseStyles, appearance?.variables);
    
    // Apply input-specific variables
    if (appearance?.variables?.colorInputBackground) {
      updatedStyles.backgroundColor = appearance.variables.colorInputBackground;
    }
    if (appearance?.variables?.colorInputText) {
      updatedStyles.color = appearance.variables.colorInputText;
    }
    
    return updatedStyles;
  };

  // Get button styles with appearance customization
  const getButtonStyles = (): CSSProperties => {
    const baseStyles = baseTheme.button;
    let updatedStyles = applyVariables(baseStyles, appearance?.variables);
    
    // Apply primary color to button
    if (appearance?.variables?.colorPrimary) {
      updatedStyles.backgroundColor = appearance.variables.colorPrimary;
    }
    
    return updatedStyles;
  };

  // Get CSS classes for elements
  const getElementClasses = () => {
    return {
      card: appearance?.elements?.card || '',
      formTitle: appearance?.elements?.formTitle || '',
      formDescription: appearance?.elements?.formDescription || '',
      formField: appearance?.elements?.formField || '',
      formLabel: appearance?.elements?.formLabel || '',
      formInput: appearance?.elements?.formInput || '',
      formButton: appearance?.elements?.formButton || '',
      formError: appearance?.elements?.formError || '',
      usersJoined: appearance?.elements?.usersJoined || '',
    };
  };

  return {
    getContainerStyles,
    getTitleStyles,
    getDescriptionStyles,
    getLabelStyles,
    getInputStyles,
    getButtonStyles,
    getElementClasses,
    mergeClasses,
    shouldUseDarkMode,
    styles: baseTheme
  };
};