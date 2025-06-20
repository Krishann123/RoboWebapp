import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, l as renderScript, r as renderTemplate, k as renderComponent, n as renderSlot, o as renderHead, u as unescapeHTML } from './astro/server_C-kESatQ.mjs';
import 'kleur/colors';
import 'clsx';
import { f as fetchPageContent } from './db_Dri7-qrb.mjs';
/* empty css                          */

const $$Astro$1 = createAstro();
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  const data = await fetchPageContent("Navbar");
  const { links, button } = data.Content;
  const { image, buttonText, buttonLink } = button;
  const basePath = "/international";
  const { cookies } = Astro2;
  const isLoggedIn = cookies.has("robolution_session");
  function getPath(path) {
    if (path && (path.startsWith("http") || path.startsWith("//") || path === "/home")) {
      return path;
    }
    return basePath + (path.startsWith("/") ? path : `/${path}`);
  }
  return renderTemplate`${maybeRenderHead()}<nav class="absolute w-full bg-[#2F1573]/30 backdrop-blur-md z-50"> <div class="container mx-auto flex items-center justify-between py-3"> <!-- Logo --> <div class="flex items-center"> <!-- Logo Link - Now goes to Main Robolution Site --> <a href="/home" class="flex items-center md:gap-x-3 ml-5"> <img${addAttribute(image, "src")} alt="Logo" class="h-15 w-auto"> </a> </div> <!-- Navigation Links --> <div class="flex items-center gap-x-6"> <ul class="hidden md:flex space-x-6 text-white font-medium"> <!-- Home Link for International Webapp --> <li> <a${addAttribute(getPath("/home"), "href")} class="flex items-center text-yellow-300 hover:text-yellow-100 transition"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg> <span>Back to Main website</span> </a> </li> ${links.map(
    (item) => renderTemplate`<li> <a${addAttribute(getPath(item.path), "href")} class=" hover:text-[#C084FC] transition"> ${item.name} </a> </li>`
  )} </ul> <!-- CTA Button and Profile Button --> <div class="flex items-center gap-4 mr-5"> <div class="flex sm:gap-4"> ${isLoggedIn && renderTemplate`<a href="/profile" class="bg-blue-500 text-white text-center text-xs lg:text-lg font-medium rounded-full px-4 py-2 hover:bg-blue-600 shadow-2xl transition mr-2" id="profile-button">
Profile
</a>`} <a${addAttribute(getPath("/registration"), "href")} class="bg-white text-blue-900 text-center text-xs lg:text-lg font-medium rounded-full px-4 py-2 hover:bg-indigo-400 hover:text-white shadow-2xl transition">
Register Now
</a> </div> </div> <!-- Hamburger Icon (shown on small screens) --> <button class="md:hidden mr-5 text-white hover:scale-120" id="menu-toggle"> <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> <!-- Dropdown Menu (hidden by default, shown when menu is toggled) --> <div id="mobile-menu" class="fixed top-14 right-0 p-3 z-50 md:hidden hidden mt-5 text-center shadow-lg bg-[#2F1573]/60 backdrop-blur-md"> <ul class="space-y-2 text-white font-medium"> <!-- Dynamic page links --> ${links.map((item) => renderTemplate`<li> <a${addAttribute(getPath(item.path), "href")} class="block hover:text-[#C084FC] hover:scale-120"> ${item.name} </a> </li>`)} <!-- Profile Link for Mobile (when logged in) --> ${isLoggedIn && renderTemplate`<li> <a href="/profile" class="block text-blue-300 hover:text-blue-100 hover:scale-120 font-bold">
Profile
</a> </li>`} <!-- Back to Main Site Link (Mobile) --> <li> <a href="/home" class="block text-yellow-300 hover:text-yellow-100 hover:scale-120 font-bold">
← Back to Main Site
</a> </li> </ul> </div> </div> </nav> ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/navbar.astro", void 0);

const $$Banner = createComponent(async ($$result, $$props, $$slots) => {
  const content = await fetchPageContent("Banner");
  const bannerContent = content.bannerContent;
  return renderTemplate`${maybeRenderHead()}<div class="relative w-auto min-h-[48px] flex flex-col md:flex-row items-center justify-center px-5 py-2 gap-2 md:gap-8 z-50"${addAttribute(`background-color: ${bannerContent.backgroundColor}`, "style")}> <div class="w-full md:w-auto flex justify-center items-center px-2"> <h2 class="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-black capitalize leading-[1.2] text-center"> ${bannerContent.message} </h2> </div> <div class="w-full md:w-auto flex justify-center items-center relative"> <div class="absolute w-[149px] h-[36px] rounded-[42px]"${addAttribute(`background-color: ${bannerContent.buttonBackground}`, "style")}></div> <a${addAttribute(bannerContent.buttonHref, "href")} class="relative w-[120px] sm:w-[140px] h-[32px] sm:h-[36px] text-white text-[12px] sm:text-[13px] font-medium leading-[16px] flex items-center justify-center rounded-[42px] transition-colors hover:bg-[#0060CC]"> ${bannerContent.buttonText} </a> </div> </div>`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/Home/Banner.astro", void 0);

const $$Footer1 = createComponent(async ($$result, $$props, $$slots) => {
  const content = await fetchPageContent("Home");
  const footerContent = content.footerContent;
  const socials = [
    footerContent.social1,
    footerContent.social2,
    footerContent.social3
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="relative bg-[url(/src/assets/images/footer-images/Foots.png)] h-auto w-full bg-cover bg-no-repeat bg-center text-white bottom-0"> <div class="container mx-auto px-6 py-12"> <div class="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-6"> <!-- Contact Information --> <div class="w-full md:w-auto flex-1 max-w-md text-center md:text-left"> <h2 class="text-xl font-bold pb-4 md:pl-16">
Contact Information
</h2> <div class="flex flex-col md:flex-row items-center justify-center gap-4"> <div class="w-32 h-32 bg-cover bg-center"${addAttribute(`background-image: url('${footerContent.contact.qrCode}');`, "style")}></div> <div> <p class="flex items-center justify-center md:justify-start gap-2 text-sm"> <img src="/src/assets/images/footer-images/email.png" alt="Email" class="w-4 h-4"> <span>${footerContent.contact.email}</span> </p> <a${addAttribute(`mailto:${footerContent.contact.email}`, "href")} class="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
Contact Us!
</a> </div> </div> </div> <!-- Navigation Links --> <div class="w-full md:w-auto flex-1 max-w-md"> <ul class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium"> ${footerContent.links.map(
    (link) => renderTemplate`<li${addAttribute(link.name, "key")}> <a${addAttribute(link.href, "href")} class="hover:text-gray-300 transition"> ${link.name} </a> </li>`
  )} </ul> </div> <!-- Social Media Links --> <div class="w-full md:w-auto flex-1 max-w-md text-center"> <h2 class="text-xl font-bold pb-4 text-[30px]">Follow Us!</h2> <div class="flex justify-center items-center gap-4"> ${socials.map((socialObj) => {
    return renderTemplate`<a${addAttribute(socialObj["href"], "href")} class="hover:opacity-80 transition"${addAttribute(socialObj["name"], "key")}> <img${addAttribute(socialObj["icon"], "src")}${addAttribute(socialObj["name"], "alt")}${addAttribute(`w-${socialObj["size"]} h-${socialObj["size"]} md:w-8 md:h-8`, "class")}> </a>`;
  })} </div> </div> </div> </div> </footer>`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/Home/Footer1.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const basePath = "/international";
  const script = `
window.sitePath = {
  base: "${basePath}",
  asset: (path) => "${basePath}" + (path.startsWith('/') ? path : '/' + path),
  page: (path) => "${basePath}" + (path.startsWith('/') ? path : '/' + path)
};
console.log("Site path utilities initialized with base: ${basePath}");
`;
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="dark" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"', '><meta name="generator"', "><title>", '</title><link href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css" rel="stylesheet"><!-- Define global path helpers --><script>', "</script>", "", '</head> <body data-astro-cid-sckkx6r4> <div id="banner" data-astro-cid-sckkx6r4> ', " </div> ", " ", " <!-- <button onclick=`${connectDB}`>button </button> --> ", ' <script src="https://cdn.jsdelivr.net/npm/flowbite@3.0.0/dist/flowbite.min.js"></script> </body> </html>'], ['<html lang="en" class="dark" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"', '><meta name="generator"', "><title>", '</title><link href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css" rel="stylesheet"><!-- Define global path helpers --><script>', "</script>", "", '</head> <body data-astro-cid-sckkx6r4> <div id="banner" data-astro-cid-sckkx6r4> ', " </div> ", " ", " <!-- <button onclick=\\`\\${connectDB}\\`>button </button> --> ", ' <script src="https://cdn.jsdelivr.net/npm/flowbite@3.0.0/dist/flowbite.min.js"></script> </body> </html>'])), addAttribute(`${basePath}/favicon.svg`, "href"), addAttribute(Astro2.generator, "content"), title, unescapeHTML(script), renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent($$result, "Banner", $$Banner, { "data-astro-cid-sckkx6r4": true }), renderComponent($$result, "Nav", $$Navbar, { "data-astro-cid-sckkx6r4": true }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer1", $$Footer1, { "data-astro-cid-sckkx6r4": true }));
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
