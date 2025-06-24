import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_lxgTgEM0.mjs';
import { manifest } from './manifest_N7qsPnOg.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/auth/forgot-password.astro.mjs');
const _page3 = () => import('./pages/api/auth/signin.astro.mjs');
const _page4 = () => import('./pages/api/auth/signout.astro.mjs');
const _page5 = () => import('./pages/api/session-check.astro.mjs');
const _page6 = () => import('./pages/api/submit-registration.astro.mjs');
const _page7 = () => import('./pages/api/update-content.astro.mjs');
const _page8 = () => import('./pages/api/update-news.astro.mjs');
const _page9 = () => import('./pages/api/update-selected.astro.mjs');
const _page10 = () => import('./pages/awards.astro.mjs');
const _page11 = () => import('./pages/login.astro.mjs');
const _page12 = () => import('./pages/news.astro.mjs');
const _page13 = () => import('./pages/nominations_tab.astro.mjs');
const _page14 = () => import('./pages/registration.astro.mjs');
const _page15 = () => import('./pages/registration-success.astro.mjs');
const _page16 = () => import('./pages/tournament.astro.mjs');
const _page17 = () => import('./pages/trainings.astro.mjs');
const _page18 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/auth/forgot-password.ts", _page2],
    ["src/pages/api/auth/signin.ts", _page3],
    ["src/pages/api/auth/signout.ts", _page4],
    ["src/pages/api/session-check.ts", _page5],
    ["src/pages/api/submit-registration.js", _page6],
    ["src/pages/api/update-content.ts", _page7],
    ["src/pages/api/update-news.ts", _page8],
    ["src/pages/api/update-selected.ts", _page9],
    ["src/pages/Awards.astro", _page10],
    ["src/pages/login.astro", _page11],
    ["src/pages/News.astro", _page12],
    ["src/pages/Nominations_Tab.astro", _page13],
    ["src/pages/registration.astro", _page14],
    ["src/pages/registration-success.astro", _page15],
    ["src/pages/Tournament.astro", _page16],
    ["src/pages/Trainings.astro", _page17],
    ["src/pages/index.astro", _page18]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/Krishann/Desktop/Robo-combined/international/dist/client/",
    "server": "file:///C:/Users/Krishann/Desktop/Robo-combined/international/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
