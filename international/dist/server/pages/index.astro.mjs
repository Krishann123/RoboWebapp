/* empty css                                  */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_DhKVb5AT.mjs';
import 'kleur/colors';
import { g as getTemplate, a as getInternationalPartners } from '../chunks/mongodb_DJrNPHw-.mjs';
import { $ as $$Jumbotron, c as $$Robolution, d as $$Package, e as $$Joinrobo, f as $$FrequentlyAsk, P as Partners } from '../chunks/Partners_CbmM5Cai.mjs';
import { $ as $$Layout } from '../chunks/Layout_Bie1TBNq.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const countrySiteHeader = Astro2.request.headers.get("x-country-site");
  const countrySite = countrySiteHeader ? JSON.parse(countrySiteHeader) : { slug: "default" };
  const template = await getTemplate(countrySite.slug);
  const content = template?.config?.Contents || {};
  const internationalPartners = await getInternationalPartners();
  const homeContent = content.Home || {};
  const heroContent = homeContent.hero || {};
  const robolutionContent = homeContent.Robolution || {};
  content.Partners || {};
  const packageContent = content.Package || {};
  const joinContent = content.Join || {};
  content.News || {};
  const faqContent = content.FrequentlyAsk || {};
  const layoutContent = {
    nav: content.Navbar || {},
    footer: content.Footer || {},
    banner: content.Banner || {}
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika International", "content": layoutContent, "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Jumbotron", $$Jumbotron, { "content": heroContent, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Robolution", $$Robolution, { "content": robolutionContent, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Package", $$Package, { "content": packageContent, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Join", $$Joinrobo, { "content": joinContent, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "FrequentlyAsk", $$FrequentlyAsk, { "content": faqContent, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Partners", Partners, { "partners": internationalPartners, "data-astro-cid-j7pv25f6": true })} ` })} `;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/index.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/index.astro";
const $$url = "/dubai";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
