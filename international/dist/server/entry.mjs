import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CcpIVUsQ.mjs';
import { manifest } from './manifest_DrQY-yxT.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/country-sites.astro.mjs');
const _page2 = () => import('./pages/admin/edit-country/_slug_.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/auth/forgot-password.astro.mjs');
const _page5 = () => import('./pages/api/auth/signin.astro.mjs');
const _page6 = () => import('./pages/api/auth/signout.astro.mjs');
const _page7 = () => import('./pages/api/countries.astro.mjs');
const _page8 = () => import('./pages/api/country-content.astro.mjs');
const _page9 = () => import('./pages/api/session-check.astro.mjs');
const _page10 = () => import('./pages/api/submit-registration.astro.mjs');
const _page11 = () => import('./pages/api/update-content.astro.mjs');
const _page12 = () => import('./pages/api/update-news.astro.mjs');
const _page13 = () => import('./pages/api/update-selected.astro.mjs');
const _page14 = () => import('./pages/awards.astro.mjs');
const _page15 = () => import('./pages/country/events/_eventslug_.astro.mjs');
const _page16 = () => import('./pages/country/events.astro.mjs');
const _page17 = () => import('./pages/country/news/_newsslug_.astro.mjs');
const _page18 = () => import('./pages/country/news.astro.mjs');
const _page19 = () => import('./pages/country/tournaments/_tournamentslug_.astro.mjs');
const _page20 = () => import('./pages/country/tournaments.astro.mjs');
const _page21 = () => import('./pages/country/webinars/_webinarslug_.astro.mjs');
const _page22 = () => import('./pages/country/webinars.astro.mjs');
const _page23 = () => import('./pages/country/_country_/tournament.astro.mjs');
const _page24 = () => import('./pages/country/_country_/trainings.astro.mjs');
const _page25 = () => import('./pages/country/_country_.astro.mjs');
const _page26 = () => import('./pages/login.astro.mjs');
const _page27 = () => import('./pages/news.astro.mjs');
const _page28 = () => import('./pages/nominations_tab.astro.mjs');
const _page29 = () => import('./pages/registration.astro.mjs');
const _page30 = () => import('./pages/registration-success.astro.mjs');
const _page31 = () => import('./pages/research&exhibits.astro.mjs');
const _page32 = () => import('./pages/tournament.astro.mjs');
const _page33 = () => import('./pages/trainings.astro.mjs');
const _page34 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin/country-sites.astro", _page1],
    ["src/pages/admin/edit-country/[slug].astro", _page2],
    ["src/pages/admin.astro", _page3],
    ["src/pages/api/auth/forgot-password.ts", _page4],
    ["src/pages/api/auth/signin.ts", _page5],
    ["src/pages/api/auth/signout.ts", _page6],
    ["src/pages/api/countries.js", _page7],
    ["src/pages/api/country-content.js", _page8],
    ["src/pages/api/session-check.ts", _page9],
    ["src/pages/api/submit-registration.js", _page10],
    ["src/pages/api/update-content.ts", _page11],
    ["src/pages/api/update-news.ts", _page12],
    ["src/pages/api/update-selected.ts", _page13],
    ["src/pages/Awards.astro", _page14],
    ["src/pages/country/events/[eventSlug].astro", _page15],
    ["src/pages/country/events/index.astro", _page16],
    ["src/pages/country/news/[newsSlug].astro", _page17],
    ["src/pages/country/news/index.astro", _page18],
    ["src/pages/country/tournaments/[tournamentSlug].astro", _page19],
    ["src/pages/country/tournaments/index.astro", _page20],
    ["src/pages/country/webinars/[webinarSlug].astro", _page21],
    ["src/pages/country/webinars/index.astro", _page22],
    ["src/pages/country/[country]/tournament.astro", _page23],
    ["src/pages/country/[country]/trainings.astro", _page24],
    ["src/pages/country/[country].astro", _page25],
    ["src/pages/login.astro", _page26],
    ["src/pages/News.astro", _page27],
    ["src/pages/Nominations_Tab.astro", _page28],
    ["src/pages/registration.astro", _page29],
    ["src/pages/registration-success.astro", _page30],
    ["src/pages/Research&Exhibits.astro", _page31],
    ["src/pages/Tournament.astro", _page32],
    ["src/pages/Trainings.astro", _page33],
    ["src/pages/index.astro", _page34]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/Krishann/Desktop/RoboWebapp/international/dist/client/",
    "server": "file:///C:/Users/Krishann/Desktop/RoboWebapp/international/dist/server/",
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
