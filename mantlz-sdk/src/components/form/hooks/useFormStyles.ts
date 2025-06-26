import { useDarkMode } from './useDarkMode';
import { themes } from '../themes';

export const useFormStyles = (theme: string) => {
  const isDarkMode = useDarkMode();
  const styles = themes[theme];

  const getContainerStyles = () => {
    return isDarkMode && styles.form.containerDark 
      ? styles.form.containerDark 
      : styles.form.container;
  };

  const getTitleStyles = () => {
    return isDarkMode && styles.form.titleDark 
      ? styles.form.titleDark 
      : styles.form.title;
  };

  const getDescriptionStyles = () => {
    return isDarkMode && styles.form.descriptionDark 
      ? styles.form.descriptionDark 
      : styles.form.description;
  };

  const getButtonStyles = () => {
    return isDarkMode && styles.buttonDark 
      ? styles.buttonDark 
      : styles.button;
  };

  return {
    getContainerStyles,
    getTitleStyles,
    getDescriptionStyles,
    getButtonStyles,
    styles,
    isDarkMode
  };
};