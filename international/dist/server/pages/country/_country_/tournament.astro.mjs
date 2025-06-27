/* empty css                                        */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from '../../../chunks/astro/server_DhKVb5AT.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_Bie1TBNq.mjs';
import { g as getCountryContent, e as getCountryTournament } from '../../../chunks/db_BgTuE01l.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Tournament = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tournament;
  const { country } = Astro2.params;
  let countryData = null;
  if (Astro2.locals?.countryData) {
    countryData = Astro2.locals.countryData;
  } else {
    countryData = await getCountryContent(country);
  }
  const tournamentData = await getCountryTournament(country);
  const pageTitle = countryData ? `${countryData.name} - Tournament` : "Tournament";
  const tournamentTitle = tournamentData?.title || "Robotics Tournament";
  const tournamentDescription = tournamentData?.description || "Join us for an exciting robotics competition that challenges participants to showcase their skills and innovation.";
  const tournamentBanner = tournamentData?.bannerImage || "/international/tournament-banner.jpg";
  const tournamentVenue = tournamentData?.venue || "To be announced";
  const tournamentDate = tournamentData?.date ? new Date(tournamentData.date).toLocaleDateString() : "To be announced";
  const registrationLink = tournamentData?.registrationLink || "/registration";
  const primaryColor = countryData?.themeColors?.primary || "#003399";
  const accentColor = countryData?.themeColors?.accent || "#ff9900";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative"> <!-- Tournament Banner --> <div class="relative w-full h-[300px] md:h-[400px]"> <img${addAttribute(tournamentBanner, "src")}${addAttribute(`${tournamentTitle} Banner`, "alt")} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-black bg-opacity-60"></div> <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center"> <h1 class="text-4xl md:text-6xl font-bold mb-4">${tournamentTitle}</h1> <div class="flex items-center gap-4 text-lg"> <div class="flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> ${tournamentVenue} </div> <div class="flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> ${tournamentDate} </div> </div> </div> </div> <!-- Tournament Content --> <div class="container mx-auto py-12 px-4"> <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"> <div class="p-8"> <h2 class="text-3xl font-bold mb-6"${addAttribute(`color: ${primaryColor};`, "style")}>About the Tournament</h2> <div class="prose prose-lg max-w-none"> ${renderTemplate`<div class="mb-8">${unescapeHTML(tournamentDescription)}</div>`} </div> <div class="mt-8"> <a${addAttribute(registrationLink, "href")} class="inline-block px-8 py-3 text-xl font-semibold rounded-md text-white transition-all transform hover:scale-105"${addAttribute(`background-color: ${accentColor};`, "style")}>
Register Now
</a> </div> </div> </div> <!-- Tournament Timeline --> <div class="mt-16 max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-center"${addAttribute(`color: ${primaryColor};`, "style")}>Tournament Schedule</h2> <div class="space-y-8"> <div class="flex"> <div class="flex flex-col items-center mr-4"> <div class="w-10 h-10 rounded-full flex items-center justify-center"${addAttribute(`background-color: ${primaryColor}; color: white;`, "style")}>1</div> <div class="h-full w-0.5 bg-gray-300 mt-2"></div> </div> <div class="bg-white p-6 rounded-lg shadow-md flex-1"> <h3 class="text-xl font-bold mb-2">Registration Period</h3> <p class="text-gray-600 mb-2">July 15 - August 30, 2024</p> <p>Teams must complete registration and submit all required documentation.</p> </div> </div> <div class="flex"> <div class="flex flex-col items-center mr-4"> <div class="w-10 h-10 rounded-full flex items-center justify-center"${addAttribute(`background-color: ${primaryColor}; color: white;`, "style")}>2</div> <div class="h-full w-0.5 bg-gray-300 mt-2"></div> </div> <div class="bg-white p-6 rounded-lg shadow-md flex-1"> <h3 class="text-xl font-bold mb-2">Preliminary Round</h3> <p class="text-gray-600 mb-2">September 15, 2024</p> <p>Online qualification round to select finalists.</p> </div> </div> <div class="flex"> <div class="flex flex-col items-center mr-4"> <div class="w-10 h-10 rounded-full flex items-center justify-center"${addAttribute(`background-color: ${primaryColor}; color: white;`, "style")}>3</div> <div class="h-full w-0.5 bg-gray-300 mt-2"></div> </div> <div class="bg-white p-6 rounded-lg shadow-md flex-1"> <h3 class="text-xl font-bold mb-2">Final Competition</h3> <p class="text-gray-600 mb-2">October 10-12, 2024</p> <p>Live competition featuring the top teams from the preliminary round.</p> </div> </div> <div class="flex"> <div class="flex flex-col items-center mr-4"> <div class="w-10 h-10 rounded-full flex items-center justify-center"${addAttribute(`background-color: ${primaryColor}; color: white;`, "style")}>4</div> </div> <div class="bg-white p-6 rounded-lg shadow-md flex-1"> <h3 class="text-xl font-bold mb-2">Awards Ceremony</h3> <p class="text-gray-600 mb-2">October 12, 2024</p> <p>Recognition of winners and presentation of prizes.</p> </div> </div> </div> </div> </div> </div>  ${countryData?.customCSS && renderTemplate`<style>${unescapeHTML(countryData.customCSS)}</style>`}` })}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/country/[country]/tournament.astro", void 0);
const $$file = "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/country/[country]/tournament.astro";
const $$url = "/dubai/country/[country]/tournament";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tournament,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
