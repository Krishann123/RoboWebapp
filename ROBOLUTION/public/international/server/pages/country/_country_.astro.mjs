/* empty css                                     */
import { e as createComponent, r as renderTemplate, k as renderComponent, u as unescapeHTML, m as maybeRenderHead, h as addAttribute, f as createAstro, n as defineScriptVars } from '../../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { C as Card, a as CardHeader, b as CardContent, $ as $$Jumbotron, c as $$Robolution, d as $$Package, e as $$Joinrobo, f as $$FrequentlyAsk, P as Partners } from '../../chunks/Partners_Dfj-qCC6.mjs';
import { $ as $$Layout } from '../../chunks/Layout_BrCK3NfS.mjs';
import { f as fetchPageContent } from '../../chunks/db_BgTuE01l.mjs';
/* empty css                                        */
import 'clsx';
export { renderers } from '../../renderers.mjs';

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Highlights = createComponent(async ($$result, $$props, $$slots) => {
  const content = await fetchPageContent("Home");
  return renderTemplate(_a$2 || (_a$2 = __template$2(['<script type="module">\n    const observer = new IntersectionObserver(\n        (entries) => {\n            entries.forEach((entry) => {\n                if (entry.isIntersecting) {\n                    entry.target.classList.add("visible");\n                    observer.unobserve(entry.target);\n                }\n            });\n        },\n        { threshold: 0.2 }\n    );\n\n    document.addEventListener("DOMContentLoaded", () => {\n        document\n            .querySelectorAll(".highlight-animate")\n            .forEach((el) => observer.observe(el));\n    });\n<\/script>', '<div data-astro-cid-ls6zg3pq> <h2 class="font-bold text-center m-5 text-5xl lg:text-[96px] p-5 text-[#212529] font-bebas tracking-wider" data-astro-cid-ls6zg3pq>', '</h2> <div class="grid md:grid-cols-5 grid-cols-1 gap-4 p-5 lg:px-20" data-astro-cid-ls6zg3pq> ', " ", " ", " ", " ", " </div> </div>"])), maybeRenderHead(), unescapeHTML(content.Highlights.Title), renderComponent($$result, "Card", Card, { "className": "border-transparent bg-transparent shadow-none py-2 lg:py-6 gap-2 lg:gap-6 highlight-animate", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "className": "place-items-center", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <img${addAttribute(content.Highlights.Highlight1.Icon1, "src")} class="h-14 w-auto" data-astro-cid-ls6zg3pq> ` })} ${renderComponent($$result2, "CardContent", CardContent, { "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <h2 class="font-semibold text-lg text-center mb-2 text-black" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight1.Highlight1)}</h2> <h4 class="text-center text-xs lg:text-base text-zinc-800" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight1.description1)}</h4> ` })} ` }), renderComponent($$result, "Card", Card, { "className": "border-transparent bg-transparent shadow-none py-2 lg:py-6 gap-2 lg:gap-6 highlight-animate", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "className": "place-items-center", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <img${addAttribute(content.Highlights.Highlight2.Icon2, "src")} class="h-14 w-auto" data-astro-cid-ls6zg3pq> ` })} ${renderComponent($$result2, "CardContent", CardContent, { "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <h2 class="font-semibold text-lg text-center mb-2 text-black" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight2.Highlight2)}</h2> <h4 class="text-center text-xs lg:text-base text-zinc-800" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight2.description2)}</h4> ` })} ` }), renderComponent($$result, "Card", Card, { "className": "border-transparent bg-transparent shadow-none py-2 lg:py-6 gap-2 lg:gap-6 highlight-animate", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "className": "place-items-center", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <img${addAttribute(content.Highlights.Highlight3.Icon3, "src")} class="h-14 w-auto" data-astro-cid-ls6zg3pq> ` })} ${renderComponent($$result2, "CardContent", CardContent, { "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <h2 class="font-semibold text-lg text-center mb-2 text-black" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight3.Highlight3)}</h2> <h4 class="text-center text-xs lg:text-base text-zinc-800" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight3.description3)}</h4> ` })} ` }), renderComponent($$result, "Card", Card, { "className": "border-transparent bg-transparent shadow-none py-2 lg:py-6 gap-2 lg:gap-6 highlight-animate", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "className": "place-items-center", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <img${addAttribute(content.Highlights.Highlight4.Icon4, "src")} class="h-14 w-auto" data-astro-cid-ls6zg3pq> ` })} ${renderComponent($$result2, "CardContent", CardContent, { "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <h2 class="font-semibold text-lg text-center mb-2 text-black" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight4.Highlight4)}</h2> <h4 class="text-center text-xs lg:text-base text-zinc-800" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight4.description4)}</h4> ` })} ` }), renderComponent($$result, "Card", Card, { "className": "border-transparent bg-transparent shadow-none py-2 lg:py-6 gap-2 lg:gap-6 highlight-animate", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "className": "place-items-center ", "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <img${addAttribute(content.Highlights.Highlight5.Icon5, "src")} class="h-14 w-auto" data-astro-cid-ls6zg3pq> ` })} ${renderComponent($$result2, "CardContent", CardContent, { "data-astro-cid-ls6zg3pq": true }, { "default": async ($$result3) => renderTemplate` <h2 class="font-semibold text-lg text-center mb-2 text-black" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight5.Highlight5)}</h2> <h4 class="text-center text-xs lg:text-base text-zinc-800" data-astro-cid-ls6zg3pq>${unescapeHTML(content.Highlights.Highlight5.description5)}</h4> ` })} ` }));
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Highlights.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro();
const $$NewsAndUpdate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$NewsAndUpdate;
  const { news, countrySlug } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="module">\n    const observer = new IntersectionObserver(\n        (entries) => {\n            entries.forEach((entry) => {\n                if (entry.isIntersecting) {\n                    entry.target.classList.add("visible");\n                    observer.unobserve(entry.target);\n                }\n            });\n        },\n        { threshold: 0.2 }\n    );\n\n    document.addEventListener("DOMContentLoaded", () => {\n        document\n            .querySelectorAll(".news-animate")\n            .forEach((el) => observer.observe(el));\n    });\n<\/script>', '<section class="bg-white p-5 md:px-16 lg:px-24" data-astro-cid-2nn7o3ze> <div class="text-center mb-5" data-astro-cid-2nn7o3ze> <h2 class="font-bold text-[#212529] text-5xl lg:text-[56px] font-bebas tracking-wider" data-astro-cid-2nn7o3ze>\nNews & Updates\n</h2> <a', ' class="text-[clamp(1rem,2vw,1.125rem)] text-blue-600 hover:underline mt-2 inline-block" data-astro-cid-2nn7o3ze>\nView all news\n</a> </div> <div class="mx-auto px-5 py-5" data-astro-cid-2nn7o3ze> <div class="flex flex-wrap lg:flex-row justify-center items-stretch gap-10" data-astro-cid-2nn7o3ze> ', " </div> </div> </section>"])), maybeRenderHead(), addAttribute(`/country/${countrySlug}/news`, "href"), news && news.slice(0, 3).map((article) => renderTemplate`<a${addAttribute(`/country/${countrySlug}/news/${article.slug}`, "href")} class="w-[90vw] h-auto sm:max-w-[400px] md:w-[350px] news-animate" data-astro-cid-2nn7o3ze> <div class="bg-white w-full lg:w-full h-fit lg:h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow hover:scale-[1.02] duration-200 flex flex-col min-h-[400px] sm:min-h-[420px] md:min-h-[450px]" data-astro-cid-2nn7o3ze> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.title, "alt")} class="w-full h-60 object-cover" data-astro-cid-2nn7o3ze> <div class="p-4 sm:p-5 md:p-6 flex flex-col flex-1" data-astro-cid-2nn7o3ze> <p class="text-xs sm:text-sm md:text-base text-gray-500 mb-1" data-astro-cid-2nn7o3ze> ${new Date(article.publishedAt).toLocaleDateString()} </p> <h3 class="font-semibold text-gray-900 mb-4 text-sm sm:text-base md:text-lg" data-astro-cid-2nn7o3ze> ${article.title} </h3> <p class="text-sm sm:text-base md:text-[1rem] text-gray-700 flex-1" data-astro-cid-2nn7o3ze> ${article.content.substring(0, 100)}...
</p> </div> </div> </a>`));
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/NewsAndUpdate.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$country = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$country;
  const { countryData } = Astro2.locals;
  if (!countryData) {
    return Astro2.redirect("/404");
  }
  if (countryData) {
    Astro2.response.headers.set("x-country-site", JSON.stringify({
      name: countryData.name,
      slug: countryData.slug,
      templateIndex: countryData.templateIndex
    }));
  }
  const pageTitle = `${countryData.name} - Robolution`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "data-astro-cid-ap33po33": true }, { "default": ($$result2) => renderTemplate`  ${countryData && renderTemplate(_a || (_a = __template(["<script>(function(){", "\n            window.countryInfo = countryInfo;\n        })();<\/script>"])), defineScriptVars({ countryInfo: {
    name: countryData.name,
    slug: countryData.slug,
    templateIndex: countryData.templateIndex
  } }))}${renderComponent($$result2, "Jumbotron", $$Jumbotron, { "welcomeMessage": countryData.welcomeMessage, "heroImage": countryData.heroImage, "homeContent": countryData.homeContent, "themeColors": countryData.themeColors, "customCSS": countryData.customCSS, "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "Robolution", $$Robolution, { "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "Package", $$Package, { "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "Highlights", $$Highlights, { "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "Join", $$Joinrobo, { "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "NewsAndUpdate", $$NewsAndUpdate, { "countrySlug": countryData.slug, "news": countryData.news, "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "FrequentlyAsk", $$FrequentlyAsk, { "data-astro-cid-ap33po33": true })} ${renderComponent($$result2, "Partners", Partners, { "data-astro-cid-ap33po33": true })} ` })} `;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/[country].astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/[country].astro";
const $$url = "/dubai/country/[country]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$country,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
