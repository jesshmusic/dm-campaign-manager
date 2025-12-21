module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/spec/javascript/jestGlobalSetup.js'],
  roots: ['<rootDir>/app/javascript', '<rootDir>/spec/javascript'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
        resolveJsonModule: true
      }
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/spec/javascript/__mocks__/fileMock.js',
    '^react-icons/all$': '<rootDir>/spec/javascript/__mocks__/reactIconsMock.js',
    '^react-icons/(.*)$': '<rootDir>/spec/javascript/__mocks__/reactIconsMock.js',
    '^bundles/(.*)$': '<rootDir>/app/javascript/bundles/$1',
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/spec/javascript/setupTests.ts'],
  collectCoverageFrom: [
    'app/javascript/**/*.{ts,tsx}',
    '!app/javascript/**/*.d.ts',
    '!app/javascript/packs/**',
    '!app/javascript/bundles/**/types.ts',
    '!app/javascript/bundles/**/enums.ts'
  ],
  coverageDirectory: 'coverage/javascript',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/public/', '/vendor/'],
  coverageThreshold: {
    global: {
      branches: 39.5,
      functions: 55,
      lines: 65,
      statements: 65
    }
  },
  verbose: true
};
