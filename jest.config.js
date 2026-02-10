/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/constants/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    'src/providers/**/*.{ts,tsx}',
    '!**/__tests__/**',
  ],
};
