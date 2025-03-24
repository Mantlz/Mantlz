import { FeedbackFormAppearance, FeedbackFormProps } from './types';
import {  getPresetTheme } from './themes';

// Convert simple props to complex appearance object
export function simplePropsToAppearance(
  colorMode: 'light' | 'dark',
  {
    theme,
    primaryColor,
    backgroundColor,
    textColor,
    secondaryTextColor,
    borderColor,
    buttonTextColor,
    buttonBgColor,
    buttonHoverColor,
    starColor,
    starEmptyColor,
    borderRadius,
    fontSize,
    fontFamily,
    shadow,
    padding,
    submitButtonText,
    feedbackPlaceholder,
  }: Pick<FeedbackFormProps, 
    'theme' | 
    'primaryColor' | 
    'backgroundColor' | 
    'textColor' | 
    'secondaryTextColor' | 
    'borderColor' | 
    'buttonTextColor' | 
    'buttonBgColor' | 
    'buttonHoverColor' | 
    'starColor' | 
    'starEmptyColor' | 
    'borderRadius' | 
    'fontSize' | 
    'fontFamily' | 
    'shadow' | 
    'padding' | 
    'submitButtonText' | 
    'feedbackPlaceholder'
  >
): FeedbackFormAppearance {
  
  // Start with preset theme if specified
  let result: FeedbackFormAppearance = theme 
    ? getPresetTheme(theme, colorMode)
    : {};
  
  // Apply text colors
  if (textColor) {
    result = {
      ...result,
      typography: {
        ...result.typography,
        title: `text-${textColor} ${result.typography?.title?.replace(/text-[^\s]+/, '') || ''}`,
        description: `text-${textColor} ${result.typography?.description?.replace(/text-[^\s]+/, '') || ''}`,
      }
    };
  }
  
  if (secondaryTextColor) {
    result = {
      ...result,
      elements: {
        ...result.elements,
        textarea: {
          ...result.elements?.textarea,
          input: `placeholder:text-${secondaryTextColor} ${result.elements?.textarea?.input?.replace(/placeholder:text-[^\s]+/, '') || ''}`,
        }
      }
    };
  }
  
  // Apply button colors
  if (buttonTextColor) {
    result = {
      ...result,
      elements: {
        ...result.elements,
        submitButton: `text-${buttonTextColor} ${result.elements?.submitButton?.replace(/text-[^\s]+/, '') || ''}`,
      }
    };
  }
  
  if (buttonBgColor || buttonHoverColor) {
    let buttonClass = result.elements?.submitButton || '';
    
    if (buttonBgColor) {
      buttonClass = `bg-${buttonBgColor} ${buttonClass.replace(/bg-[^\s]+/, '')}`;
    }
    
    if (buttonHoverColor) {
      buttonClass = `hover:bg-${buttonHoverColor} ${buttonClass.replace(/hover:bg-[^\s]+/, '')}`;
    }
    
    result = {
      ...result,
      elements: {
        ...result.elements,
        submitButton: buttonClass,
      }
    };
  }
  
  // Apply star colors
  if (starColor) {
    result = {
      ...result,
      elements: {
        ...result.elements,
        starIcon: {
          ...result.elements?.starIcon,
          filled: `text-${starColor} ${result.elements?.starIcon?.filled?.replace(/text-[^\s]+/, '') || ''}`,
        }
      }
    };
  }
  
  if (starEmptyColor) {
    result = {
      ...result,
      elements: {
        ...result.elements,
        starIcon: {
          ...result.elements?.starIcon,
          empty: `text-${starEmptyColor} ${result.elements?.starIcon?.empty?.replace(/text-[^\s]+/, '') || ''}`,
        }
      }
    };
  }
  
  // Apply border color
  if (borderColor) {
    const borderClass = `border-${borderColor}`;
    
    result = {
      ...result,
      baseStyle: {
        ...result.baseStyle,
        container: `${result.baseStyle?.container?.replace(/border-[^\s]+/, '') || ''} ${borderClass}`,
      },
      elements: {
        ...result.elements,
        textarea: {
          ...result.elements?.textarea,
          input: `${result.elements?.textarea?.input?.replace(/border-[^\s]+/, '') || ''} ${borderClass}`,
        }
      }
    };
  }
  
  // Apply font family
  if (fontFamily) {
    result = {
      ...result,
      baseStyle: {
        ...result.baseStyle,
        container: `font-${fontFamily} ${result.baseStyle?.container || ''}`,
      }
    };
  }
  
  // Apply padding
  if (padding) {
    const paddingClass = padding === 'none' ? '' : `p-${padding}`;
    
    result = {
      ...result,
      baseStyle: {
        ...result.baseStyle,
        container: `${result.baseStyle?.container?.replace(/p-[^\s]+/, '') || ''} ${paddingClass}`,
      }
    };
  }
  
  // Apply primary color
  if (primaryColor) {
    result = {
      ...result,
      elements: {
        ...result.elements,
        starIcon: {
          ...result.elements?.starIcon,
          filled: `text-${primaryColor}-500`,
        },
        submitButton: colorMode === 'dark'
          ? `bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white`
          : `bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white`,
      }
    };
  }
  
  // Apply background color
  if (backgroundColor) {
    result = {
      ...result,
      baseStyle: {
        ...result.baseStyle,
        container: `bg-${backgroundColor} ${result.baseStyle?.container?.replace(/bg-[^\s]+/, '') || ''}`,
      }
    };
  }
  
  // Apply border radius
  if (borderRadius) {
    const radiusClass = borderRadius === 'none' ? '' : `rounded-${borderRadius}`;
    result = {
      ...result,
      baseStyle: {
        ...result.baseStyle,
        container: `${result.baseStyle?.container?.replace(/rounded-[^\s]+/, '') || ''} ${radiusClass}`,
      },
      elements: {
        ...result.elements,
        submitButton: `${result.elements?.submitButton?.replace(/rounded-[^\s]+/, '') || ''} ${radiusClass}`,
      }
    };
  }
  
  // Apply font size
  if (fontSize) {
    result = {
      ...result,
      typography: {
        ...result.typography,
        feedbackPlaceholder: `text-${fontSize}`,
        submitButtonText: `text-${fontSize}`,
      }
    };
  }
  
  // Apply shadow
  if (shadow) {
    const shadowClass = shadow === 'none' ? '' : `shadow-${shadow}`;
    result = {
      ...result,
      baseStyle: {
        ...result.baseStyle,
        container: `${result.baseStyle?.container?.replace(/shadow-[^\s]+/, '') || ''} ${shadowClass}`,
      }
    };
  }
  
  // Apply text customizations
  if (submitButtonText || feedbackPlaceholder) {
    result = {
      ...result,
      typography: {
        ...result.typography,
        ...(submitButtonText && { submitButtonText }),
        ...(feedbackPlaceholder && { feedbackPlaceholder }),
      }
    };
  }
  
  return result;
}

// Process and merge all appearance settings
export function processAppearance(
  appearance: FeedbackFormProps['appearance'],
  colorScheme: 'light' | 'dark',
  simpleProps: Pick<FeedbackFormProps, 'theme' | 'primaryColor' | 'backgroundColor' | 'borderRadius' | 'fontSize' | 'shadow'>
): FeedbackFormAppearance {
  // Get styles from simple props
  const simpleStyles = simplePropsToAppearance(colorScheme, simpleProps);
  
  // Get styles from complex appearance prop
  const complexStyles = typeof appearance === 'function' 
    ? appearance(colorScheme)
    : appearance || {};
    
  // Merge, with complex styles taking precedence
  return {
    ...simpleStyles,
    ...complexStyles,
    baseStyle: {
      ...simpleStyles.baseStyle,
      ...complexStyles.baseStyle,
    },
    elements: {
      ...simpleStyles.elements,
      ...complexStyles.elements,
      starIcon: {
        ...simpleStyles.elements?.starIcon,
        ...complexStyles.elements?.starIcon,
      },
      textarea: {
        ...simpleStyles.elements?.textarea,
        ...complexStyles.elements?.textarea,
      },
    },
    typography: {
      ...simpleStyles.typography,
      ...complexStyles.typography,
    },
  };
} 