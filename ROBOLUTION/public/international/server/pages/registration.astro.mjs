/* empty css                                  */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, l as renderScript, h as addAttribute } from '../chunks/astro/server_DtLrBLte.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_tTLm-7Qx.mjs';
import { s as supabase } from '../chunks/supabase-client_BrwR6F9D.mjs';
import { g as getTemplate } from '../chunks/mongodb_DJrNPHw-.mjs';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

const $$Astro = createAstro();
const $$Registration = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Registration;
  const countrySiteHeader = Astro2.request.headers.get("x-country-site");
  const countrySite = countrySiteHeader ? JSON.parse(countrySiteHeader) : { slug: "default", name: "Dubai" };
  const countryName = countrySite.name;
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const fullname = formData.get("fullname");
      const email = formData.get("email");
      const surname = formData.get("surname");
      const name = formData.get("name");
      const middleName = formData.get("middleName");
      const contactNumber = formData.get("contactNumber");
      const emailAddress = formData.get("emailAddress");
      const country = formData.get("country");
      const programType = formData.getAll("programType");
      const category = formData.get("category");
      const school = formData.get("school");
      const passportNumber = formData.get("passportNumber");
      const paymentOption = formData.get("paymentOption");
      let paymentProofUrl = "";
      const paymentProofFile = formData.get("paymentProof");
      if (paymentProofFile && paymentProofFile.size > 0) {
        try {
          const timestamp = (/* @__PURE__ */ new Date()).getTime();
          const filename = `payment_proof_${timestamp}_${paymentProofFile.name}`;
          const { data: fileData, error: fileError } = await supabase.storage.from("payment_proofs").upload(filename, paymentProofFile);
          if (fileError) {
            console.error("Error uploading file:", fileError);
          } else {
            const { data: urlData } = await supabase.storage.from("payment_proofs").getPublicUrl(filename);
            paymentProofUrl = urlData?.publicUrl || "";
          }
        } catch (fileUploadError) {
          console.error("File upload error:", fileUploadError);
        }
      }
      const { data, error } = await supabase.from("registrations").insert([
        {
          fullname: `${name} ${middleName} ${surname}`,
          email,
          contactNumber,
          country,
          program: programType,
          category,
          school,
          passportNumber,
          paymentOption,
          paymentProofUrl,
          verified: false,
          denied: false,
          registeredAt: (/* @__PURE__ */ new Date()).toISOString(),
          event_country: countrySite.slug
        }
      ]);
      if (error) {
        console.error("Error submitting registration:", error);
        throw new Error("Registration failed");
      }
      return Astro2.redirect("/registration-success");
    } catch (error) {
      console.error("Error processing form:", error);
    }
  }
  const template = await getTemplate(countrySite.slug);
  const dbContent = template?.config?.Contents || {};
  const defaultContent = {
    title: `ROBOLUTION ${countryName} - Registration`,
    header: `\u{1F680} Erovoutika is now registered in ${countryName}! \u{1F30D}\u2728`,
    subHeader: `\u{1F525} ROBOLUTION: Robotics & Automation Competition 2025 in ${countryName}`,
    location: `${countryName}, ${countrySite.slug === "dubai" || countrySite.slug === "default" ? "UAE" : ""}`.replace(/, $/, ""),
    eventFeatures: {
      title: "Event Features:",
      items: [
        "<strong>Training Camp</strong> - 1) Robotics & Automation, 2) Research & Innovation, 3) Cybersecurity",
        "<strong>Competition</strong> - 1) Erobot category, 2) Freestyle category, 3) EroMath, 4) Cybersecurity",
        "<strong>Divisions</strong> - Teacher/Industry, College, High School & Elementary",
        "<strong>Awards</strong> - Robotics Coach of the Year, Robotics Club of the Year, Global Young Innovator Award & Special Awards"
      ]
    },
    eventSchedule: {
      title: "Event Schedule:",
      schedule: "2-day Training, 1-day Tournament & Awarding, & 1-day Tour",
      date: "Dec. 15-18, 2025"
    },
    packages: {
      title: "Registration Packages:",
      items: [
        {
          name: "PACKAGE #1 (F2F with Accommodation)",
          description: "Includes: Training & Competition, Certificates, Hotel accommodation, Breakfast, Coffee break, Lunch & Tour",
          deadline: "Deadline: August 15, 2025",
          price: "Price: Php 59,950 (Philippines) / 3700 AED (International)"
        },
        {
          name: "PACKAGE #2 (F2F without Accommodation)",
          description: "Includes: Training & Competition, Certificates, Coffee break, Lunch",
          deadline: null,
          price: "Price: Php 39,950 (Philippines) / 2500 AED (International)"
        },
        {
          name: "PACKAGE #3 (Competition Only)",
          description: "Includes: Competition & Awarding only (Freestyle category & Erobot)",
          deadline: null,
          price: "Price: Php 6,950 (Philippines) / 500 AED (International)"
        },
        {
          name: "PACKAGE #4 (Virtual Competition)",
          description: "Includes: Virtual Competition & Awarding only (Freestyle Category-Hybrid & EroMath)",
          deadline: null,
          price: null
        }
      ],
      specialOffer: "Special Offer: 5 members (1 member FREE for program fee)",
      note: "*Reservation fee will be deducted from the total registration fee"
    },
    reservation: {
      title: "\u26A0\uFE0F LIMITED SLOTS ONLY! RESERVE YOUR SLOT NOW! \u26A0\uFE0F",
      fee: "Reservation Fee: 250 AED \u2248 Php 4,250",
      note: "(Non-refundable but transferable to another service/program)",
      paymentInfo: "GCash: 09061497307 - Bhai Nhuraisha Deplomo"
    }
  };
  const pageContent = deepMerge(defaultContent, dbContent.Registration || {});
  const layoutContent = {
    nav: dbContent.Navbar || {},
    footer: dbContent.Footer || {},
    banner: dbContent.Banner || {}
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageContent.title, "content": layoutContent, "data-astro-cid-6ubmnb5e": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-800 min-h-screen -z-10" data-astro-cid-6ubmnb5e></div> <main class="container mx-auto px-4 pt-40 pb-16 max-w-4xl relative z-10" data-astro-cid-6ubmnb5e> <h1 class="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.title)}</h1> <div class="bg-white p-6 rounded-lg shadow-md mb-8" data-astro-cid-6ubmnb5e> <div class="text-center mb-6" data-astro-cid-6ubmnb5e> <h2 class="text-xl font-semibold" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.header)}</h2> <p class="text-lg font-medium mt-4" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.subHeader)}</p> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <h3 class="text-lg font-semibold mb-2" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.eventFeatures.title)}</h3> <ul class="list-disc pl-6 space-y-1" data-astro-cid-6ubmnb5e> ${pageContent.eventFeatures.items.map((item) => renderTemplate`<li data-astro-cid-6ubmnb5e>${unescapeHTML(item)}</li>`)} </ul> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <h3 class="text-lg font-semibold mb-2" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.eventSchedule.title)}</h3> <p data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.eventSchedule.schedule)}</p> <p class="font-bold mt-2" data-astro-cid-6ubmnb5e>Date: ${pageContent.eventSchedule.date}</p> <p class="font-bold" data-astro-cid-6ubmnb5e>Location: ${pageContent.location}</p> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <h3 class="text-lg font-semibold mb-2" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.packages.title)}</h3> <div class="space-y-3" data-astro-cid-6ubmnb5e> ${pageContent.packages.items.map((pkg, index) => renderTemplate`<div${addAttribute(`p-3 rounded border ${["bg-blue-50 border-blue-200", "bg-green-50 border-green-200", "bg-yellow-50 border-yellow-200", "bg-purple-50 border-purple-200"][index % 4]}`, "class")} data-astro-cid-6ubmnb5e> <h4 class="font-medium" data-astro-cid-6ubmnb5e>${unescapeHTML(pkg.name)}</h4> <p data-astro-cid-6ubmnb5e>${unescapeHTML(pkg.description)}</p> ${pkg.deadline && renderTemplate`<p class="text-sm font-bold" data-astro-cid-6ubmnb5e>${unescapeHTML(pkg.deadline)}</p>`} ${pkg.price && renderTemplate`<p data-astro-cid-6ubmnb5e>${unescapeHTML(pkg.price)}</p>`} </div>`)} </div> <p class="mt-4 font-bold" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.packages.specialOffer)}</p> <p class="text-sm italic" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.packages.note)}</p> </div> <div class="p-3 bg-red-50 rounded border border-red-200 mb-6" data-astro-cid-6ubmnb5e> <p class="font-bold text-center" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.reservation.title)}</p> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <p class="text-center" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.reservation.fee)}</p> <p class="text-center text-sm" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.reservation.note)}</p> <p class="mt-2 text-center" data-astro-cid-6ubmnb5e>${unescapeHTML(pageContent.reservation.paymentInfo)}</p> </div> </div> <!-- Registration Form --> <form method="POST" enctype="multipart/form-data" class="bg-white p-6 rounded-lg shadow-md" data-astro-cid-6ubmnb5e> <h2 class="text-2xl font-bold mb-6 text-center" data-astro-cid-6ubmnb5e>Registration Form</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-astro-cid-6ubmnb5e> <div data-astro-cid-6ubmnb5e> <label for="surname" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Surname*</label> <input type="text" id="surname" name="surname" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="name" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>First Name*</label> <input type="text" id="name" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="middleName" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Middle Name</label> <input type="text" id="middleName" name="middleName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="contactNumber" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Contact Number*</label> <input type="tel" id="contactNumber" name="contactNumber" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="email" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Email*</label> <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="emailAddress" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Confirm Email*</label> <input type="email" id="emailAddress" name="emailAddress" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="country" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Country of Residence*</label> <input type="text" id="country" name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="school" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>School/Company</label> <input type="text" id="school" name="school" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> <div data-astro-cid-6ubmnb5e> <label for="passportNumber" class="block text-sm font-medium text-gray-700 mb-1" data-astro-cid-6ubmnb5e>Passport Number (if applicable)</label> <input type="text" id="passportNumber" name="passportNumber" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-astro-cid-6ubmnb5e> </div> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-6ubmnb5e>Which program do you want to join?*</label> <div class="space-y-2" data-astro-cid-6ubmnb5e> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="checkbox" id="robotics" name="programType" value="Robotics & Automation" class="h-5 w-5 rounded border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="robotics" class="text-sm" data-astro-cid-6ubmnb5e>International Robotics & Automation Training Camp & Tournament</label> </div> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="checkbox" id="cybersecurity" name="programType" value="Cybersecurity" class="h-5 w-5 rounded border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="cybersecurity" class="text-sm" data-astro-cid-6ubmnb5e>International Cybersecurity Training Camp & Tournament</label> </div> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="checkbox" id="research" name="programType" value="Research and Development" class="h-5 w-5 rounded border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="research" class="text-sm" data-astro-cid-6ubmnb5e>International Research and Development Training Camp & Tournament</label> </div> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="checkbox" id="competition" name="programType" value="Competition & Awarding" class="h-5 w-5 rounded border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="competition" class="text-sm" data-astro-cid-6ubmnb5e>Competition & Awarding</label> </div> </div> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-6ubmnb5e>Category*</label> <div class="space-y-2" data-astro-cid-6ubmnb5e> <div class="flex items-center" data-astro-cid-6ubmnb5e> <input type="radio" id="academe" name="category" value="Academe" required class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mr-3" data-astro-cid-6ubmnb5e> <label for="academe" class="text-sm" data-astro-cid-6ubmnb5e>Academe</label> </div> <div class="flex items-center" data-astro-cid-6ubmnb5e> <input type="radio" id="industry" name="category" value="Industry" class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mr-3" data-astro-cid-6ubmnb5e> <label for="industry" class="text-sm" data-astro-cid-6ubmnb5e>Industry</label> </div> <div class="flex items-center" data-astro-cid-6ubmnb5e> <input type="radio" id="parent" name="category" value="Parent/Guardian" class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mr-3" data-astro-cid-6ubmnb5e> <label for="parent" class="text-sm" data-astro-cid-6ubmnb5e>Parent/Guardian</label> </div> <div class="flex items-center" data-astro-cid-6ubmnb5e> <input type="radio" id="student" name="category" value="Student" class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mr-3" data-astro-cid-6ubmnb5e> <label for="student" class="text-sm" data-astro-cid-6ubmnb5e>Student</label> </div> </div> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-6ubmnb5e>Package Option*</label> <div class="space-y-2" data-astro-cid-6ubmnb5e> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="radio" id="option1" name="paymentOption" value="OPTION #1" required class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="option1" class="text-sm" data-astro-cid-6ubmnb5e>OPTION #1: Program Fee per head (Accommodation is included) - Deadline of this package is August 15, 2025</label> </div> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="radio" id="option2" name="paymentOption" value="OPTION #2" class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="option2" class="text-sm" data-astro-cid-6ubmnb5e>OPTION #2: Program Fee per head (accommodation is not included)</label> </div> <div class="flex items-start" data-astro-cid-6ubmnb5e> <input type="radio" id="option3" name="paymentOption" value="OPTION #3" class="h-5 w-5 border border-gray-400 text-indigo-600 focus:ring-indigo-500 mt-1 mr-3" data-astro-cid-6ubmnb5e> <label for="option3" class="text-sm" data-astro-cid-6ubmnb5e>OPTION #3: Competition Fee Only per head</label> </div> </div> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-6ubmnb5e>Payment Proof (Optional)</label> <div class="border-2 border-dashed border-gray-300 rounded-md p-4" data-astro-cid-6ubmnb5e> <div class="space-y-2" data-astro-cid-6ubmnb5e> <div class="flex items-center justify-center" data-astro-cid-6ubmnb5e> <label for="paymentProof" class="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm flex items-center gap-2" data-astro-cid-6ubmnb5e> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-6ubmnb5e> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" data-astro-cid-6ubmnb5e></path> </svg>
Upload Payment Proof
</label> <input type="file" id="paymentProof" name="paymentProof" accept="image/*,.pdf" class="hidden" data-astro-cid-6ubmnb5e> </div> <p class="text-xs text-gray-500 text-center" data-astro-cid-6ubmnb5e>Max file size: 10MB. Accepted formats: JPEG, PNG, PDF</p> <p id="fileName" class="text-sm text-center text-gray-700" data-astro-cid-6ubmnb5e></p> </div> </div> <p class="text-sm mt-2" data-astro-cid-6ubmnb5e>You can also submit your payment proof later by emailing it to <a href="mailto:erovoutika@gmail.com" class="text-blue-600 hover:underline" data-astro-cid-6ubmnb5e>erovoutika@gmail.com</a></p> </div> <div class="mb-6" data-astro-cid-6ubmnb5e> <p class="text-sm" data-astro-cid-6ubmnb5e>By submitting this form, you agree to our <a href="#" class="text-blue-600 hover:underline" data-astro-cid-6ubmnb5e>Terms and Conditions</a>.</p> </div> <div class="flex justify-center" data-astro-cid-6ubmnb5e> <button type="submit" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" data-astro-cid-6ubmnb5e>
Submit Registration
</button> </div> ${renderScript($$result2, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/registration.astro?astro&type=script&index=0&lang.ts")} </form> </main> ` })} `;
}, "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/registration.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/RoboWebapp/international/src/pages/registration.astro";
const $$url = "/dubai/registration";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Registration,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
