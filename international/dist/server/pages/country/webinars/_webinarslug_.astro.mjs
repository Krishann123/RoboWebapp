/* empty css                                        */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_tTLm-7Qx.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$webinarSlug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$webinarSlug;
  const { countryData } = Astro2.locals;
  const { webinarSlug } = Astro2.params;
  if (!countryData) {
    return Astro2.redirect("/404");
  }
  const item = countryData.webinars.find((i) => i.slug === webinarSlug);
  if (!item) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${item.title} - ${countryData.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> <img${addAttribute(item.bannerImage, "src")}${addAttribute(item.title, "alt")}> <h1>${item.title}</h1> <p>${item.description}</p> <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p> <a${addAttribute(item.registrationLink, "href")}>Register</a> </div> ` })}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/webinars/[webinarSlug].astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/webinars/[webinarSlug].astro";
const $$url = "/dubai/country/webinars/[webinarSlug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$webinarSlug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
