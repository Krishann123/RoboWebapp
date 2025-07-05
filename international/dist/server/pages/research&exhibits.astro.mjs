/* empty css                                  */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { g as getTemplate } from '../chunks/mongodb_DJrNPHw-.mjs';
import { $ as $$Layout, g as getImageUrl } from '../chunks/Layout_BrCK3NfS.mjs';
import { $ as $$Hero } from '../chunks/Hero_95mUN3k6.mjs';
/* empty css                                             */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ResearchExhibits = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ResearchExhibits;
  const countrySiteHeader = Astro2.request.headers.get("x-country-site");
  const countrySite = countrySiteHeader ? JSON.parse(countrySiteHeader) : { slug: "default" };
  const template = await getTemplate(countrySite.slug);
  const dbContent = template?.config?.Contents || {};
  const layoutContent = {
    nav: dbContent.Navbar || {},
    footer: dbContent.Footer || {},
    banner: dbContent.Banner || {}
  };
  const content = {
    Introduction: {
      title: "International Research & Exhibits",
      subtitle: "Explore our research and innovative exhibits in Robotics, Automation, and AI."
    },
    Content_1: {
      title: "Featured Research",
      subtitle: "Our platform showcases research from universities and institutions. Discover the latest advancements and connect with researchers pushing the boundaries of technology.",
      ImageDirectory: "/images/training/robot.png"
    },
    Content_2: {
      title: "Innovative Exhibits",
      subtitle: "See the latest products and solutions in action and network with industry leaders.",
      ImageDirectory: "/images/training/rob1.jpg"
    },
    Content_3: {
      title: "Call for Submissions",
      subtitle: "Share your findings with a global audience and contribute to the future of technology.",
      ImageDirectory: "/images/training/res.png"
    },
    Content_4: {
      minititle: "JOIN US NOW!",
      title: "Showcase Your Innovation",
      subtitle: "Ready to share your work with the world? Register to present your research",
      buttonText: "Register Now",
      buttonLink: "https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika International - Research & Exhibits", "content": layoutContent, "data-astro-cid-jmp65i5y": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "data-astro-cid-jmp65i5y": true })} ${maybeRenderHead()}<section class="introduction" id="introduction" data-astro-cid-jmp65i5y> <div class="introduction-content" data-astro-cid-jmp65i5y> <h1 class="tracking-wider intro-title" data-astro-cid-jmp65i5y>${unescapeHTML(content.Introduction.title)}</h1> <p class="intro-subtitle" data-astro-cid-jmp65i5y>${content.Introduction.subtitle}</p> </div> </section> <section class="content-1" data-astro-cid-jmp65i5y> <div class="content-1-container" data-astro-cid-jmp65i5y> <div class="content-1-text" data-astro-cid-jmp65i5y> <div class="content-1-title" data-astro-cid-jmp65i5y>${content.Content_1.title}</div> <p class="content-1-subtitle" data-astro-cid-jmp65i5y>${content.Content_1.subtitle}</p> </div> <div class="content-1-image" data-astro-cid-jmp65i5y> <img${addAttribute(getImageUrl(content.Content_1.ImageDirectory), "src")} alt="Featured Research" data-astro-cid-jmp65i5y> </div> </div> </section> <section class="content-2" data-astro-cid-jmp65i5y> <div class="content-2-container" data-astro-cid-jmp65i5y> <div class="content-2-image" data-astro-cid-jmp65i5y> <img${addAttribute(getImageUrl(content.Content_2.ImageDirectory), "src")} alt="Innovative Exhibits" data-astro-cid-jmp65i5y> </div> <div class="content-2-text" data-astro-cid-jmp65i5y> <div class="content-2-title" data-astro-cid-jmp65i5y>${content.Content_2.title}</div> <p class="content-2-subtitle" data-astro-cid-jmp65i5y>${content.Content_2.subtitle}</p> </div> </div> </section> <section class="content-3" data-astro-cid-jmp65i5y> <div class="content-3-container" data-astro-cid-jmp65i5y> <div class="content-3-text" data-astro-cid-jmp65i5y> <div class="content-3-title" data-astro-cid-jmp65i5y>${content.Content_3.title}</div> <p class="content-3-subtitle" data-astro-cid-jmp65i5y>${content.Content_3.subtitle}</p> </div> <div class="content-3-image" data-astro-cid-jmp65i5y> <img${addAttribute(getImageUrl(content.Content_3.ImageDirectory), "src")} alt="Call for Submissions" data-astro-cid-jmp65i5y> </div> </div> </section> <section class="content-4" data-astro-cid-jmp65i5y> <div class="content-4-container" data-astro-cid-jmp65i5y> <h5 class="content-4-minititle" data-astro-cid-jmp65i5y>${unescapeHTML(content.Content_4.minititle)}</h5> <h1 class="content-4-title tracking-wider" data-astro-cid-jmp65i5y>${unescapeHTML(content.Content_4.title)}</h1> <p class="content-4-subtitle" data-astro-cid-jmp65i5y>${content.Content_4.subtitle}</p> <a${addAttribute(content.Content_4.buttonLink, "href")} class="inline-block content-4-button" target="_blank" data-astro-cid-jmp65i5y> ${content.Content_4.buttonText} </a> </div> </section> ` })}  ${renderScript($$result, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/Research&Exhibits.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/Research&Exhibits.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/Research&Exhibits.astro";
const $$url = "/dubai/Research&Exhibits";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResearchExhibits,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
