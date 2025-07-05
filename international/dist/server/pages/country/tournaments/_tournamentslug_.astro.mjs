/* empty css                                        */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_BrCK3NfS.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$tournamentSlug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tournamentSlug;
  const { countryData } = Astro2.locals;
  const { tournamentSlug } = Astro2.params;
  if (!countryData) {
    return Astro2.redirect("/404");
  }
  const tournament = countryData.tournaments.find((t) => t.slug === tournamentSlug);
  if (!tournament) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${tournament.title} - ${countryData.name}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> <img${addAttribute(tournament.bannerImage, "src")}${addAttribute(tournament.title, "alt")} class="banner-image"> <h1>${tournament.title}</h1> <p>${tournament.description}</p> <ul> <li><strong>Date:</strong> ${new Date(tournament.date).toLocaleDateString()}</li> <li><strong>Venue:</strong> ${tournament.venue}</li> </ul> <a${addAttribute(tournament.registrationLink, "href")} class="btn btn-primary">Register Now</a> </div> ` })}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/tournaments/[tournamentSlug].astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/tournaments/[tournamentSlug].astro";
const $$url = "/dubai/country/tournaments/[tournamentSlug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tournamentSlug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
