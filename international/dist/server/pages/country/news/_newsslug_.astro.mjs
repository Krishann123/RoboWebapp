/* empty css                                        */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from '../../../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_BrCK3NfS.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$newsSlug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$newsSlug;
  const { countryData } = Astro2.locals;
  const { newsSlug } = Astro2.params;
  if (!countryData) {
    return Astro2.redirect("/404");
  }
  const item = countryData.news.find((i) => i.slug === newsSlug);
  if (!item) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${item.title} - ${countryData.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> <img${addAttribute(item.imageUrl, "src")}${addAttribute(item.title, "alt")}> <h1>${item.title}</h1> <p><em>Published: ${new Date(item.publishedAt).toLocaleDateString()}</em></p> <div>${unescapeHTML(item.content)}</div> </div> ` })}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/news/[newsSlug].astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/news/[newsSlug].astro";
const $$url = "/dubai/country/news/[newsSlug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$newsSlug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
