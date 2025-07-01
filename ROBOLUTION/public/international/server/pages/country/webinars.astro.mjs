/* empty css                                     */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_6Vm7kAO5.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BALE1YAg.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { countryData } = Astro2.locals;
  if (!countryData) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Webinars - ${countryData.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> <h1>Webinars in ${countryData.name}</h1> <div class="list"> ${countryData.webinars.map((item) => renderTemplate`<div class="card"> <h2><a${addAttribute(`/country/${countryData.slug}/webinars/${item.slug}`, "href")}>${item.title}</a></h2> <p>Date: ${new Date(item.date).toLocaleDateString()}</p> </div>`)} </div> </div> ` })}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/webinars/index.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/webinars/index.astro";
const $$url = "/dubai/country/webinars";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
