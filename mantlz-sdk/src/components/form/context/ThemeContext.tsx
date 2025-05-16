import React, { createContext, ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';

export interface ThemeContextType {
  theme: 'default' | 'modern' | 'neobrutalism' | 'simple';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: ThemeContextType['theme'];
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = 'default' 
}) => {
  // Set radius based on theme
  const radius = theme === 'neobrutalism' ? 'none' : 
                theme === 'modern' ? 'large' : 
                theme === 'simple' ? 'small' : 
                'medium';

  return (
    <ThemeContext.Provider value={{ theme }}>
      <Theme 
        appearance="light" 
        accentColor="blue" 
        radius={radius}
        style={{ width: '100%' }}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}; 