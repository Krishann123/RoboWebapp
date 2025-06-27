/* empty css                                  */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../chunks/astro/server_DhKVb5AT.mjs';
import 'kleur/colors';
import { g as getTemplate } from '../chunks/mongodb_DJrNPHw-.mjs';
import { $ as $$Layout, g as getImageUrl } from '../chunks/Layout_Bie1TBNq.mjs';
import { $ as $$Hero } from '../chunks/Hero_CuViajAH.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Trainings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Trainings;
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
      title: "International Training Program",
      subtitle: "Enhance your skills with our comprehensive training programs in Robotics, Automation, and Cybersecurity, designed for global participants."
    },
    Content_1: {
      title: "Robotics & Automation",
      subtitle: "Our Robotics and Automation training provides hands-on experience with the latest technologies, from industrial robots to autonomous systems. Learn to design, build, and program robots for various applications.",
      ImageDirectory: "/images/training/robotics.png"
    },
    Content_2: {
      title: "Cybersecurity",
      subtitle: "In our Cybersecurity track, you'll dive into network security, ethical hacking, and threat analysis. Gain the skills to protect digital assets and infrastructure from cyber threats.",
      ImageDirectory: "/images/training/cybersecurity.png"
    },
    Content_3: {
      title: "Research & Development",
      subtitle: "Join our R&D training to work on cutting-edge projects. This program focuses on innovation, problem-solving, and contributing to new advancements in technology.",
      ImageDirectory: "/images/training/research.png"
    },
    Content_4: {
      title: "Register for Training",
      subtitle: "Ready to advance your career? Enroll in our international training programs and become an expert in your field.",
      buttonText: "Register Now",
      buttonLink: "/international/registration"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika International - Training", "content": layoutContent, "data-astro-cid-dttg4kef": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "data-astro-cid-dttg4kef": true })} ${maybeRenderHead()}<section class="introduction" id="introduction" data-astro-cid-dttg4kef> <div class="introduction-content" data-astro-cid-dttg4kef> <h1 class="tracking-wider intro-title" data-astro-cid-dttg4kef>${unescapeHTML(content.Introduction.title)}</h1> <p class="intro-subtitle" data-astro-cid-dttg4kef>${content.Introduction.subtitle}</p> </div> </section> <section class="content-1" data-astro-cid-dttg4kef> <div class="content-1-container" data-astro-cid-dttg4kef> <div class="content-1-text" data-astro-cid-dttg4kef> <div class="content-1-title" data-astro-cid-dttg4kef>${content.Content_1.title}</div> <p class="content-1-subtitle" data-astro-cid-dttg4kef>${content.Content_1.subtitle}</p> </div> <div class="content-1-image" data-astro-cid-dttg4kef> <img${addAttribute(getImageUrl(content.Content_1.ImageDirectory), "src")} alt="Robotics & Automation" data-astro-cid-dttg4kef> </div> </div> </section> <section class="content-2" data-astro-cid-dttg4kef> <div class="content-2-container" data-astro-cid-dttg4kef> <div class="content-2-image" data-astro-cid-dttg4kef> <img${addAttribute(getImageUrl(content.Content_2.ImageDirectory), "src")} alt="Cybersecurity" data-astro-cid-dttg4kef> </div> <div class="content-2-text" data-astro-cid-dttg4kef> <div class="content-2-title" data-astro-cid-dttg4kef>${content.Content_2.title}</div> <p class="content-2-subtitle" data-astro-cid-dttg4kef>${content.Content_2.subtitle}</p> </div> </div> </section> <section class="content-3" data-astro-cid-dttg4kef> <div class="content-3-container" data-astro-cid-dttg4kef> <div class="content-3-text" data-astro-cid-dttg4kef> <div class="content-3-title" data-astro-cid-dttg4kef>${content.Content_3.title}</div> <p class="content-3-subtitle" data-astro-cid-dttg4kef>${content.Content_3.subtitle}</p> </div> <div class="content-3-image" data-astro-cid-dttg4kef> <img${addAttribute(getImageUrl(content.Content_3.ImageDirectory), "src")} alt="Research & Development" data-astro-cid-dttg4kef> </div> </div> </section> <section class="content-4" data-astro-cid-dttg4kef> <div class="content-4-container" data-astro-cid-dttg4kef> <h5 class="content-4-minititle" data-astro-cid-dttg4kef>${unescapeHTML(content.Content_1.minititle)}</h5> <h1 class="content-4-title tracking-wider" data-astro-cid-dttg4kef>${unescapeHTML(content.Content_4.title)}</h1> <p class="content-4-subtitle" data-astro-cid-dttg4kef>${content.Content_4.subtitle}</p> <a${addAttribute(content.Content_4.buttonLink, "href")} class="inline-block content-4-button" target="_blank" data-astro-cid-dttg4kef> ${content.Content_4.buttonText} </a> </div> </section> ` })}  ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Trainings.astro?astro&type=script&index=0&lang.ts")}`;
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
