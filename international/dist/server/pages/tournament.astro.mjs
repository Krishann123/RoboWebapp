/* empty css                                  */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DhKVb5AT.mjs';
import 'kleur/colors';
import { g as getTemplate } from '../chunks/mongodb_DJrNPHw-.mjs';
import { $ as $$Layout, g as getImageUrl } from '../chunks/Layout_D6Llifn7.mjs';
/* empty css                                      */
import { $ as $$Hero } from '../chunks/Hero_o2faYtcU.mjs';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Tournament = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tournament;
  const countrySiteHeader = Astro2.request.headers.get("x-country-site");
  const countrySite = countrySiteHeader ? JSON.parse(countrySiteHeader) : { slug: "default" };
  const template = await getTemplate(countrySite.slug);
  const dbContent = template?.config?.Contents || {};
  const layoutContent = {
    nav: dbContent.Navbar || {},
    footer: dbContent.Footer || {},
    banner: dbContent.Banner || {}
  };
  const tournamentContent = {
    Overview: dbContent.Tournament?.Overview || {},
    categories: dbContent.Tournament?.categories || []
  };
  const participationContent = {
    title: "Who Can Participate?",
    teacher: {
      header: "Teachers & Professionals",
      subtext: "Educators from elementary to college across all disciplines, as well as industry practitioners, are encouraged to form teams representing their school or company. This is a unique opportunity for professional development and to guide the next generation of innovators.",
      image: "/images/tournaments/teachers.png"
    },
    student: {
      header: "Students",
      subtext: "High school and college students with a passion for technology are welcome. Team up with your peers to tackle challenges, showcase your innovative projects, and compete against the best from around the world.",
      image: "/images/tournaments/students.png"
    }
  };
  const competeContent = {
    header: "Ready to Compete?",
    subtext: "Join a global community of innovators and problem-solvers. Register your team today and be part of the robotics revolution!",
    buttonText: "Register Now",
    buttonLink: "/international/registration"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika International - Tournament", "content": layoutContent, "data-astro-cid-q3alncq5": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "data-astro-cid-q3alncq5": true })} ${maybeRenderHead()}<div class="overview" id="OverView" data-astro-cid-q3alncq5> <div data-astro-cid-q3alncq5> <h1 class="subhead" data-astro-cid-q3alncq5> ${tournamentContent.Overview.subheadings || "CATEGORIES"} </h1> <h1 class="head tracking-wider" data-astro-cid-q3alncq5> ${tournamentContent.Overview.Headings || "Explore Our Competitions"} </h1> <p class="info max-w-3xl mx-auto" data-astro-cid-q3alncq5>
Robolution features dynamic tracks designed to challenge participants in
                innovation, problem-solving, and technical expertise. Compete against
                global talents, collaborate with experts, and push the boundaries of
                technology in the following competitions.
</p> </div> <!-- PICTURE SECTION --> <div class="grid grid-cols-1 sm:grid-cols-2 place-items-center md:grid-cols-2 gap-8 mt-10" data-astro-cid-q3alncq5> ${tournamentContent.categories.map((category) => renderTemplate`<div class="text-center" data-astro-cid-q3alncq5> <a${addAttribute(category.id, "data-modal-target")} class="modal-trigger transition hover:scale-110 cursor-pointer block" data-astro-cid-q3alncq5> <img${addAttribute(getImageUrl(category.image), "src")}${addAttribute(category.title, "alt")} class="rounded-lg shadow-lg mx-auto" data-astro-cid-q3alncq5> <h3 class="text-2xl font-bold mt-4 font-bebas tracking-wide" data-astro-cid-q3alncq5> ${category.title} </h3> </a> </div>`)} </div> </div>  ${tournamentContent.categories.map((category) => renderTemplate`<div${addAttribute(category.id, "id")} class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 hidden p-4 modal-backdrop" data-astro-cid-q3alncq5> <div class="bg-white p-6 md:p-8 rounded-lg shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-astro-cid-q3alncq5> <button${addAttribute(category.id, "data-modal-close")} class="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-gray-800 transition" data-astro-cid-q3alncq5>&times;</button> <img${addAttribute(getImageUrl(category.image), "src")} class="w-full max-w-xs mx-auto rounded-lg mb-6"${addAttribute(category.title, "alt")} data-astro-cid-q3alncq5> <h2 class="text-3xl font-bold text-center mb-6 font-bebas tracking-wider" data-astro-cid-q3alncq5> ${category.title} </h2> <ul class="list-disc space-y-3 pl-5 text-gray-700" data-astro-cid-q3alncq5> ${category.mechanics.map((mechanic) => renderTemplate`<li class="text-justify" data-astro-cid-q3alncq5>${mechanic}</li>`)} </ul> </div> </div>`)} <div class="py-20" data-astro-cid-q3alncq5> <div class="h-fit p-4 justify-items-center" data-astro-cid-q3alncq5> <h1 class="font-bold text-center text-5xl lg:text-[96px] font-bebas tracking-wider text-black mt-10" data-astro-cid-q3alncq5> ${participationContent.title} </h1> </div> <!-- Teacher --> <div class="bg-white" data-astro-cid-q3alncq5> <div class="md:p-20 p-5" data-astro-cid-q3alncq5> <div class="grid md:grid-cols-2 grid-cols-1 place-items-center md:gap-10 gap-5 max-w-6xl mx-auto" data-astro-cid-q3alncq5> <img class="w-full h-auto shadow-md rounded-lg"${addAttribute(getImageUrl(participationContent.teacher.image), "src")} data-astro-cid-q3alncq5> <div class="self-center w-full" data-astro-cid-q3alncq5> <h2 class="md:text-5xl text-4xl mb-5 text-black text-center md:text-left bg-amber-200 w-fit rounded-md p-3 roboto-extra-bold" data-astro-cid-q3alncq5> ${participationContent.teacher.header} </h2> <p class="text-black inter md:pr-10 text-justify" data-astro-cid-q3alncq5> ${participationContent.teacher.subtext} </p> </div> </div> </div> </div> <!-- Student --> <div class="bg-[#f3f4f6]" data-astro-cid-q3alncq5> <div class="md:p-20 p-5" data-astro-cid-q3alncq5> <div class="grid md:grid-cols-2 grid-cols-1 place-items-center md:gap-10 gap-5 max-w-6xl mx-auto" data-astro-cid-q3alncq5> <div class="self-center w-full md:order-1 order-2" data-astro-cid-q3alncq5> <h2 class="md:text-5xl text-4xl mb-5 text-white text-center md:text-left bg-[#2562FF] w-fit rounded-md p-3 roboto-extra-bold" data-astro-cid-q3alncq5> ${participationContent.student.header} </h2> <p class="text-black inter md:pr-10 text-justify" data-astro-cid-q3alncq5> ${participationContent.student.subtext} </p> </div> <div class="md:order-2 order-1" data-astro-cid-q3alncq5> <img class="h-auto w-full shadow-md rounded-lg"${addAttribute(getImageUrl(participationContent.student.image), "src")} data-astro-cid-q3alncq5> </div> </div> </div> </div> </div>  <div class="place-items-center p-20 bg-white grid grid-cols-1" data-astro-cid-q3alncq5> <p class="my-4 text-5xl lg:text-[96px] text-center font-bebas font-bold text-black tracking-wider" data-astro-cid-q3alncq5> ${competeContent.header} </p> <p class="flex max-w-[700px] my-10 roboto text-center text-black text-lg" data-astro-cid-q3alncq5> ${competeContent.subtext} </p> <a class="text-center text-2xl roboto-bold inline-block rounded-full bg-gradient-to-r from-BlueStart via-purple-600 to-PinkEnd px-8 py-3 text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"${addAttribute(competeContent.buttonLink, "href")} data-astro-cid-q3alncq5> ${competeContent.buttonText} </a> </div> ${renderScript($$result2, "C:/Users/Leo Office PC/Desktop/RoboWebapp/international/src/pages/Tournament.astro?astro&type=script&index=0&lang.ts")} ` })}  ${renderScript($$result, "C:/Users/Leo Office PC/Desktop/RoboWebapp/international/src/pages/Tournament.astro?astro&type=script&index=1&lang.ts")}`;
}, "C:/Users/Leo Office PC/Desktop/RoboWebapp/international/src/pages/Tournament.astro", void 0);

const $$file = "C:/Users/Leo Office PC/Desktop/RoboWebapp/international/src/pages/Tournament.astro";
const $$url = "/dubai/Tournament";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Tournament,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
