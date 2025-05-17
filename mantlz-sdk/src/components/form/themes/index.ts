import { Theme } from './types';

export const themes: Record<string, Theme> = {
  default: {
    form: {
      container: {
        maxWidth: '450px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
      },
      title: {
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--gray-12)',
        marginBottom: '12px',
        lineHeight: '1.3',
      },
      description: {
        color: 'var(--gray-11)',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '16px',
      },
    },
    field: {
      container: {
        marginBottom: '16px',
      },
      label: {
        display: 'block',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--gray-12)',
      },
      input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid var(--gray-6)',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        '&:focus': {
          borderColor: 'var(--blue-8)',
          outline: 'none',
        },
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '13px',
        marginTop: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      },
    },
    button: {
      padding: '10px 16px',
      backgroundColor: 'var(--blue-9)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: 'var(--blue-10)',
      },
      '&:active': {
        opacity: 0.9,
      },
    },
  },

  modern: {
    form: {
      container: {
        maxWidth: '450px',
        margin: '0 auto',
        padding: '24px',
        borderRadius: '10px',
        border: '1px solid var(--gray-5)',
      },
      title: {
        fontSize: '22px',
        fontWeight: '600',
        color: 'var(--gray-12)',
        marginBottom: '12px',
        letterSpacing: '-0.02em',
        lineHeight: '1.2',
      },
      description: {
        color: 'var(--gray-11)',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '20px',
      },
    },
    field: {
      container: {
        marginBottom: '16px',
      },
      label: {
        display: 'block',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--gray-12)',
        letterSpacing: '-0.01em',
      },
      input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid var(--gray-6)',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        '&:focus': {
          borderColor: 'var(--gray-10)',
          outline: 'none',
        },
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '13px',
        marginTop: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      },
    },
    button: {
      padding: '10px 20px',
      backgroundColor: 'var(--gray-12)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: 'var(--gray-11)',
      },
      '&:active': {
        transform: 'translateY(1px)',
      },
    },
  },

  neobrutalism: {
    form: {
      container: {
        maxWidth: '450px',
        margin: '0 auto',
        padding: '20px',
        border: '3px solid black',
        borderRadius: '0',
        boxShadow: '5px 5px 0 black',
        position: 'relative',
      },
      title: {
        fontSize: '22px',
        fontWeight: '800',
        color: 'black',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
        position: 'relative',
      },
      description: {
        color: 'black',
        fontSize: '14px',
        fontFamily: 'monospace',
        marginBottom: '16px',
        lineHeight: '1.5',
        position: 'relative',
      },
    },
    field: {
      container: {
        marginBottom: '16px',
        position: 'relative',
      },
      label: {
        display: 'block',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '800',
        color: 'black',
        textTransform: 'uppercase',
      },
      input: {
        width: '100%',
        padding: '10px 12px',
        border: '3px solid black',
        borderRadius: '0',
        boxShadow: '3px 3px 0 black',
        fontSize: '14px',
        fontFamily: 'monospace',
        transition: 'transform 0.1s, box-shadow 0.1s',
        '&:focus': {
          transform: 'translate(-2px, -2px)',
          boxShadow: '5px 5px 0 black',
          outline: 'none',
        },
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '13px',
        marginTop: '6px',
        fontWeight: '700',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      },
    },
    button: {
      padding: '10px 18px',
      backgroundColor: 'var(--yellow-4)',
      color: 'black',
      border: '3px solid black',
      borderRadius: '0',
      fontWeight: '800',
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: '3px 3px 0 black',
      textTransform: 'uppercase',
      transition: 'transform 0.1s, box-shadow 0.1s',
      '&:hover': {
        backgroundColor: 'var(--yellow-5)',
      },
      '&:active': {
        transform: 'translate(3px, 3px)',
        boxShadow: '0px 0px 0 black',
      },
    },
  },

  simple: {
    form: {
      container: {
        maxWidth: '450px',
        margin: '0 auto',
        padding: '20px',
      },
      title: {
        fontSize: '18px',
        fontWeight: '500',
        color: 'var(--gray-12)',
        marginBottom: '10px',
        lineHeight: '1.3',
      },
      description: {
        color: 'var(--gray-11)',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '16px',
      },
    },
    field: {
      container: {
        marginBottom: '14px',
      },
      label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '14px',
        fontWeight: '400',
        color: 'var(--gray-11)',
      },
      input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--gray-6)',
        fontSize: '14px',
        transition: 'border-color 0.15s',
        '&:focus': {
          borderColor: 'var(--gray-8)',
          outline: 'none',
        },
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '13px',
        marginTop: '5px',
      },
    },
    button: {
      padding: '8px 16px',
      backgroundColor: 'var(--gray-9)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
      '&:hover': {
        backgroundColor: 'var(--gray-10)',
      },
    },
  },
}; 