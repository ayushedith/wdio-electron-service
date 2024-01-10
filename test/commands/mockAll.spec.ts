import { vi, describe, beforeEach, it, expect, afterEach } from 'vitest';

import { mockAll } from '../../src/commands/mockAll.js';

interface CustomMatchers<R = unknown> {
  anyMockFunction(): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  anyMockFunction(received) {
    const { isNot } = this;
    return {
      pass: vi.isMockFunction(received),
      message: () => `${received} is${isNot ? ' not' : ''} a Mock`,
    };
  },
});

describe('mockAll', () => {
  beforeEach(async () => {
    globalThis.browser = {
      electron: {
        execute: vi
          .fn()
          .mockReturnValue(
            'showOpenDialogSync,showOpenDialog,showSaveDialogSync,showSaveDialog,showMessageBoxSync,showMessageBox,showErrorBox,showCertificateTrustDialog',
          ),
      },
    } as unknown as WebdriverIO.Browser;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return mock functions for all API methods', async () => {
    const mockedDialog = await mockAll('dialog');
    expect(mockedDialog).toStrictEqual({
      showOpenDialogSync: expect.anyMockFunction(),
      showOpenDialog: expect.anyMockFunction(),
      showSaveDialogSync: expect.anyMockFunction(),
      showSaveDialog: expect.anyMockFunction(),
      showMessageBoxSync: expect.anyMockFunction(),
      showMessageBox: expect.anyMockFunction(),
      showErrorBox: expect.anyMockFunction(),
      showCertificateTrustDialog: expect.anyMockFunction(),
    });
  });
});