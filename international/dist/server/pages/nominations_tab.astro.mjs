/* empty css                                  */
import { e as createComponent, r as renderTemplate, m as maybeRenderHead, f as createAstro, k as renderComponent, h as addAttribute } from '../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                           */
import { $ as $$Layout } from '../chunks/Layout_BrCK3NfS.mjs';
import { g as getTemplate } from '../chunks/mongodb_DJrNPHw-.mjs';
export { renderers } from '../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$NominationsForm = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="hero" data-astro-cid-qf64qw3c> <div class="nom-container" data-astro-cid-qf64qw3c> <h1 class="nom-title" data-astro-cid-qf64qw3c>NOMINATION FORM</h1> <form class="nom-form" id="nomination-form" data-astro-cid-qf64qw3c> <!-- First Name and Last Name --> <div class="fname-lname-div" data-astro-cid-qf64qw3c> <div class="fname-div" data-astro-cid-qf64qw3c> <label for="fname" data-astro-cid-qf64qw3c>First Name</label> <input type="text" id="fname" name="firstName" placeholder="Enter your first name" required data-astro-cid-qf64qw3c> </div> <div class="lname-div" data-astro-cid-qf64qw3c> <label for="lname" data-astro-cid-qf64qw3c>Last Name</label> <input type="text" id="lname" name="lastName" placeholder="Enter your last name" required data-astro-cid-qf64qw3c> </div> </div> <!-- School and Phone Number --> <div class="school-phone-div" data-astro-cid-qf64qw3c> <div class="school-div" data-astro-cid-qf64qw3c> <label for="school" data-astro-cid-qf64qw3c>School Name</label> <input type="text" id="school" name="schoolName" placeholder="Enter your school name" required data-astro-cid-qf64qw3c> </div> <div class="phone-div" data-astro-cid-qf64qw3c> <label for="phone" data-astro-cid-qf64qw3c>Phone Number</label> <input type="tel" id="phone" name="contact" placeholder="Enter your phone number" required data-astro-cid-qf64qw3c> </div> </div> <!-- Email and Designation --> <div class="email-designation-div" data-astro-cid-qf64qw3c> <div class="email-div" data-astro-cid-qf64qw3c> <label for="email" data-astro-cid-qf64qw3c>Email</label> <input type="email" id="email" name="email" placeholder="Enter your email" required data-astro-cid-qf64qw3c> </div> <div class="designation-div" data-astro-cid-qf64qw3c> <label for="designation" data-astro-cid-qf64qw3c>Designation</label> <select id="designation" name="designation" required data-astro-cid-qf64qw3c> <option value="" selected data-astro-cid-qf64qw3c>Select a designation</option> <option value="Player" data-astro-cid-qf64qw3c>Designation 1</option> <option value="Coach" data-astro-cid-qf64qw3c>Designation 2</option> <option value="Manager" data-astro-cid-qf64qw3c>Designation 3</option> </select> </div> </div> <!-- Award Category --> <div class="award-div" data-astro-cid-qf64qw3c> <label for="award" data-astro-cid-qf64qw3c>Which award category do you want to apply for?</label> <select id="award" name="awardCategory" required data-astro-cid-qf64qw3c> <option value="" selected data-astro-cid-qf64qw3c>Select an award</option> <option value="Best Player" data-astro-cid-qf64qw3c>Award 1</option> <option value="Best Team" data-astro-cid-qf64qw3c>Award 2</option> <option value="Best Coach" data-astro-cid-qf64qw3c>Award 3</option> </select> </div> <!-- Description --> <div class="description-div" data-astro-cid-qf64qw3c> <label for="description" data-astro-cid-qf64qw3c>Brief description about yourself or your institution.</label> <textarea id="description" name="description" rows="4" placeholder="Write your description here" required data-astro-cid-qf64qw3c></textarea> </div> <!-- International Award --> <div class="international-award-div" data-astro-cid-qf64qw3c> <label for="international-award" data-astro-cid-qf64qw3c>What would an International Award mean to you?</label> <textarea id="international-award" name="awardMeaning" rows="4" placeholder="Write your response here" required data-astro-cid-qf64qw3c></textarea> </div> <!-- Shortlisted --> <div class="shortlisted-div" data-astro-cid-qf64qw3c> <label data-astro-cid-qf64qw3c>Would you travel to Dubai to receive the award if shortlisted?</label> <div data-astro-cid-qf64qw3c> <input type="radio" id="shortlisted-yes" name="shortlisted" value="yes" required data-astro-cid-qf64qw3c> <label for="shortlisted-yes" data-astro-cid-qf64qw3c>Yes</label> </div> <div data-astro-cid-qf64qw3c> <input type="radio" id="shortlisted-no" name="shortlisted" value="no" data-astro-cid-qf64qw3c> <label for="shortlisted-no" data-astro-cid-qf64qw3c>No</label> </div> </div> <!-- Address and Region --> <div class="address-region-div" data-astro-cid-qf64qw3c> <div class="address-div" data-astro-cid-qf64qw3c> <label for="address" data-astro-cid-qf64qw3c>Address (Unit/Block No./Street/City)</label> <input type="text" id="address" name="address" placeholder="Enter your address" required data-astro-cid-qf64qw3c> </div> <div class="region-div" data-astro-cid-qf64qw3c> <label for="region" data-astro-cid-qf64qw3c>Region</label> <input type="text" id="region" name="region" placeholder="Enter your region" required data-astro-cid-qf64qw3c> </div> </div> <!-- Country and School Website --> <div class="country-schoolweb-div" data-astro-cid-qf64qw3c> <div class="country-div" data-astro-cid-qf64qw3c> <label for="country" data-astro-cid-qf64qw3c>Country</label> <select id="country" name="country" required data-astro-cid-qf64qw3c> <option value="" selected data-astro-cid-qf64qw3c>Select a country</option> <option value="India" data-astro-cid-qf64qw3c>India</option> <option value="USA" data-astro-cid-qf64qw3c>USA</option> <option value="UK" data-astro-cid-qf64qw3c>UK</option> </select> </div> <div class="school-website-div" data-astro-cid-qf64qw3c> <label for="school-website" data-astro-cid-qf64qw3c>School Website</label> <input type="url" id="school-website" name="schoolWebsite" placeholder="Enter the school website" required data-astro-cid-qf64qw3c> </div> </div> <!-- Social Media --> <div class="social-media-div" data-astro-cid-qf64qw3c> <label data-astro-cid-qf64qw3c>Social Media Platforms:</label> <div data-astro-cid-qf64qw3c> <input type="checkbox" id="facebook" name="socialMedia" value="Facebook" data-astro-cid-qf64qw3c> <label for="facebook" data-astro-cid-qf64qw3c>Facebook</label> </div> <div data-astro-cid-qf64qw3c> <input type="checkbox" id="instagram" name="socialMedia" value="Instagram" data-astro-cid-qf64qw3c> <label for="instagram" data-astro-cid-qf64qw3c>Instagram</label> </div> <div data-astro-cid-qf64qw3c> <input type="checkbox" id="x" name="socialMedia" value="X" data-astro-cid-qf64qw3c> <label for="x" data-astro-cid-qf64qw3c>X</label> </div> <div data-astro-cid-qf64qw3c> <input type="checkbox" id="linkedin" name="socialMedia" value="LinkedIn" data-astro-cid-qf64qw3c> <label for="linkedin" data-astro-cid-qf64qw3c>LinkedIn</label> </div> <input type="text" id="social-media-other" name="socialMediaOther" placeholder="Other platforms" data-astro-cid-qf64qw3c> </div> <!-- Past Achievements --> <div class="past-achievements-div" data-astro-cid-qf64qw3c> <label for="achievements" data-astro-cid-qf64qw3c>Past Achievements (if any)</label> <textarea id="achievements" name="achievements" rows="4" placeholder="Write about your achievements" data-astro-cid-qf64qw3c></textarea> </div> <!-- Submit Button --> <div class="submit-button-div" data-astro-cid-qf64qw3c> <button class="submit-button" id="submit-button" type="submit" data-astro-cid-qf64qw3c>\nSubmit\n</button> </div> </form> </div> </div> <script type="module" src="/src/components/Nominations/nomination-data.js"><\/script> '])), maybeRenderHead());
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/components/Nominations/Nominations_Form.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$NominationsTab = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NominationsTab;
  const countrySiteHeader = Astro2.request.headers.get("x-country-site");
  const countrySite = countrySiteHeader ? JSON.parse(countrySiteHeader) : { slug: "default", name: "Dubai" };
  const template = await getTemplate(countrySite.slug);
  const dbContent = template?.config?.Contents || {};
  const defaultNominationContent = {
    hero_background: "/backgrounds/Nomination-Banner.jpg",
    hero_title: "Nominate The Bright Minds Of Tomorrow!",
    hero_subtitle: "Recognize outstanding individuals and teams in robotics, research, and innovation. Your nomination can inspire the next generation of leaders.",
    hero_buttonText: "Nominate Now"
  };
  const content = { ...defaultNominationContent, ...dbContent.Nomination || {} };
  const layoutContent = {
    nav: dbContent.Navbar || {},
    footer: dbContent.Footer || {},
    banner: dbContent.Banner || {}
  };
  const pageTitle = content.hero_title || `Erovoutika ${countrySite.name} - Nominations`;
  return renderTemplate(_a || (_a = __template(["", '  <script>\n    const nominateButton = document.querySelector(".nominate-button");\n    nominateButton.addEventListener("click", () => {\n        const introSection = document.getElementById("nomination-form");\n        if (introSection) {\n            introSection.scrollIntoView({ behavior: "smooth" });\n        } else {\n            console.error("Introduction section not found.");\n        }\n    });\n<\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "content": layoutContent, "data-astro-cid-g56mpxfz": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="nomination-hero"${addAttribute(`background-image: url(${content.hero_background});`, "style")} data-astro-cid-g56mpxfz> <div class="hero-content" data-astro-cid-g56mpxfz> <h1 class="hero-title" data-astro-cid-g56mpxfz>${content.hero_title}</h1> <p class="hero-subtitle" data-astro-cid-g56mpxfz>${content.hero_subtitle}</p> <button class="nominate-button" data-astro-cid-g56mpxfz>${content.hero_buttonText}</button> </div> </section> <section class="nomination-form" id="nominations" data-astro-cid-g56mpxfz> ${renderComponent($$result2, "NominationForm", $$NominationsForm, { "data-astro-cid-g56mpxfz": true })} </section> ` }));
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/Nominations_Tab.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/Nominations_Tab.astro";
const $$url = "/dubai/Nominations_Tab";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$NominationsTab,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
