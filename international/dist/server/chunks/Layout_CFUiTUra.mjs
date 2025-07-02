import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, l as renderScript, r as renderTemplate, k as renderComponent, aj as renderSlot, ak as renderHead, u as unescapeHTML } from './astro/server_BGP9d7Zh.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

function getPath(path) {
  if (!path) return "#";
  if (path.startsWith("http") || path.startsWith("//")) {
    return path;
  }
  return path;
}

function getImageUrl(path) {
    if (!path) {
        // Return a path to a placeholder image if the path is missing
        return '/images/placeholder.png'; 
    }
    if (path.startsWith('http') || path.startsWith('//')) {
        return path; // It's already a full URL
    }
    // For all other paths, just ensure they start with a single slash
    return path.startsWith('/') ? path : `/${path}`;
}

const $$Astro$3 = createAstro();
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Navbar;
  const { content = {} } = Astro2.props;
  const navData = content.Content || {};
  const { links = [], button = {} } = navData;
  const logoImage = button.image;
  const { cookies } = Astro2;
  cookies.has("robolution_session");
  return renderTemplate`${maybeRenderHead()}<nav class="absolute w-full bg-[#2F1573]/30 backdrop-blur-md z-50" data-astro-cid-5knycien> <div class="container mx-auto flex items-center justify-between py-3" data-astro-cid-5knycien> <!-- Logo --> <div class="flex items-center" data-astro-cid-5knycien> <a href="/home" class="flex items-center md:gap-x-3 ml-5" data-astro-cid-5knycien> <img${addAttribute(getImageUrl(logoImage), "src")} alt="Logo" class="navbar-logo" data-astro-cid-5knycien> </a> </div> <!-- Navigation Links --> <div class="flex items-center gap-x-6" data-astro-cid-5knycien> <ul class="hidden md:flex space-x-6 text-white font-medium items-center" data-astro-cid-5knycien> <li data-astro-cid-5knycien> <a href="/home" class="flex items-center text-yellow-300 hover:text-yellow-100 transition" data-astro-cid-5knycien> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-5knycien> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-astro-cid-5knycien></path> </svg> <span data-astro-cid-5knycien>Back to Main website</span> </a> </li> ${links.map((item) => renderTemplate`<li data-astro-cid-5knycien> <a${addAttribute(getPath(item.path), "href")} class=" hover:text-[#C084FC] transition" data-astro-cid-5knycien> ${item.name} </a> </li>`)} <!-- Country Switcher Dropdown --> <li data-astro-cid-5knycien> <div class="relative" id="country-switcher" data-astro-cid-5knycien> <button class="flex items-center hover:text-[#C084FC] transition" data-astro-cid-5knycien> <span data-astro-cid-5knycien>Countries</span> <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-5knycien><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-5knycien></path></svg> </button> <div id="country-dropdown-menu" class="absolute hidden bg-[#2F1573]/90 backdrop-blur-lg rounded-md shadow-lg mt-2 py-1 w-48 z-50 left-0" data-astro-cid-5knycien> <!-- Populated by JS --> </div> </div> </li> </ul> <!-- CTA Button and Profile Button --> <div class="flex items-center gap-4 mr-5" data-astro-cid-5knycien> <div class="flex sm:gap-4" data-astro-cid-5knycien> <a href="/profile" class="bg-blue-500 text-white text-center text-xs lg:text-lg font-medium rounded-full px-4 py-2 hover:bg-blue-600 shadow-2xl transition" id="profile-button" style="display: none;" data-astro-cid-5knycien>
Profile
</a> <a href="/login" class="bg-gray-200 text-gray-800 text-center text-xs lg:text-lg font-medium rounded-full px-4 py-2 hover:bg-gray-300 shadow-lg transition" id="login-button" style="display: none;" data-astro-cid-5knycien>
Login
</a> <a${addAttribute(getPath(button.buttonLink), "href")} class="bg-white text-blue-900 text-center text-xs lg:text-lg font-medium rounded-full px-4 py-2 hover:bg-indigo-400 hover:text-white shadow-2xl transition" data-astro-cid-5knycien> ${button.buttonText || "Register Now"} </a> </div> </div> <!-- Hamburger Icon (shown on small screens) --> <button class="md:hidden mr-5 text-white hover:scale-120" id="menu-toggle" data-astro-cid-5knycien> <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-5knycien> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-5knycien></path> </svg> </button> </div> <!-- Dropdown Menu (hidden by default, shown when menu is toggled) --> <div id="mobile-menu" class="fixed top-14 right-0 p-3 z-50 md:hidden hidden mt-5 text-center shadow-lg bg-[#2F1573]/60 backdrop-blur-md" data-astro-cid-5knycien> <ul class="space-y-2 text-white font-medium" data-astro-cid-5knycien> ${links.map((item) => renderTemplate`<li data-astro-cid-5knycien> <a${addAttribute(getPath(item.path), "href")} class="block hover:text-[#C084FC] hover:scale-120" data-astro-cid-5knycien> ${item.name} </a> </li>`)} <!-- Mobile Country Switcher --> <li class="relative" id="mobile-country-switcher" data-astro-cid-5knycien> <button class="w-full text-left flex justify-between items-center hover:text-[#C084FC]" data-astro-cid-5knycien> <span data-astro-cid-5knycien>Countries</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-5knycien><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-5knycien></path></svg> </button> <div id="mobile-country-dropdown-menu" class="hidden mt-2 space-y-2 pl-4" data-astro-cid-5knycien> <!-- Populated by JS --> </div> </li> <!-- Profile/Login Link for Mobile --> <li data-astro-cid-5knycien> <a href="/profile" class="block text-blue-300 hover:text-blue-100 hover:scale-120 font-bold" id="mobile-profile-link" style="display: none;" data-astro-cid-5knycien>
Profile
</a> </li> <li data-astro-cid-5knycien> <a href="/login" class="block text-gray-300 hover:text-white hover:scale-120 font-bold" id="mobile-login-link" style="display: none;" data-astro-cid-5knycien>
Login
</a> </li> <!-- Back to Main Site Link (Mobile) --> <li data-astro-cid-5knycien> <a href="/home" class="block text-yellow-300 hover:text-yellow-100 hover:scale-120 font-bold" data-astro-cid-5knycien>
← Back to Main Site
</a> </li> </ul> </div> </div> </nav> ${renderScript($$result, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/navbar.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/navbar.astro", void 0);

const $$Astro$2 = createAstro();
const $$Banner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Banner;
  const { content = {} } = Astro2.props;
  const { bannerContent = {} } = content;
  return renderTemplate`${bannerContent && bannerContent.message && renderTemplate`${maybeRenderHead()}<div class="relative w-auto min-h-[48px] flex flex-col md:flex-row items-center justify-center px-5 py-2 gap-2 md:gap-8 z-50"${addAttribute(`background-color: ${bannerContent.backgroundColor || "#4B0082"}`, "style")}><div class="w-full md:w-auto flex justify-center items-center px-2"><h2 class="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-white capitalize leading-[1.2] text-center">${bannerContent.message}</h2></div><div class="w-full md:w-auto flex justify-center items-center relative"><div class="absolute w-[149px] h-[36px] rounded-[42px]"${addAttribute(`background-color: ${bannerContent.buttonBackground || "#6441A5"}`, "style")}></div><a${addAttribute(bannerContent.buttonHref || "#", "href")} class="relative w-[120px] sm:w-[140px] h-[32px] sm:h-[36px] text-white text-[12px] sm:text-[13px] font-medium leading-[16px] flex items-center justify-center rounded-[42px] transition-colors hover:bg-[#0060CC]">${bannerContent.buttonText || "Register"}</a></div></div>`}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Banner.astro", void 0);

const $$Astro$1 = createAstro();
const $$Footer1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer1;
  const { content = {} } = Astro2.props;
  const { quickLinks = [], socialLinks = [] } = content;
  return renderTemplate`${maybeRenderHead()}<footer class="relative bg-[url(/src/assets/images/footer-images/Foots.png)] h-auto w-full bg-cover bg-no-repeat bg-center text-white bottom-0"> <div class="container mx-auto px-6 py-12"> <div class="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-6"> <!-- About Section --> <div class="w-full md:w-auto flex-1 max-w-md text-center md:text-left"> <img${addAttribute(getImageUrl(content.logo), "src")} alt="Logo" class="h-12 w-auto mb-4 mx-auto md:mx-0"> <p class="text-sm">${content.about || "Leading the way in robotics innovation."}</p> </div> <!-- Contact Information --> <div class="w-full md:w-auto flex-1 max-w-md text-center md:text-left"> <h2 class="text-xl font-bold pb-4">
Contact Information
</h2> <div class="flex flex-col gap-2"> <p class="flex items-center justify-center md:justify-start gap-2 text-sm"> <span>${content.address || "Dubai, UAE"}</span> </p> <p class="flex items-center justify-center md:justify-start gap-2 text-sm"> <span>${content.phone || "+971 123 4567"}</span> </p> <p class="flex items-center justify-center md:justify-start gap-2 text-sm"> <span>${content.email || "contact@robolution.com"}</span> </p> </div> </div> <!-- Navigation Links --> <div class="w-full md:w-auto flex-1 max-w-md"> <h2 class="text-xl font-bold pb-4 text-center">Quick Links</h2> <ul class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium"> ${quickLinks.map((link) => renderTemplate`<li${addAttribute(link.text, "key")}> <a${addAttribute(link.url, "href")} class="hover:text-gray-300 transition"> ${link.text} </a> </li>`)} </ul> </div> <!-- Social Media Links --> <div class="w-full md:w-auto flex-1 max-w-md text-center"> <h2 class="text-xl font-bold pb-4">Follow Us!</h2> <div class="flex justify-center items-center gap-4"> ${socialLinks.map((social) => renderTemplate`<a${addAttribute(social.url, "href")} class="hover:opacity-80 transition"${addAttribute(social.name, "key")}> <img${addAttribute(getImageUrl(social.icon), "src")}${addAttribute(social.name, "alt")} class="w-8 h-8"> </a>`)} </div> </div> </div> </div> </footer>`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Home/Footer1.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, content = {} } = Astro2.props;
  const { nav = {}, banner = {}, footer = {}, customStyles: pageCustomStyles = {} } = content;
  const defaultStyles = {
    primaryColor: "#00008b",
    secondaryColor: "#FFB366",
    accentColor: "#6AAAFF",
    backgroundColor: "#FFFFFF"
  };
  const customStyles = { ...defaultStyles, ...pageCustomStyles };
  const siteTitle = title || "Robolution International";
  const countryCssVars = Object.entries(customStyles).map(([key, value]) => `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`).join(";");
  const script = `
window.sitePath = {
  base: "${"/dubai"}",
  asset: (path) => "${"/dubai"}" + (path.startsWith('/') ? path.slice(1) : path),
  page: (path) => "${"/dubai"}" + (path.startsWith('/') ? path.slice(1) : path)
};
console.log("Site path utilities initialized with base: ${"/dubai"}");
`;
  const countryContextScript = `
document.addEventListener('DOMContentLoaded', function() {
  const styles = ${JSON.stringify(customStyles)};
  const styleElement = document.createElement('style');
  styleElement.textContent = \`
    :root {
      --primary-color: \${styles.primaryColor};
      --secondary-color: \${styles.secondaryColor};
      --accent-color: \${styles.accentColor};
      --background-color: \${styles.backgroundColor};
    }
  \`;
  document.head.appendChild(styleElement);
});
`;
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="dark" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><meta name="description"', "><title>", '</title><link href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css" rel="stylesheet"><script>', "</script><style>", "</style><script>", "</script>", "", '</head> <body data-astro-cid-sckkx6r4> <div id="banner" data-astro-cid-sckkx6r4> ', " </div> ", " ", " ", ' <script src="https://cdn.jsdelivr.net/npm/flowbite@3.0.0/dist/flowbite.min.js"></script> </body> </html>'])), addAttribute(Astro2.generator, "content"), addAttribute(nav?.Content?.description || `Robolution International Site`, "content"), siteTitle, unescapeHTML(script), unescapeHTML(`
          :root {
            ${countryCssVars}
          }
        `), unescapeHTML(countryContextScript), renderScript($$result, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent($$result, "Banner", $$Banner, { "content": banner, "data-astro-cid-sckkx6r4": true }), renderComponent($$result, "Nav", $$Navbar, { "content": nav, "data-astro-cid-sckkx6r4": true }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer1", $$Footer1, { "content": footer, "data-astro-cid-sckkx6r4": true }));
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/layouts/Layout.astro", void 0);

export { $$Layout as $, getImageUrl as g };
