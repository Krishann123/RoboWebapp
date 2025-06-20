import { e as createComponent, r as renderTemplate, m as maybeRenderHead, f as createAstro, k as renderComponent } from '../chunks/astro/server_C-kESatQ.mjs';
import 'kleur/colors';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { c as cn } from '../chunks/utils_B05Dmz_H.mjs';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { $ as $$Layout } from '../chunks/Layout_DdGyDZKU.mjs';
import { g as getPageDetails, f as fetchPageContent, a as getData, b as getSelectedIndex } from '../chunks/db_Dri7-qrb.mjs';
import 'clsx';
/* empty css                                 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as LabelPrimitive from '@radix-ui/react-label';
import { s as supabase } from '../chunks/supabase-client_BrwR6F9D.mjs';
export { renderers } from '../renderers.mjs';

function Accordion$1({
  ...props
}) {
  return /* @__PURE__ */ jsx(AccordionPrimitive.Root, { "data-slot": "accordion", ...props });
}
function AccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AccordionPrimitive.Item,
    {
      "data-slot": "accordion-item",
      className: cn("border-b last:border-b-0", className),
      ...props
    }
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
    AccordionPrimitive.Trigger,
    {
      "data-slot": "accordion-trigger",
      className: cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(ChevronDownIcon, { className: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" })
      ]
    }
  ) });
}
function AccordionContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AccordionPrimitive.Content,
    {
      "data-slot": "accordion-content",
      className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
      ...props,
      children: /* @__PURE__ */ jsx("div", { className: cn("pt-0 pb-4", className), children })
    }
  );
}

function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

function Accordion({ pageDetails }) {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/update-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, description })
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
  };
  return /* @__PURE__ */ jsxs(Accordion$1, { type: "multiple", className: "w-full rounded-xl bg-[#b8c3e62f] p-5", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl py-4 font-bold", children: "Configuration" }),
    pageDetails.map(
      (item, i) => {
        return /* @__PURE__ */ jsxs(AccordionItem, { value: `item-${i.toFixed()}`, children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-2xl text-white px-20 bg-[#233876] my-2", children: item.pageName }),
          /* @__PURE__ */ jsx(AccordionContent, { className: "flex flex-col justify-center w-full gap-1.5 rounded-xl p-4 bg-amber-50", children: item.sections.map((section, index1) => /* @__PURE__ */ jsxs(AccordionItem, { value: `section-${i}-${index1}`, children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: " w-full bg-violet-300 px-20 p-5 rounded-none rounded-t-xl", children: section }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "flex flex-col justify-items-start w-full gap-1.5 bg-white border-1 rounded-b-xl", children: item.contentKeys[index1].map((item2, index2) => /* @__PURE__ */ jsx(Accordion$1, { type: "single", collapsible: true, className: "w-full px-20", children: /* @__PURE__ */ jsxs(AccordionItem, { value: `item-${index1}-${index2}`, children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "w-full p-5", children: typeof item2 === "number" ? `package-${item2 + 1}` : item2 }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "flex flex-col justify-items-start w-full gap-1.5 bg-white border-1 rounded-xl", children: typeof item.contentValues[index1][index2] === "object" ? /* @__PURE__ */ jsx(Accordion$1, { type: "single", collapsible: true, className: "w-full px-20", children: Object.keys(item.contentValues[index1][index2]).map((item4, index3) => typeof item.contentValues[index1][index2][item4] === "string" ? /* @__PURE__ */ jsxs(
                AccordionItem,
                {
                  value: `item-${index1}-${index2}-${item4}`,
                  children: [
                    /* @__PURE__ */ jsx(AccordionTrigger, { children: item4 }),
                    /* @__PURE__ */ jsx(AccordionContent, { className: "flex flex-col justify-items-start w-full gap-1.5 rounded-lg border-1", children: /* @__PURE__ */ jsxs(
                      "form",
                      {
                        className: "flex flex-col items-center justify-center p-5 w-full gap-1.5",
                        onSubmit: (e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            Textarea,
                            {
                              className: "w-100",
                              id: "message-1",
                              defaultValue: item.contentValues[index1][index2][item4],
                              onChange: (e) => {
                                setDescription(e.target.value);
                                setLocation(`${item.pageName}-${section}-${item2}-${item4}`);
                              },
                              onClick: () => setLocation(`${item.pageName}-${section}-${item2}-${item4}`)
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              type: "submit",
                              className: "w-20",
                              disabled: description === "" || description === item.contentValues[index1][index2][item4],
                              children: "Save"
                            }
                          )
                        ]
                      }
                    ) })
                  ]
                },
                `item-${index1}-${index2}-${item4}`
              ) : Object.keys(item.contentValues[index1][index2][item4]).map((item5, index4) => /* @__PURE__ */ jsxs(
                AccordionItem,
                {
                  value: `item-${index1}-${index2}-${index3}-${index4}`,
                  children: [
                    /* @__PURE__ */ jsx(AccordionTrigger, { children: item5 }),
                    /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs(
                      "form",
                      {
                        className: "flex flex-col items-center p-5 justify-center w-full gap-1.5",
                        onSubmit: (e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            Textarea,
                            {
                              className: "w-100",
                              id: "message-2",
                              defaultValue: item.contentValues[index1][index2][item4][item5],
                              onChange: (e) => {
                                setDescription(e.target.value);
                                setLocation(`${item.pageName}-${section}-${item2}-${item4}-${item5}`);
                              },
                              onClick: () => setLocation(`${item.pageName}-${section}-${item2}-${item4}-${item5}`)
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              type: "submit",
                              className: "w-20",
                              disabled: description === "" || description === item.contentValues[index1][index2][item4][item5],
                              children: "Save"
                            }
                          )
                        ]
                      }
                    ) })
                  ]
                },
                `item-${index1}-${index2}-${index3}-${index4}`
              ))) }, `accordion-object-${index2}`) : /* @__PURE__ */ jsxs("form", { className: "flex flex-col items-center p-5 justify-center w-full gap-1.5", onSubmit: (e) => {
                e.preventDefault();
                handleSubmit(e);
              }, children: [
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    className: "w-100",
                    id: "message-3",
                    defaultValue: item.contentValues[index1][index2],
                    onChange: (e) => {
                      setDescription(e.target.value);
                      setLocation(`${item.pageName}-${section}-${item2}`);
                    },
                    onClick: () => setLocation(`${item.pageName}-${section}-${item2}`)
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    className: "w-20",
                    disabled: description === "" || description === item.contentValues[index1][index2],
                    children: "Save"
                  }
                )
              ] }) })
            ] }, `item1-${index1}-${index2}`) }, `accordion-${index2}`)) })
          ] }, `section-${i}-${index1}`)) })
        ] }, i);
      }
    )
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AdminNominations = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<div class="hero" data-astro-cid-egeksomx> <div class="table-container" data-astro-cid-egeksomx> <h1 class="title font-bold" data-astro-cid-egeksomx>Nominations</h1> <div class="table-wrapper" data-astro-cid-egeksomx> <table class="nominations-list" data-astro-cid-egeksomx> <thead data-astro-cid-egeksomx> <tr data-astro-cid-egeksomx> <th data-astro-cid-egeksomx>Count</th> <!-- <th>First Name</th>
                        <th>Last Name</th>
                        <th>Designation</th>
                        <th>Contact</th> --> <th data-astro-cid-egeksomx>Full Name</th> <th data-astro-cid-egeksomx>Contact Number</th> <th data-astro-cid-egeksomx>Shortlisted?</th> <th data-astro-cid-egeksomx>Social</th> <th data-astro-cid-egeksomx>Email</th> <th data-astro-cid-egeksomx>Role</th> <th data-astro-cid-egeksomx>Category</th> <th data-astro-cid-egeksomx>Q1</th> <th data-astro-cid-egeksomx>Q2</th> <th data-astro-cid-egeksomx>Q3</th> <th data-astro-cid-egeksomx>Address</th> <th data-astro-cid-egeksomx>School</th> <th data-astro-cid-egeksomx>School Link</th> </tr> </thead> <tbody id="nomination-table-body" data-astro-cid-egeksomx></tbody> </table> </div> </div> </div>  <script type="module">
    import { initNominations } from '/src/components/Nominations/view_nomination_data.js';
    initNominations();
<\/script>`])), maybeRenderHead());
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/components/Nominations/Admin_Nominations.astro", void 0);

function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}

function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

function DialogDemo() {
  const [newsCard, setNewsCard] = useState({
    title: "",
    date: "",
    description: "",
    image: "",
    alt: "",
    link: "",
    category: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsCard((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newsCard)
      });
      if (!response.ok) {
        throw new Error("Failed to update news");
      }
      console.log("News updated successfully");
    } catch (error) {
      console.error(error);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", className: "p-5", children: "Add News" }) }),
    /* @__PURE__ */ jsx(DialogContent, { className: " mwsm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-center", children: "Add News Card" }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-center", children: "Enter the details for the news card below." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "category", className: "text-right", children: "Category" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "category",
              name: "category",
              value: newsCard.category,
              onChange: handleChange,
              className: "col-span-3 border rounded px-2 py-1",
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select category" }),
                /* @__PURE__ */ jsx("option", { value: "latest-news", children: "latest-news" }),
                /* @__PURE__ */ jsx("option", { value: "latest-news", children: "latest-events" }),
                /* @__PURE__ */ jsx("option", { value: "latest-news", children: "latest-webinar" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "title", className: "text-right", children: "Title" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              name: "title",
              value: newsCard.title,
              onChange: handleChange,
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "date", className: "text-right", children: "Date" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "date",
              name: "date",
              value: newsCard.date,
              onChange: handleChange,
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", className: "text-right", children: "Description" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "description",
              name: "description",
              value: newsCard.description,
              onChange: handleChange,
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "image", className: "text-right", children: "Image URL" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "image",
              name: "image",
              value: newsCard.image,
              onChange: handleChange,
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "alt", className: "text-right", children: "Alt Text" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "alt",
              name: "alt",
              value: newsCard.alt,
              onChange: handleChange,
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "link", className: "text-right", children: "Link" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "link",
              name: "link",
              value: newsCard.link,
              onChange: handleChange,
              className: "col-span-3",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { className: "sm:justify-center", children: /* @__PURE__ */ jsx(Button, { type: "submit", children: "Save News Card" }) })
    ] }) })
  ] });
}

const TemplateSelect = ({ templateData, selectedIndex }) => {
  const handleChange = async (e) => {
    const idx = Number(e.target.value);
    console.log("Changed index!", idx);
    await fetch("/api/update-selected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIndex: idx })
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "inline-block relative w-64", children: [
    /* @__PURE__ */ jsx(
      "select",
      {
        id: "myComboBox",
        className: "w-full px-10 py-2 rounded-lg border border-violet-300 shadow-md bg-gradient-to-r from-violet-100 to-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition duration-200 appearance-none cursor-pointer",
        value: selectedIndex,
        onChange: handleChange,
        children: templateData.map((page, idx) => /* @__PURE__ */ jsx(
          "option",
          {
            value: idx,
            className: "bg-white text-violet-800 hover:bg-violet-100 transition-colors",
            children: page
          },
          page
        ))
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-violet-500", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) }) })
  ] });
};

const $$Astro = createAstro();
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const pageDetails = await getPageDetails();
  const data = await fetchPageContent("News");
  data.newsContent;
  const templateData = await getData();
  const accessToken = Astro2.cookies.get("sb-access-token");
  const refreshToken = Astro2.cookies.get("sb-refresh-token");
  Astro2.response.headers.set("Cache-Control", "no-store");
  if (!accessToken || !refreshToken) {
    return Astro2.redirect("/login");
  }
  let session;
  try {
    session = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value
    });
    if (session.error) {
      Astro2.cookies.delete("sb-access-token", {
        path: "/"
      });
      Astro2.cookies.delete("sb-refresh-token", {
        path: "/"
      });
      return Astro2.redirect("/login");
    }
  } catch (error) {
    Astro2.cookies.delete("sb-access-token", {
      path: "/"
    });
    Astro2.cookies.delete("sb-refresh-token", {
      path: "/"
    });
    return Astro2.redirect("/login");
  }
  session.data.user?.email;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Erovoutika Dubai - Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-violet-800 w-full h-20"></div> <div class="flex flex-col justify-center items-center mx-60 w-auto h-auto"> <div class="flex justify-end gap-4 text-center my-5 w-full"> ${renderComponent($$result2, "TemplateSelect", TemplateSelect, { "templateData": templateData, "selectedIndex": getSelectedIndex(), "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/admin/TemplateSelect.tsx", "client:component-export": "default" })} <button id="toggleBannerButton" class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
Toggle Banner
</button> ${renderComponent($$result2, "DialogDemo", DialogDemo, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/admin/newsForm", "client:component-export": "DialogDemo" })} <form action="/api/auth/signout"> <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Sign out</button> </form> </div> ${renderComponent($$result2, "Accordion", Accordion, { "pageDetails": pageDetails, "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/admin/Accordion", "client:component-export": "Accordion" })} ${renderComponent($$result2, "Admin_Nominations", $$AdminNominations, {})} </div> ` })}`;
}, "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/admin.astro", void 0);

const $$file = "C:/Users/Krishann/Desktop/Robo-combined/international/src/pages/admin.astro";
const $$url = "/international/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
