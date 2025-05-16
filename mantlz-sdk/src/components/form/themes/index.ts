import { Theme } from './types';

export const themes: Record<string, Theme> = {
  default: {
    form: {
      container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '16px',
        backgroundColor: 'white',
      },
      title: {
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--gray-12)',
        marginBottom: '8px',
      },
      description: {
        color: 'var(--gray-11)',
        fontSize: '14px',
        marginBottom: '16px',
      },
    },
    field: {
      container: {
        marginBottom: '12px',
      },
      label: {
        display: 'block',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--gray-12)',
      },
      input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid var(--gray-6)',
        backgroundColor: 'var(--gray-1)',
        fontSize: '14px',
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '12px',
        marginTop: '4px',
      },
    },
    button: {
      padding: '8px 16px',
      backgroundColor: 'var(--blue-9)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
    },
  },

  modern: {
    form: {
      container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: 'var(--violet-1)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px -4px var(--gray-4)',
        border: '1px solid var(--violet-4)',
      },
      title: {
        fontSize: '24px',
        fontWeight: '600',
        color: 'var(--violet-12)',
        marginBottom: '12px',
        letterSpacing: '-0.02em',
      },
      description: {
        color: 'var(--violet-11)',
        fontSize: '15px',
        lineHeight: '1.5',
        marginBottom: '24px',
      },
    },
    field: {
      container: {
        marginBottom: '20px',
      },
      label: {
        display: 'block',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--violet-12)',
        letterSpacing: '-0.01em',
      },
      input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '2px solid var(--violet-4)',
        backgroundColor: 'white',
        fontSize: '15px',
        boxShadow: '0 2px 8px -2px var(--violet-3)',
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '13px',
        marginTop: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      },
    },
    button: {
      padding: '12px 24px',
      backgroundColor: 'var(--violet-9)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px -2px var(--violet-5)',
    },
  },

  neobrutalism: {
    form: {
      container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'var(--yellow-2)',
        border: '2px solid black',
        borderRadius: '0',
        boxShadow: '4px 4px 0 black',
      },
      title: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'black',
        marginBottom: '8px',
        textTransform: 'uppercase',
      },
      description: {
        color: 'var(--gray-12)',
        fontSize: '14px',
        fontFamily: 'monospace',
        marginBottom: '16px',
      },
    },
    field: {
      container: {
        marginBottom: '14px',
      },
      label: {
        display: 'block',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: '700',
        color: 'black',
        textTransform: 'uppercase',
      },
      input: {
        width: '100%',
        padding: '8px 12px',
        backgroundColor: 'white',
        border: '2px solid black',
        borderRadius: '0',
        boxShadow: '2px 2px 0 black',
        fontSize: '14px',
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '12px',
        marginTop: '4px',
        fontWeight: '700',
        textTransform: 'uppercase',
      },
    },
    button: {
      padding: '8px 16px',
      backgroundColor: 'var(--blue-9)',
      color: 'white',
      border: '2px solid black',
      borderRadius: '0',
      fontWeight: '700',
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: '2px 2px 0 black',
      textTransform: 'uppercase',
    },
  },

  simple: {
    form: {
      container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '16px',
        backgroundColor: 'white',
      },
      title: {
        fontSize: '18px',
        fontWeight: '500',
        color: 'var(--gray-12)',
        marginBottom: '8px',
      },
      description: {
        color: 'var(--gray-11)',
        fontSize: '14px',
        marginBottom: '16px',
      },
    },
    field: {
      container: {
        marginBottom: '12px',
      },
      label: {
        display: 'block',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: '400',
        color: 'var(--gray-11)',
      },
      input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid var(--gray-4)',
        backgroundColor: 'white',
        fontSize: '14px',
      },
      error: {
        color: 'var(--red-9)',
        fontSize: '12px',
        marginTop: '4px',
      },
    },
    button: {
      padding: '8px 16px',
      backgroundColor: 'var(--blue-9)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: '400',
      fontSize: '14px',
      cursor: 'pointer',
    },
  },
}; 