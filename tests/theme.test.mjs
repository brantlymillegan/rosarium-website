import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../app/theme.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

function createBrowser({
  systemDark = false,
  saved = null,
  blockedStorage = false,
  initialDark = false,
  withMeta = true,
} = {}) {
  const classes = new Set(['existing-class', ...(initialDark ? ['dark'] : [])]);
  const root = {
    dataset: { unrelated: 'preserved' },
    style: {},
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
    },
  };
  const meta = { content: '#f6f4ef' };
  const metaWrites = [];
  const storageReads = [];
  const system = { dark: systemDark };
  const document = {
    documentElement: root,
    querySelector(selector) {
      assert.equal(selector, '#theme-color');
      return withMeta
        ? {
            setAttribute(name, value) {
              assert.equal(name, 'content');
              meta.content = value;
              metaWrites.push(value);
            },
          }
        : null;
    },
  };
  const matchMedia = (query) => {
    assert.equal(query, '(prefers-color-scheme: dark)');
    return { matches: system.dark };
  };
  const context = vm.createContext({
    exports: {},
    document,
    window: { matchMedia },
    matchMedia,
    localStorage: {
      getItem(key) {
        storageReads.push(key);
        if (blockedStorage) throw new Error('Storage is blocked');
        return saved;
      },
    },
  });
  vm.runInContext(compiled, context, { filename: 'theme.ts' });
  return {
    theme: context.exports,
    context,
    root,
    classes,
    meta,
    metaWrites,
    storageReads,
    system,
  };
}

function assertApplied(browser, preference, resolved) {
  assert.equal(browser.root.dataset.themePreference, preference);
  assert.equal(browser.root.dataset.theme, resolved);
  assert.equal(browser.root.style.colorScheme, resolved);
  assert.equal(browser.classes.has('dark'), resolved === 'dark');
  assert.equal(browser.classes.has('existing-class'), true);
  assert.equal(browser.root.dataset.unrelated, 'preserved');
}

test('normalization accepts explicit themes and defaults all other values to system', () => {
  const { theme } = createBrowser();
  assert.equal(theme.normalizeTheme('light'), 'light');
  assert.equal(theme.normalizeTheme('dark'), 'dark');
  for (const value of [undefined, null, '', 'system', 'auto', 'DARK', ' light ']) {
    assert.equal(theme.normalizeTheme(value), 'system', `value: ${String(value)}`);
  }
});

const resolutions = [
  ['system', false, 'light'],
  ['system', true, 'dark'],
  ['light', false, 'light'],
  ['light', true, 'light'],
  ['dark', false, 'dark'],
  ['dark', true, 'dark'],
];

for (const [preference, systemDark, resolved] of resolutions) {
  test(`${preference} resolves to ${resolved} on a ${systemDark ? 'dark' : 'light'} OS`, () => {
    const { theme } = createBrowser();
    assert.equal(theme.resolveTheme(preference, systemDark), resolved);
  });

  test(`document update applies ${preference} on a ${systemDark ? 'dark' : 'light'} OS`, () => {
    const browser = createBrowser({ systemDark, initialDark: resolved === 'light' });
    browser.theme.updateDocumentTheme(preference);
    assertApplied(browser, preference, resolved);
    assert.equal(browser.meta.content, resolved === 'dark' ? '#252a32' : '#f6f4ef');
    assert.equal(browser.metaWrites.length, 1);
  });
}

for (const saved of [null, 'system', '', 'invalid', 'DARK', 'light', 'dark']) {
  for (const systemDark of [false, true]) {
    test(`bootstrap handles saved ${JSON.stringify(saved)} on a ${systemDark ? 'dark' : 'light'} OS`, () => {
      const preference = saved === 'light' || saved === 'dark' ? saved : 'system';
      const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
      const browser = createBrowser({ saved, systemDark, initialDark: resolved === 'light' });
      vm.runInContext(browser.theme.themeInitializationScript, browser.context);
      assertApplied(browser, preference, resolved);
      assert.deepEqual(browser.storageReads, ['rosarium-theme']);
      // React owns this static meta until hydration. Mutating it in the bootstrap
      // makes React 19 append a second meta because hoisted matching uses content.
      assert.equal(browser.meta.content, '#f6f4ef');
      assert.deepEqual(browser.metaWrites, []);
    });
  }
}

for (const systemDark of [false, true]) {
  test(`blocked storage falls back to the ${systemDark ? 'dark' : 'light'} OS before hydration`, () => {
    const browser = createBrowser({ systemDark, blockedStorage: true, initialDark: !systemDark });
    assert.doesNotThrow(() => {
      vm.runInContext(browser.theme.themeInitializationScript, browser.context);
    });
    assertApplied(browser, 'system', systemDark ? 'dark' : 'light');
    assert.deepEqual(browser.metaWrites, []);

    browser.theme.updateDocumentTheme('dark');
    assertApplied(browser, 'dark', 'dark');
    assert.equal(browser.meta.content, '#252a32');
    browser.theme.updateDocumentTheme('light');
    assertApplied(browser, 'light', 'light');
    assert.equal(browser.meta.content, '#f6f4ef');
  });
}

test('reapplying system follows OS changes while explicit themes remain fixed', () => {
  const browser = createBrowser();
  browser.theme.updateDocumentTheme('system');
  assertApplied(browser, 'system', 'light');
  browser.system.dark = true;
  browser.theme.updateDocumentTheme('system');
  assertApplied(browser, 'system', 'dark');
  browser.theme.updateDocumentTheme('light');
  assertApplied(browser, 'light', 'light');
  browser.system.dark = false;
  browser.theme.updateDocumentTheme('dark');
  assertApplied(browser, 'dark', 'dark');
  browser.theme.updateDocumentTheme('system');
  assertApplied(browser, 'system', 'light');
});

test('document update tolerates an absent theme-color meta', () => {
  const browser = createBrowser({ withMeta: false });
  assert.doesNotThrow(() => browser.theme.updateDocumentTheme('dark'));
  assertApplied(browser, 'dark', 'dark');
});
