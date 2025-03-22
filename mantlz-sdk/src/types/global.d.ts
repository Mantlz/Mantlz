import { MantlzClient } from '../types';

declare global {
  interface Window {
    mantlz: MantlzClient;
  }
}

export {}; 