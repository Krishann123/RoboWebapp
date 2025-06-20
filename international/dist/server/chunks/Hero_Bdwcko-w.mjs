import { e as createComponent, m as maybeRenderHead, h as addAttribute, u as unescapeHTML, l as renderScript, r as renderTemplate } from './astro/server_C-kESatQ.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                              */
import { f as fetchPageContent } from './db_EK65h4qK.mjs';

const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const copyTheme = await fetchPageContent("Tournament");
  return renderTemplate`${maybeRenderHead()}<div class="page"${addAttribute(`background-image: url(${copyTheme.Hero.background});`, "style")} data-astro-cid-te765hza> <!-- hero title --> <div class="hero" data-astro-cid-te765hza> <div class="hero-content" data-astro-cid-te765hza> <h1 class="hero-title" data-astro-cid-te765hza>${unescapeHTML(copyTheme.Hero.title)}</h1> <p class="hero-subtitle" data-astro-cid-te765hza>${unescapeHTML(copyTheme.Hero.subtitle)}</p> <button class="hero-button" onclick="scrollToIntroduction()" data-astro-cid-te765hza>${copyTheme.Hero.buttonText}</button> </div> </div> </div>  ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/Tournament/Hero.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/Tournament/Hero.astro?astro&type=script&index=1&lang.ts")}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/Tournament/Hero.astro", void 0);

export { $$Hero as $ };
