import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { Appearance } from '../types';

interface UsersJoinedProps {
  showUsersJoined: boolean;
  canShowUsersJoined: boolean;
  usersJoined: number;
  usersJoinedLabel: string;
  appearance?: Appearance;
}

export const UsersJoined: React.FC<UsersJoinedProps> = ({
  showUsersJoined,
  canShowUsersJoined,
  usersJoined,
  usersJoinedLabel,
  appearance,
}) => {
  const isDarkMode = useDarkMode();
  
  // Determine if we should use dark mode based on appearance.baseTheme or system preference
  const shouldUseDarkMode = appearance?.baseTheme 
    ? appearance.baseTheme === 'dark'
    : isDarkMode;

  const getUsersJoinedStyles = () => {
    const baseStyles = {
      fontSize: "13px",
      color: shouldUseDarkMode ? "white" : "var(--gray-20)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      marginBottom: "2px",
      marginTop: "-2px",
    };
    
    // Apply appearance variables if provided
    if (appearance?.variables?.colorText) {
      baseStyles.color = appearance.variables.colorText;
    }
    if (appearance?.variables?.fontSize) {
      baseStyles.fontSize = appearance.variables.fontSize;
    }
    
    return baseStyles;
  };

  const getUsersJoinedNumberStyles = () => {
    const baseStyles = {
      fontWeight: 600,
      color: shouldUseDarkMode ? "white" : "black",
    };
    
    // Apply appearance variables if provided
    if (appearance?.variables?.colorText) {
      baseStyles.color = appearance.variables.colorText;
    }
    if (appearance?.variables?.fontWeight) {
      const fontWeight = parseInt(appearance.variables.fontWeight, 10);
      if (!isNaN(fontWeight)) {
        baseStyles.fontWeight = fontWeight;
      }
    }
    
    return baseStyles;
  };

  if (!showUsersJoined || !canShowUsersJoined || usersJoined <= 0) {
    return null;
  }

  return (
    <div 
      className={appearance?.elements?.usersJoined || ''}
      style={getUsersJoinedStyles()}
    >
      <span style={getUsersJoinedNumberStyles()}>
        {usersJoined}
      </span>{" "}
      {usersJoinedLabel}
    </div>
  );
};