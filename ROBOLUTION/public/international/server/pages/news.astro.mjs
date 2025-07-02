/* empty css                                  */
import { e as createComponent, f as createAstro, r as renderTemplate, h as addAttribute, m as maybeRenderHead, k as renderComponent } from '../chunks/astro/server_BGP9d7Zh.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CFUiTUra.mjs';
import 'clsx';
import { g as getTemplate } from '../chunks/mongodb_DJrNPHw-.mjs';
/* empty css                                */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$Cardnav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Cardnav;
  const { image, title, date, description, subtitle } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '<div class="cursor-pointer hover:opacity-80 transition bg-white p-6 shadow-md rounded-lg" onclick="showCard(this)"> <img', "", ' class="w-full h-48 object-cover rounded-md mb-4"> <h2 class="text-2xl font-bold text-center">', '</h2> <h3 class="text-sm text-gray-500 mb-2">', '</h3> <p class="text-gray-700">', '</p> <h3 class="text-sm text-gray-500 mb-2">', '</h3> <template class="detail-template"> <div class="min-h-screen flex items-center justify-center p-8 bg-gray-100"> <article class="max-w-xl bg-white rounded-lg p-6 shadow-md text-center"> <img', "", ' class="w-full h-64 object-cover rounded-md mb-4"> <h1 class="text-3xl font-bold mb-2">', '</h1> <h2 class="text-lg text-gray-600 mb-4">', '</h2> <p class="text-gray-700 leading-relaxed">', '</p> <h2 class="text-lg text-gray-600 mb-4">', '</h2> </article> </div> </template> </div> <script>\n    function showCard(card) {\n        const tpl = card.querySelector(".detail-template");\n        if (!tpl) return;\n        document.body.innerHTML = tpl.innerHTML;\n    }\n<\/script>'])), maybeRenderHead(), addAttribute(image, "src"), addAttribute(title, "alt"), title, date, subtitle, description, addAttribute(image, "src"), addAttribute(title, "alt"), title, date, subtitle, description);
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Cardnav.astro", void 0);

const $$Astro = createAstro();
const $$News = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$News;
  const countrySiteHeader = Astro2.request.headers.get("x-country-site");
  const countrySite = countrySiteHeader ? JSON.parse(countrySiteHeader) : { slug: "default" };
  const template = await getTemplate(countrySite.slug);
  const content = template?.config?.Contents || {};
  const newsContent = content.News || {};
  const layoutContent = {
    nav: content.Navbar || {},
    footer: content.Footer || {},
    banner: content.Banner || {}
  };
  const Hero = newsContent?.Hero || {};
  const latestnews = newsContent?.["latest-news"] || [];
  const events = newsContent?.["latest-events"] || [];
  const web = newsContent?.["latest-webinar"] || [];
  const cards = newsContent?.["latest-cards"] || [];
  const getImageUrl = (imagePath) => {
    if (typeof imagePath !== "string") return "/images/placeholder.png";
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath.startsWith("/src/assets/")) {
      return imagePath;
    }
    if (imagePath.startsWith("/public/")) {
      return `/international${imagePath}`;
    }
    if (imagePath.startsWith("/images/")) {
      return imagePath;
    }
    return `/international/${imagePath}`;
  };
  const formatUrl = (url) => {
    if (typeof url !== "string" || url.trim() === "" || url.trim() === "#") {
      return "#";
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return url;
    }
    return `https://${url}`;
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika International - News", "content": layoutContent, "data-astro-cid-tpum64yd": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="news-hero" data-astro-cid-tpum64yd> <h1 class="news-hero-title" data-astro-cid-tpum64yd>${Hero?.title || "News"}</h1> </section> <div class="page-container" data-astro-cid-tpum64yd> <section class="latest-news-section" data-astro-cid-tpum64yd> <h2 class="section-title" data-astro-cid-tpum64yd>Latest News</h2> <div class="scalable-news-grid" data-astro-cid-tpum64yd> ${latestnews.length > 0 ? latestnews.map((newsItem) => renderTemplate`<div class="news-item-card" data-astro-cid-tpum64yd> <a${addAttribute(formatUrl(newsItem.NewsCard.link), "href")} data-astro-cid-tpum64yd> <img${addAttribute(getImageUrl(newsItem.NewsCard.image), "src")}${addAttribute(newsItem.NewsCard.alt, "alt")} data-astro-cid-tpum64yd> </a> <div class="news-item-card-content" data-astro-cid-tpum64yd> <p class="news-date" data-astro-cid-tpum64yd>${newsItem.NewsCard.date}</p> <h5 class="news-item-title" data-astro-cid-tpum64yd>${newsItem.NewsCard.description || newsItem.NewsCard.title}</h5> </div> </div>`) : renderTemplate`<p data-astro-cid-tpum64yd>No latest news available.</p>`} </div> </section> <section class="events-section" data-astro-cid-tpum64yd> <h2 class="section-title" data-astro-cid-tpum64yd>${events?.[0]?.NewsCard?.events || "Events"}</h2> <div class="events-grid" data-astro-cid-tpum64yd> ${events.length > 0 ? events.map((event) => renderTemplate`<div class="event-card" data-astro-cid-tpum64yd> <a${addAttribute(formatUrl(event.NewsCard.link), "href")} data-astro-cid-tpum64yd> <img${addAttribute(getImageUrl(event.NewsCard.image), "src")}${addAttribute(event.NewsCard.alt, "alt")} data-astro-cid-tpum64yd> </a> <div class="event-card-content" data-astro-cid-tpum64yd> <p class="news-date" data-astro-cid-tpum64yd>${event.NewsCard.date}</p> <h5 class="event-title" data-astro-cid-tpum64yd>${event.NewsCard.title}</h5> <p class="event-description" data-astro-cid-tpum64yd>${event.NewsCard.description}</p> </div> </div>`) : renderTemplate`<p data-astro-cid-tpum64yd>No events to display.</p>`} </div> </section> <section class="webinar-section" data-astro-cid-tpum64yd> <h2 class="section-title" data-astro-cid-tpum64yd>${web?.[0]?.NewsCard?.name || "Webinars"}</h2> <div class="webinar-grid" data-astro-cid-tpum64yd> ${web.length > 0 ? web.map((item) => renderTemplate`<a${addAttribute(formatUrl(item.NewsCard.link), "href")} class="webinar-card" data-astro-cid-tpum64yd> <img${addAttribute(getImageUrl(item.NewsCard.image), "src")}${addAttribute(item.NewsCard.alt, "alt")} data-astro-cid-tpum64yd> <div class="webinar-card-content" data-astro-cid-tpum64yd> <p class="news-date" data-astro-cid-tpum64yd>${item.NewsCard.date}</p> <h5 class="webinar-title" data-astro-cid-tpum64yd>${item.NewsCard.title}</h5> <p class="webinar-description" data-astro-cid-tpum64yd>${item.NewsCard.description}</p> </div> </a>`) : renderTemplate`<p data-astro-cid-tpum64yd>No webinars to display.</p>`} </div> </section> <section class="more-news-section" data-astro-cid-tpum64yd> <div class="cardnav-grid" data-astro-cid-tpum64yd> ${cards.length > 0 ? cards.map((card) => renderTemplate`${renderComponent($$result2, "Cardnav", $$Cardnav, { "image": getImageUrl(card.image), "icon": card.icon, "text": card.text, "source": card.source, "link": formatUrl(card.link), "date": card.date, "data-astro-cid-tpum64yd": true })}`) : renderTemplate`<p data-astro-cid-tpum64yd>No additional content available.</p>`} </div> </section> </div> ` })} `;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/News.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/News.astro";
const $$url = "/dubai/News";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$News,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
