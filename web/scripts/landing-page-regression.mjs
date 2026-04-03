import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = '/Users/yzy/Downloads/code/api/web/src';

const appSource = readFileSync(resolve(root, 'App.jsx'), 'utf8');
const navigationSource = readFileSync(
  resolve(root, 'hooks/common/useNavigation.js'),
  'utf8',
);
const homeSource = readFileSync(resolve(root, 'pages/Home/index.jsx'), 'utf8');
const footerSource = readFileSync(
  resolve(root, 'components/layout/Footer.jsx'),
  'utf8',
);

assert.ok(
  !appSource.includes("const About = lazy(() => import('./pages/About'));"),
  'About page lazy import should be removed from App.jsx',
);

assert.ok(
  appSource.includes("path='/about'"),
  'About route should redirect to home in App.jsx',
);

assert.ok(
  appSource.includes("<Navigate to='/' replace />"),
  'About route should redirect back to the home page',
);

assert.ok(
  !navigationSource.includes("itemKey: 'docs'"),
  'Header navigation should not include a docs entry',
);

assert.ok(
  !navigationSource.includes("itemKey: 'about'"),
  'Header navigation should not include an about entry',
);

assert.ok(
  homeSource.includes('landing-shell'),
  'Home page should render the new landing-shell layout',
);

assert.ok(
  homeSource.includes('landing-hero-grid'),
  'Home page should render the new split hero layout',
);

assert.ok(
  homeSource.includes('landing-command-card'),
  'Home page should render the new base URL command card',
);

assert.ok(
  !footerSource.includes("{t('文档')}"),
  'Footer should not render a dedicated docs section heading',
);

assert.ok(
  !footerSource.includes("{t('关于我们')}"),
  'Footer should not render a dedicated about section heading',
);

console.log('landing-page-regression: ok');
