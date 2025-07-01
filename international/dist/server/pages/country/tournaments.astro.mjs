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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Tournaments - ${countryData.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> <h1>Tournaments in ${countryData.name}</h1> <div class="tournament-list"> ${countryData.tournaments.map((tournament) => renderTemplate`<div class="tournament-card"> <h2><a${addAttribute(`/country/${countryData.slug}/tournaments/${tournament.slug}`, "href")}>${tournament.title}</a></h2> <p>${tournament.description}</p> <p><strong>Date:</strong> ${new Date(tournament.date).toLocaleDateString()}</p> <p><strong>Venue:</strong> ${tournament.venue}</p> </div>`)} </div> </div> ` })}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/tournaments/index.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/tournaments/index.astro";
const $$url = "/dubai/country/tournaments";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
