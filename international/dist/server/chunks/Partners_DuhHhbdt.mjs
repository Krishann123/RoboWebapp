import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate, u as unescapeHTML } from './astro/server_BGP9d7Zh.mjs';
import 'kleur/colors';
import 'clsx';
import { f as fetchPageContent } from './db_BgTuE01l.mjs';
/* empty css                             */
import { g as getImageUrl } from './Layout_CFUiTUra.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { c as cn } from './utils_B05Dmz_H.mjs';

const $$Astro$3 = createAstro();
const $$Jumbotron = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Jumbotron;
  const { content = {}, welcomeMessage = "WELCOME TO EROVOUTIKA INTERNATIONAL", description = "Empowering the future through robotics education and innovation across the globe.", themeColors, customCSS } = Astro2.props;
  const mainText = content.mainText || welcomeMessage;
  const subText = content.subText || description;
  const buttonText = content.buttonText || "Explore Programs";
  const videoDirectory = content.videoDirectory;
  const useVideo = !!videoDirectory;
  const heroImage = content.heroImage || "/international/homepage.png";
  const primaryColor = themeColors?.primary || "#003399";
  const accentColor = themeColors?.accent || "#ff9900";
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`background-image: url("${!useVideo ? heroImage : ""}"); background-size: cover; background-repeat: no-repeat; background-position: center;`, "style")}${addAttribute(`flex justify-start items-center w-full bg-cover h-full bg-no-repeat bg-center p-[40px] relative`, "class")}> <!-- Overlay gradient --> <div class="absolute top-0 left-0 w-full h-full"${addAttribute(`background: linear-gradient(to top, rgba(0, 0, 0, 0.7), ${primaryColor}99 90%);`, "style")}></div> ${useVideo && renderTemplate`<div class="absolute top-0 left-0 w-full h-full -z-10"> <video autoplay muted loop playsinline class="absolute top-0 left-0 w-full h-full object-cover"> <source${addAttribute(videoDirectory, "src")} type="video/mp4">
Your browser does not support the video tag.
</video> </div>`} <div class="relative z-10 m-15 lg:m-40 flex flex-col lg:h-screen w-[400px] lg:w-full max-w-[784px] py-35 lg:py-56"> <div class="w-full h-auto"> <h1 id="mainText" class="mb-4 text-6xl leading-none text-white lg:text-[120px] font-bebas"> ${mainText} </h1> </div> <div class="w-full h-auto"> <p class="text-left mb-8 text-lg font-normal text-white lg:text-xl"> ${subText} </p> </div> <div class="flex items-center justify-start mt-8"> <a href="#packages" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-[#212529] rounded-full bg-white hover:scale-105 focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out"${addAttribute(`background-color: ${accentColor}; color: #fff;`, "style")}> ${buttonText} <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path> </svg> </a> </div> </div> </section> <!-- Apply any custom CSS from country settings --> ${customCSS && renderTemplate`<style>${unescapeHTML(customCSS)}</style>`}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Jumbotron.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Joinrobo = createComponent(async ($$result, $$props, $$slots) => {
  const content = await fetchPageContent("Home");
  const joinContent = content.joinContent;
  return renderTemplate(_a$2 || (_a$2 = __template$2(['<script type="module">\n    const observer = new IntersectionObserver(\n        (entries) => {\n            entries.forEach((entry) => {\n                if (entry.isIntersecting) {\n                    entry.target.classList.add("visible");\n                    observer.unobserve(entry.target);\n                }\n            });\n        },\n        { threshold: 0.2 }\n    );\n\n    document.addEventListener("DOMContentLoaded", () => {\n        document\n            .querySelectorAll(".joinrobo-animate")\n            .forEach((el) => observer.observe(el));\n    });\n<\/script><!-- Font style roboto link --><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">', '<div class="bg-[#F3F3F3] flex flex-col items-center justify-center min-h-[437px] px-10 py-20" data-astro-cid-gotf3znp> <section class="w-full max-w-[1280px] flex flex-col items-center gap-8 text-center joinrobo-animate" data-astro-cid-gotf3znp> <!-- Title --> <h2 class="text-5xl bg-dar p-2 font-bebas rounded-lg md:text-5xl lg:text-[96px] font-bold tracking-wider leading-tight text-[#212529]" data-astro-cid-gotf3znp> ', ' </h2> <!-- Body --> <p class="text-xs md:text-lg lg:text-xl max-w-[790px] leading-relaxed text-black-700 dark:text-black-100 font-[Roboto]" data-astro-cid-gotf3znp> ', ' </p> <!-- Button --> <div class="flex flex-row justify-center items-center gap-4 font-[Roboto]" data-astro-cid-gotf3znp> <a', ' target="_blank" class="flex flex-row justify-center items-center w-[247px] h-[64px] text-white bg-[#2562ff] border-2 border-[#1A5CB5] rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_15px_rgba(0,0,0,0.07)] transition-all duration-300 hover:scale-110 hover:border-[#2562ff] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_15px_rgba(0,0,0,0.07)]" data-astro-cid-gotf3znp> <span class="text-xl lg:text-[24px] font-bold tracking-wide" data-astro-cid-gotf3znp> ', " </span> </a> </div> </section> </div>"])), maybeRenderHead(), joinContent.title, joinContent.body, addAttribute(joinContent.buttonLink, "href"), joinContent.button);
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Joinrobo.astro", void 0);

const $$Astro$2 = createAstro();
const $$Package = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Package;
  const { content } = Astro2.props;
  const tourGallery = content?.TourGallery || [];
  return renderTemplate`${maybeRenderHead()}<section id="packages" class="align-center flex flex-col justify-center items-center w-full h-fit p-10 bg-[#F3F4F6]"> <h1 class="font-bold text-5xl lg:text-[96px] p-5 text-center font-bebas tracking-wider text-[#212529]">
Tour Gallery
</h1> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5 w-full max-w-7xl"> ${tourGallery.map((item) => renderTemplate`<div class="aspect-square"> <img${addAttribute(getImageUrl(item.image), "src")} alt="Tour Gallery Image" class="object-cover w-full h-full rounded-lg shadow-md"> </div>`)} </div> </section>`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Package.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro();
const $$Robolution = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Robolution;
  const { content = {} } = Astro2.props;
  const { title1 = {}, title2 = {} } = content;
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="module">\n    const observer = new IntersectionObserver(\n        (entries) => {\n            entries.forEach((entry) => {\n                if (entry.isIntersecting) {\n                    entry.target.classList.add("animate");\n                    observer.unobserve(entry.target);\n                }\n            });\n        },\n        { threshold: 0.2 }\n    );\n\n    document.addEventListener("DOMContentLoaded", () => {\n        document\n            .querySelectorAll(".slide-in-left, .slide-in-right")\n            .forEach((el) => {\n                observer.observe(el);\n            });\n    });\n<\/script>', '<div class="flex justify-center bg-white my-[54px]" data-astro-cid-nenqoatb> <div class="grid lg:grid-cols-1 gap-10 w-full min-w-fit max-w-[600px] p-5" data-astro-cid-nenqoatb> ', " ", " </div> </div>"])), maybeRenderHead(), title1 && title1.intro1 && renderTemplate`<div${addAttribute(`background-color: ${title1.containerColor1 || "#f5f5f5"}`, "style")} class="grid grid-cols-1 lg:grid-cols-2 items-center justify-center rounded-lg mx-auto gap-5 lg:gap-30 w-auto p-12 slide-in-left" data-astro-cid-nenqoatb> <div class="flex flex-wrap w-full max-w-[610px]" data-astro-cid-nenqoatb> <h3${addAttribute(`color: ${title1.textColor1 || "#000000"}`, "style")} class="text-5xl lg:text-[86px] font-bebas tracking-wider mb-4" data-astro-cid-nenqoatb>${unescapeHTML(title1.intro1)}</h3> <h4${addAttribute(`color: ${title1.textColor2 || "#666666"}`, "style")} class="text-xs lg:text-base mt-4" data-astro-cid-nenqoatb>${unescapeHTML(title1.sub1)}</h4> </div> <div class="place-items-center" data-astro-cid-nenqoatb> <img${addAttribute(getImageUrl(title1.image1), "src")} class="h-auto lg:h-[300px] w-full max-w-[540px] rounded-md opacity-80 shadow-md shadow-gray-200 object-cover img-hover-scale" data-astro-cid-nenqoatb> </div> </div>`, title2 && title2.intro2 && renderTemplate`<div${addAttribute(`background-color: ${title2.containerColor2 || "#e9e9e9"}`, "style")} class="grid grid-cols-1 lg:grid-cols-2 items-center justify-center rounded-lg mx-auto gap-5 lg:gap-30 w-auto p-12 slide-in-right" data-astro-cid-nenqoatb> <div class="place-items-center" data-astro-cid-nenqoatb> <img${addAttribute(getImageUrl(title2.image2), "src")} class="h-auto lg:h-[300px] w-auto rounded-md opacity-80 shadow-md shadow-gray-200 img-hover-scale" data-astro-cid-nenqoatb> </div> <div class="flex flex-wrap w-full max-w-[610px]" data-astro-cid-nenqoatb> <h3${addAttribute(`color: ${title2.textColor1 || "#000000"}`, "style")} class="text-5xl lg:text-[86px] font-bebas tracking-wider mb-4" data-astro-cid-nenqoatb>${unescapeHTML(title2.intro2)}</h3> <h4${addAttribute(`color: ${title2.textColor2 || "#666666"}`, "style")} class="text-xs lg:text-base mt-4" data-astro-cid-nenqoatb>${unescapeHTML(title2.sub2)}</h4> </div> </div>`);
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Robolution.astro", void 0);

function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$FrequentlyAsk = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FrequentlyAsk;
  const { content } = Astro2.props;
  const {
    background = "bg-gray-800",
    title = "Frequently Asked Questions",
    subtitle,
    items = []
  } = content || {};
  return renderTemplate(_a || (_a = __template(['<script type="module">\n    const observer = new IntersectionObserver(\n        (entries) => {\n            entries.forEach((entry) => {\n                if (entry.isIntersecting) {\n                    entry.target.classList.add("visible");\n                    observer.unobserve(entry.target);\n                }\n            });\n        },\n        { threshold: 0.2 }\n    );\n\n    document.addEventListener("DOMContentLoaded", () => {\n        document\n            .querySelectorAll(".faq-animate")\n            .forEach((el) => observer.observe(el));\n    });\n<\/script>', "<div", ' data-astro-cid-xdejtrk6> <div class="text-center mb-12" data-astro-cid-xdejtrk6> <h3 class="mb-4 text-5xl lg:text-[56px] font-bebas tracking-wider text-white" data-astro-cid-xdejtrk6> ', " </h3> ", ' </div> <div class="flex flex-col space-y-4 items-center max-w-4xl mx-auto" data-astro-cid-xdejtrk6> ', " </div> </div>"])), maybeRenderHead(), addAttribute(["p-10", background], "class:list"), title, subtitle && renderTemplate`<h5 class="text-white text-xs lg:text-base font-roboto" data-astro-cid-xdejtrk6> ${subtitle} </h5>`, items.map((faq) => renderTemplate`<details class="w-full group [&_summary::-webkit-details-marker]:hidden" data-astro-cid-xdejtrk6> <summary class="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900" data-astro-cid-xdejtrk6> <h2 class="font-medium text-left" data-astro-cid-xdejtrk6>${faq.question}</h2> <svg class="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-xdejtrk6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-xdejtrk6></path> </svg> </summary> <p class="mt-4 px-4 leading-relaxed text-gray-100 text-left" data-astro-cid-xdejtrk6> ${faq.answer} </p> </details>`));
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/FrequentlyAsk.astro", void 0);

function Partners({ partners }) {
  if (!partners || partners.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center bg-white py-12", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-5xl lg:text-[56px] font-bebas tracking-wider text-[#212529] font-bold pt-6", children: "Our International Partners" }),
    /* @__PURE__ */ jsx(Card, { className: "w-full bg-white border-none shadow-none py-0", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[16px] m-5", children: "We are proud to partner with:" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center flex-wrap justify-center p-1 gap-6", children: partners.map((partner) => /* @__PURE__ */ jsx("a", { href: partner.url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center w-20 h-20 lg:w-[200px] lg:h-[200px] transition-transform duration-300 hover:scale-105", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: partner.imageUrl,
          alt: partner.name,
          title: partner.name,
          className: "object-contain w-full h-full"
        }
      ) }, partner._id)) })
    ] }) })
  ] });
}

export { $$Jumbotron as $, Card as C, Partners as P, CardHeader as a, CardContent as b, $$Robolution as c, $$Package as d, $$Joinrobo as e, $$FrequentlyAsk as f };
