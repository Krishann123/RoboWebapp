import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_C-kESatQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BBh2tBzR.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const logo = new Proxy({"src":"/international/_astro/Erovoutika Dubai logo.DqaA4qgV.png","width":209,"height":68,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Krishann/Desktop/Robo-combined/international/src/assets/images/Erovoutika Dubai logo.png";
							}
							
							return target[name];
						}
					});

const show_password_icon = new Proxy({"src":"/international/_astro/show-password.JZZGCVaN.png","width":19,"height":15,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Krishann/Desktop/Robo-combined/international/src/assets/images/utility-icons/show-password.png";
							}
							
							return target[name];
						}
					});

const hide_password_icon = new Proxy({"src":"/international/_astro/hide-password.CycqiXUW.png","width":18,"height":17,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Krishann/Desktop/Robo-combined/international/src/assets/images/utility-icons/hide-password.png";
							}
							
							return target[name];
						}
					});

const $$Astro = createAstro();
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const { cookies, redirect } = Astro2;
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  if (accessToken && refreshToken) {
    return redirect("/admin");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika Dubai - Login", "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero-background" data-astro-cid-sgpqyurt> <div class="form-container" data-astro-cid-sgpqyurt> <img class="erovoutika-logo"${addAttribute(logo.src, "src")} data-astro-cid-sgpqyurt> <div class="form-content" data-astro-cid-sgpqyurt> <h1 class="admin-login" data-astro-cid-sgpqyurt>Admin Login</h1> <form class="admin-form" action="/api/auth/signin" method="post" data-astro-cid-sgpqyurt> <div class="username" data-astro-cid-sgpqyurt> <input type="email" name="email" placeholder="email" id="email" required data-astro-cid-sgpqyurt> </div> <div class="password" data-astro-cid-sgpqyurt> <input type="password" name="password" placeholder="Password" id="password" required data-astro-cid-sgpqyurt> <img${addAttribute(show_password_icon.src, "src")} id="show-pass" alt="show eye icon" data-astro-cid-sgpqyurt> <img${addAttribute(hide_password_icon.src, "src")} id="hide-pass" alt="hide eye icon" style="display: none;" data-astro-cid-sgpqyurt> <!--<div class="have_account">
                            <p>Didn't have an account? <a href ="/Admin_SignUp"><u>Sign Up</u></a></p>
                        </div>--> </div> <div class="w-full text-right mt-1" data-astro-cid-sgpqyurt> <a href="#" id="forgot-password-link" class="text-[#233876] text-sm hover:underline hover:text-blue-700" data-astro-cid-sgpqyurt>Forgot Password?</a> </div> <button type="submit" class="login-button" id="login_button" data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>Log In</span> </button> </form> <div id="forgot-password-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-40 hidden" data-astro-cid-sgpqyurt> <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative" data-astro-cid-sgpqyurt> <button id="close-modal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" data-astro-cid-sgpqyurt>&times;</button> <h2 class="text-xl text-center font-semibold mb-4 text-[#233876]" data-astro-cid-sgpqyurt>
Forgot Password
</h2> <form id="forgot-password-form" method="POST" action="/api/auth/forgot-password" data-astro-cid-sgpqyurt> <label for="forgot-email" class="block mb-2 text-sm text-center font-medium text-gray-700" data-astro-cid-sgpqyurt>Enter your email address:</label> <input type="email" id="forgot-email" name="forgot-email" required class="w-full px-4 py-2 mb-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#233876]" data-astro-cid-sgpqyurt> <button type="submit" class="w-full py-2 bg-[#233876] text-white rounded-full hover:bg-gray-300 hover:text-[#233876] transition" data-astro-cid-sgpqyurt>
Send Reset Link
</button> <div id="forgot-password-message" class="mt-4 text-green-600 text-center hidden" data-astro-cid-sgpqyurt>
If this email is registered, a reset link has
                                been sent.
</div> </form> </div> </div> </div> </div> </section> ` })}  ${renderScript($$result, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/login.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/login.astro";
const $$url = "/international/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Login,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
