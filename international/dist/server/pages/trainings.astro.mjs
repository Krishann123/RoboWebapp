import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../chunks/astro/server_C-kESatQ.mjs';
import 'kleur/colors';
import { f as fetchPageContent } from '../chunks/db_BLiRlGFB.mjs';
import { $ as $$Layout } from '../chunks/Layout_hV_SdrMw.mjs';
import { $ as $$Hero } from '../chunks/Hero_CJJ83nJA.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Trainings = createComponent(async ($$result, $$props, $$slots) => {
  const content = await fetchPageContent("Trainings");
  console.log("Trainings content:", content);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika Dubai - Training", "data-astro-cid-dttg4kef": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "data-astro-cid-dttg4kef": true })} ${maybeRenderHead()}<section class="introduction" id="introduction" data-astro-cid-dttg4kef> <div class="introduction-content" data-astro-cid-dttg4kef> <h1 class="tracking-wider intro-title" data-astro-cid-dttg4kef>${unescapeHTML(content.Introduction.title)}</h1> <p class="intro-subtitle" data-astro-cid-dttg4kef>${content.Introduction.subtitle}</p> </div> </section> <section class="content-1" data-astro-cid-dttg4kef> <div class="content-1-container" data-astro-cid-dttg4kef> <div class="content-1-text" data-astro-cid-dttg4kef> <div class="content-1-title" data-astro-cid-dttg4kef>${content.Content_1.title}</div> <p class="content-1-subtitle" data-astro-cid-dttg4kef>${content.Content_1.subtitle}</p> </div> <div class="content-1-image" data-astro-cid-dttg4kef> <img${addAttribute(content.Content_1.ImageDirectory, "src")} alt="Robotics & Automation" data-astro-cid-dttg4kef> </div> </div> </section> <section class="content-2" data-astro-cid-dttg4kef> <div class="content-2-container" data-astro-cid-dttg4kef> <div class="content-2-image" data-astro-cid-dttg4kef> <img${addAttribute(content.Content_2.ImageDirectory, "src")} alt="Cybersecurity" data-astro-cid-dttg4kef> </div> <div class="content-2-text" data-astro-cid-dttg4kef> <div class="content-2-title" data-astro-cid-dttg4kef>${content.Content_2.title}</div> <p class="content-2-subtitle" data-astro-cid-dttg4kef>${content.Content_2.subtitle}</p> </div> </div> </section> <section class="content-3" data-astro-cid-dttg4kef> <div class="content-3-container" data-astro-cid-dttg4kef> <div class="content-3-text" data-astro-cid-dttg4kef> <div class="content-3-title" data-astro-cid-dttg4kef>${content.Content_3.title}</div> <p class="content-3-subtitle" data-astro-cid-dttg4kef>${content.Content_3.subtitle}</p> </div> <div class="content-3-image" data-astro-cid-dttg4kef> <img${addAttribute(content.Content_3.ImageDirectory, "src")} alt="Research & Development" data-astro-cid-dttg4kef> </div> </div> </section> <section class="content-4" data-astro-cid-dttg4kef> <div class="content-4-container" data-astro-cid-dttg4kef> <h5 class="content-4-minititle" data-astro-cid-dttg4kef>${unescapeHTML(content.Content_1.minititle)}</h5> <h1 class="content-4-title tracking-wider" data-astro-cid-dttg4kef>${unescapeHTML(content.Content_4.title)}</h1> <p class="content-4-subtitle" data-astro-cid-dttg4kef>${content.Content_4.subtitle}</p> <a${addAttribute(content.Content_4.buttonLink, "href")} class="inline-block content-4-button" target="_blank" data-astro-cid-dttg4kef> ${content.Content_4.buttonText} </a> </div> </section> ` })}  ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Trainings.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Trainings.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Trainings.astro";
const $$url = "/dubai/Trainings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Trainings,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
