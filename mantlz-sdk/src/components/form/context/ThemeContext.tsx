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


  return (
    <ThemeContext.Provider value={{ theme }}>
      <Theme 
       
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}; 