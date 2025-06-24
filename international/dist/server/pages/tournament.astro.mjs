import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../chunks/astro/server_C-kESatQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_hV_SdrMw.mjs';
/* empty css                                      */
import { f as fetchPageContent } from '../chunks/db_BLiRlGFB.mjs';
import { $ as $$Hero } from '../chunks/Hero_CJJ83nJA.mjs';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const $$Tournament = createComponent(async ($$result, $$props, $$slots) => {
  const copyTheme = await fetchPageContent("Tournament");
  console.log("Tournament content:", copyTheme);
  const { erobot, eromath, freestyle, cybersecurity } = copyTheme.Pictures || {};
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika Dubai - Tournament", "data-astro-cid-q3alncq5": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "data-astro-cid-q3alncq5": true })} ${maybeRenderHead()}<div class="overview" id="OverView" data-astro-cid-q3alncq5> <div data-astro-cid-q3alncq5> <h1 class="subhead" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Overview.subheadings)}</h1> <h1 class="head tracking-wider" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Overview.Headings)}</h1> <p class="info md:w-190" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Overview.info)}</p> </div> <!-- PICTURE SECTION --> <div class="grid grid-cols-1 sm:grid-cols-1 place-items-center md:grid-cols-2 bg-transparent" data-astro-cid-q3alncq5> <a id="erobot-link" class="transition hover:scale-120" href="#" data-astro-cid-q3alncq5><img${addAttribute(erobot, "src")} data-astro-cid-q3alncq5></a> <div id="erobot-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 hidden" data-astro-cid-q3alncq5> <div class="bg-white p-8 rounded shadow-lg relative w-auto lg:w-200 h-auto" data-astro-cid-q3alncq5> <button id="close-erobot-modal" class="absolute top-2 right-2 text-2xl" data-astro-cid-q3alncq5>&times;</button> <img${addAttribute(erobot, "src")} class="max-w-xs mx-auto" data-astro-cid-q3alncq5> <ul class="list-disc" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
Teachers from elementary to college across all
                            disciplines or industry practitioners can form teams
                            to represent their school or company. Each team must
                            consist of a minimum of two (2) and a maximum of
                            five (5) members. Participants will utilize
                            EROVOUTIKA (Robotics & Automation) kits to compete
                            in the Robotics & Automation for Research and
                            Innovation, EROVOUTHON Category. The tournament
                            serves as the culminating activity, showcasing the
                            skills and knowledge gained during the training
                            camp.
</li> </ul> </div> </div> <a id="freestyle-link" class="transition hover:scale-120" href="#" data-astro-cid-q3alncq5> <img${addAttribute(freestyle, "src")} data-astro-cid-q3alncq5> </a> <div id="freestyle-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 hidden" data-astro-cid-q3alncq5> <div class="bg-white p-8 rounded shadow-lg relative w-auto lg:w-200 h-auto" data-astro-cid-q3alncq5> <button id="close-freestyle-modal" class="absolute top-2 right-2 text-2xl" data-astro-cid-q3alncq5>&times;</button> <img${addAttribute(freestyle, "src")} class="max-w-xs mx-auto" data-astro-cid-q3alncq5> <ul class="list-disc" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
A team can consist of high school or college
                            students, with a minimum of two (2) and a maximum of
                            five (5) members. Each team will showcase their
                            projects and deliver a five-minute presentation to
                            the panel of judges. Their presentation must feature
                            an innovative, functional prototype demonstrating
                            its purpose, design, and application effectively.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
Additionally, teams are required to prepare a
                            roll-up poster size to visually present their
                            project. The poster should include the project
                            title, objectives, methodology, key features, and
                            real-world applications, ensuring clarity and
                            professionalism in their presentation.
</li> </ul> </div> </div> <a id="eromath-link" class="transition hover:scale-120" href="#" data-astro-cid-q3alncq5> <img${addAttribute(eromath, "src")} data-astro-cid-q3alncq5> </a> <div id="eromath-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 hidden" data-astro-cid-q3alncq5> <div class="bg-white p-8 rounded shadow-lg relative w-auto lg:w-200 h-auto" data-astro-cid-q3alncq5> <button id="close-eromath-modal" class="absolute top-2 right-2 text-2xl" data-astro-cid-q3alncq5>&times;</button> <img${addAttribute(eromath, "src")} class="max-w-xs mx-auto" data-astro-cid-q3alncq5> <ul class="list-disc" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
A team can consist of high school or college
                            students, with a minimum of two (2) and a maximum of
                            five (5) members.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
Additionally, teams are required to prepare a
                            roll-up poster size to visually present their
                            project. The poster should include the project
                            title, objectives, methodology, key features, and
                            real-world applications, ensuring clarity and
                            professionalism in their presentation.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
The robotics kit to be used is the ERovoutika robot,
                            except for the Erobot v3 (open category), which you
                            can build on your own. This is upon the approval of
                            Erovoutika team.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
The robot's ranking is based on the time it takes to
                            complete one lap.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
To complete one lap, the robot must traverse the
                            entire track from start to finish.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
3 attempts to record their time are provided for
                            each team. The best time in the 3 attempts is taken
                            as the final time.
</li> </ul> </div> </div> <a id="cybersecurity-link" class="transition hover:scale-120" href="#" data-astro-cid-q3alncq5> <img${addAttribute(cybersecurity, "src")} data-astro-cid-q3alncq5> </a> <div id="cybersecurity-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 hidden" data-astro-cid-q3alncq5> <div class="bg-white p-8 rounded shadow-lg relative w-auto lg:w-200 h-auto" data-astro-cid-q3alncq5> <button id="close-cybersecurity-modal" class="absolute top-2 right-2 text-2xl" data-astro-cid-q3alncq5>&times;</button> <img${addAttribute(cybersecurity, "src")} class="max-w-xs mx-auto" data-astro-cid-q3alncq5> <ul class="list-disc" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
A team can consist of high school or college
                            students, with a minimum of two (2) and a maximum of
                            five (5) members.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
The team can build their own robot for EMega Sumo
                            but this is subject to prior approval from the
                            Erovoutika team to ensure that it meets the
                            competition standards and specifications.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
Maximum dimensions: the robot must fit in a square
                            10cm x 10cm.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
The maximum mass of the robot must not exceed 500g.
</li> <hr class="solid" data-astro-cid-q3alncq5> <li class="m-4 text-justify" data-astro-cid-q3alncq5>
The robot should have a start-and-stop module for
                            the referee's control.
</li> </ul> </div> </div> </div> </div>   <div data-astro-cid-q3alncq5> <div class="h-fit p-4 justify-items-center" data-astro-cid-q3alncq5> <h1 class="font-bold text-center text-5xl lg:text-[96px] font-bebas tracking-wider text-black mt-10" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Teachers.title)}</h1> </div> <div class="Teachers" data-astro-cid-q3alncq5> <div class="md:p-30 p-5" data-astro-cid-q3alncq5> <div class="grid md:grid-cols-2 grid-cols-1 place-items-center md:gap-10 gap-5" data-astro-cid-q3alncq5> <img class="w-fit h-auto shadow-sm"${addAttribute(copyTheme.Teachers.image, "src")} data-astro-cid-q3alncq5> <div class="self-start w-full md:py-13" data-astro-cid-q3alncq5> <h1 class="md:text-5xl text-4xl md:mb-10 mb-5 text-black text-center bg-amber-200 w-fit rounded-md p-3 roboto-extra-bold" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Teachers.header)}</h1> <p class="text-black inter md:pr-20 text-justify" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Teachers.subtext)}</p> </div> </div> </div> </div> </div>  <div class="Students" data-astro-cid-q3alncq5> <div class="md:p-30 p-5" data-astro-cid-q3alncq5> <div class="grid md:grid-cols-2 grid-cols-1 place-items-center md:gap-10 gap-5" data-astro-cid-q3alncq5> <div class="self-start w-full md:py-13" data-astro-cid-q3alncq5> <h1 class="md:text-5xl text-4xl md:mb-10 mb-5 text-white text-left bg-[#2562FF] w-fit rounded-md p-3 roboto-extra-bold" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Students.header)}</h1> <p class="text-black inter md:pr-20 text-justify" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Students.subtext)}</p> </div> <div data-astro-cid-q3alncq5> <img class="h-auto w-full shadow-sm rounded-md"${addAttribute(copyTheme.Students.image, "src")} data-astro-cid-q3alncq5> </div> </div> </div> </div>  <div class="place-items-center p-20 bg-white grid grid-cols-1" data-astro-cid-q3alncq5> <p class="my-4 text-5xl lg:text-[96px] text-center font-bebas font-bold text-black tracking-wider" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Compete.header)}</p> <p class="flex max-w-[700px] my-10 roboto text-center text-black text-lg" data-astro-cid-q3alncq5>${unescapeHTML(copyTheme.Compete.subtext)}</p> <a class="text-center text-2xl roboto-bold inline-block rounded-full bg-gradient-to-r from-BlueStart via-purple-600 to-PinkEnd px-8 py-3 text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"${addAttribute(copyTheme.Compete.buttonLink, "href")} target="_blank" data-astro-cid-q3alncq5> ${copyTheme.Compete.buttonText} </a> </div> ${renderScript($$result2, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Tournament.astro?astro&type=script&index=0&lang.ts")} ` })}  ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Tournament.astro?astro&type=script&index=1&lang.ts")} ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Tournament.astro?astro&type=script&index=2&lang.ts")}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Tournament.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/Tournament.astro";
const $$url = "/dubai/Tournament";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Tournament,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
