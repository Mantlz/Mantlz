// This polyfill helps handle browser globals that might be missing in Node.js environments
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
}

// If running in a browser, this file does nothing 