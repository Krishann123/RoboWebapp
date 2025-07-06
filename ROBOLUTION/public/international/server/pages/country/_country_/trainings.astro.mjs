/* empty css                                        */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from '../../../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_tTLm-7Qx.mjs';
import { g as getCountryContent, h as getCountryTraining } from '../../../chunks/db_BgTuE01l.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Trainings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Trainings;
  const { country } = Astro2.params;
  let countryData = null;
  if (Astro2.locals?.countryData) {
    countryData = Astro2.locals.countryData;
  } else {
    countryData = await getCountryContent(country);
  }
  const trainingData = await getCountryTraining(country);
  const pageTitle = countryData ? `${countryData.name} - Trainings` : "Trainings";
  const trainingTitle = trainingData?.title || "Robotics Training Programs";
  const trainingDescription = trainingData?.description || "Discover our comprehensive robotics training programs designed to build skills and knowledge at all levels.";
  const trainingBanner = trainingData?.bannerImage || "/international/training-banner.jpg";
  const schedules = trainingData?.schedule || [];
  const primaryColor = countryData?.themeColors?.primary || "#003399";
  const accentColor = countryData?.themeColors?.accent || "#ff9900";
  const sampleCourses = [
    {
      title: "Introduction to Robotics",
      duration: "4 weeks",
      level: "Beginner",
      description: "Learn the fundamentals of robotics including basic mechanics, electronics, and programming concepts.",
      image: "/international/intro-robotics.jpg"
    },
    {
      title: "Robot Programming with Python",
      duration: "6 weeks",
      level: "Intermediate",
      description: "Develop skills in programming robots using Python with hands-on projects and real-world applications.",
      image: "/international/python-robotics.jpg"
    },
    {
      title: "Advanced Robotics Engineering",
      duration: "8 weeks",
      level: "Advanced",
      description: "Deep dive into complex robotics systems, AI integration, and autonomous robot design.",
      image: "/international/advanced-robotics.jpg"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative"> <!-- Training Banner --> <div class="relative w-full h-[300px] md:h-[400px]"> <img${addAttribute(trainingBanner, "src")}${addAttribute(`${trainingTitle} Banner`, "alt")} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-black bg-opacity-60"></div> <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center"> <h1 class="text-4xl md:text-6xl font-bold mb-4">${trainingTitle}</h1> <p class="max-w-2xl text-xl">Advancing robotics education in ${countryData?.name || "your region"}</p> </div> </div> <!-- Training Content --> <div class="container mx-auto py-12 px-4"> <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"> <div class="p-8"> <h2 class="text-3xl font-bold mb-6"${addAttribute(`color: ${primaryColor};`, "style")}>About Our Training Programs</h2> <div class="prose prose-lg max-w-none"> ${renderTemplate`<div class="mb-8">${unescapeHTML(trainingDescription)}</div>`} </div> </div> </div> <!-- Featured Training Courses --> <div class="mt-16"> <h2 class="text-3xl font-bold mb-8 text-center"${addAttribute(`color: ${primaryColor};`, "style")}>Featured Training Courses</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${sampleCourses.map((course) => renderTemplate`<div class="bg-white rounded-lg shadow-lg overflow-hidden"> <img${addAttribute(course.image, "src")}${addAttribute(course.title, "alt")} class="w-full h-48 object-cover"> <div class="p-6"> <div class="flex justify-between items-start mb-2"> <h3 class="text-xl font-bold"${addAttribute(`color: ${primaryColor};`, "style")}>${course.title}</h3> <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">${course.level}</span> </div> <p class="text-gray-500 text-sm mb-4">Duration: ${course.duration}</p> <p class="mb-4">${course.description}</p> <a href="#" class="inline-flex items-center text-white px-4 py-2 rounded-md transition-all transform hover:scale-105"${addAttribute(`background-color: ${accentColor};`, "style")}>
Learn More
<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path> </svg> </a> </div> </div>`)} </div> </div> <!-- Training Schedule --> ${schedules.length > 0 && renderTemplate`<div class="mt-16 max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-center"${addAttribute(`color: ${primaryColor};`, "style")}>Upcoming Training Sessions</h2> <div class="overflow-x-auto"> <table class="w-full bg-white shadow-lg rounded-lg overflow-hidden"> <thead class="text-white"${addAttribute(`background-color: ${primaryColor};`, "style")}> <tr> <th class="py-3 px-4 text-left">Course</th> <th class="py-3 px-4 text-left">Date</th> <th class="py-3 px-4 text-left">Description</th> <th class="py-3 px-4 text-left">Action</th> </tr> </thead> <tbody> ${schedules.map((schedule, index) => renderTemplate`<tr${addAttribute(index % 2 === 0 ? "bg-gray-50" : "bg-white", "class")}> <td class="py-3 px-4 font-medium">${schedule.title}</td> <td class="py-3 px-4">${new Date(schedule.date).toLocaleDateString()}</td> <td class="py-3 px-4">${schedule.description}</td> <td class="py-3 px-4"> <a href="/registration" class="inline-flex items-center text-white text-sm px-3 py-1 rounded transition-all"${addAttribute(`background-color: ${accentColor};`, "style")}>
Register
</a> </td> </tr>`)} </tbody> </table> </div> </div>`} <!-- Contact Section --> <div class="mt-16 max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"> <div class="p-8"> <h2 class="text-3xl font-bold mb-6 text-center"${addAttribute(`color: ${primaryColor};`, "style")}>Get in Touch</h2> <p class="text-center mb-8">
Interested in our training programs? Contact us for more information or to discuss customized training for your organization.
</p> <div class="flex flex-col md:flex-row justify-center gap-4"> ${countryData?.contactInfo?.email && renderTemplate`<a${addAttribute(`mailto:${countryData.contactInfo.email}`, "href")} class="inline-flex items-center justify-center text-white px-6 py-3 rounded-md transition-all transform hover:scale-105"${addAttribute(`background-color: ${primaryColor};`, "style")}> <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>
Contact by Email
</a>`} ${countryData?.contactInfo?.phone && renderTemplate`<a${addAttribute(`tel:${countryData.contactInfo.phone}`, "href")} class="inline-flex items-center justify-center text-white px-6 py-3 rounded-md transition-all transform hover:scale-105"${addAttribute(`background-color: ${accentColor};`, "style")}> <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg>
Call Us
</a>`} </div> </div> </div> </div> </div>  ${countryData?.customCSS && renderTemplate`<style>${unescapeHTML(countryData.customCSS)}</style>`}` })}`;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/[country]/trainings.astro", void 0);
const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/country/[country]/trainings.astro";
const $$url = "/dubai/country/[country]/trainings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Trainings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
