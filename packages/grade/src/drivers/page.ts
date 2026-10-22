/**
 * The page driver: Chromium through Playwright, over a file:// page (the
 * html reference) or a fragment wrapped in a shell with the theme. It finds
 * the component's instances, reaches each state the spec names (by input
 * for hover, focus-visible and active; by the vocab's attribute for the
 * rest) and reads computed styles, so the checks never touch Playwright.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import { type Browser, chromium, type Locator, type Page } from "playwright";

/** Computed styles for the root and each `data-slot` part under it. */
export type Snapshot = Record<string, Record<string, string>>;

/** The properties a state treatment can live in. */
export const TREATMENT_PROPERTIES = [
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-top-width",
  "border-top-style",
  "outline-style",
  "outline-width",
  "outline-color",
  "outline-offset",
  "box-shadow",
  "opacity",
  "transform",
  "translate",
  "scale",
  "text-decoration-line",
  "text-decoration-color",
  "font-weight",
  "filter",
  "cursor",
];

/** Properties whose change is a colour change and nothing else. */
export const COLOUR_PROPERTIES = new Set([
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
]);

/** Properties that are not a visual treatment: a cursor change alone is no state. */
export const NON_VISUAL_PROPERTIES = new Set(["cursor"]);

/** How long to let a transition settle before reading styles. */
const SETTLE_MS = 320;

export class PageDriver {
  readonly page: Page;
  private browser: Browser;

  private constructor(browser: Browser, page: Page) {
    this.browser = browser;
    this.page = page;
  }

  /** Open an html file over file://. */
  static async open(file: string): Promise<PageDriver> {
    const browser = await chromium.launch();
    const page = await browser.newPage({ colorScheme: "light" });
    await page.goto(pathToFileURL(file).href);
    return new PageDriver(browser, page);
  }

  /**
   * Render a fragment (an example or an anti-example) inside a shell that
   * links the theme and the given stylesheets, so it has the roles it reads.
   */
  static async fragment(
    html: string,
    styles: string[],
    theme: string,
  ): Promise<PageDriver> {
    const browser = await chromium.launch();
    const page = await browser.newPage({ colorScheme: "light" });
    const links = [theme, ...styles]
      .map((s) => `<link rel="stylesheet" href="${pathToFileURL(s).href}">`)
      .join("\n");
    await page.setContent(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>fragment</title>${links}</head><body><main>${html}</main></body></html>`,
      { waitUntil: "load" },
    );
    return new PageDriver(browser, page);
  }

  async close() {
    await this.browser.close();
  }

  /** Every element matching the selector, in document order. */
  locate(selector: string): Promise<Locator[]> {
    return this.page.locator(selector).all();
  }

  /**
   * Every element matching the selector, each pinned by its own attribute
   * so the locator survives DOM changes around it (a helper inserted, a
   * part added) that would shift an index-based one.
   */
  async pin(selector: string): Promise<Locator[]> {
    const n = await this.page
      .locator(selector)
      .evaluateAll(
        (els) =>
          els.map((e, i) => e.setAttribute("data-lq-instance", String(i)))
            .length,
      );
    return Array.from({ length: n }, (_, i) =>
      this.page.locator(`[data-lq-instance="${i}"]`),
    );
  }

  async count(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }

  wait(ms = SETTLE_MS) {
    return this.page.waitForTimeout(ms);
  }

  /** Computed treatment properties of the element and its parts. */
  async snapshot(el: Locator): Promise<Snapshot> {
    await this.wait();
    return el.evaluate((root, props) => {
      const read = (e: Element) => {
        const cs = getComputedStyle(e);
        return Object.fromEntries(
          props.map((p) => [p, cs.getPropertyValue(p)]),
        );
      };
      const out: Record<string, Record<string, string>> = { root: read(root) };
      for (const part of root.querySelectorAll("[data-slot]"))
        out[part.getAttribute("data-slot") ?? ""] = read(part);
      return out;
    }, TREATMENT_PROPERTIES);
  }

  /** The page's background behind the element: the nearest opaque ancestor background. */
  pageBackground(el: Locator): Promise<string> {
    return el.evaluate((root) => {
      let e: Element | null = root.parentElement;
      while (e) {
        const bg = getComputedStyle(e).backgroundColor;
        if (
          bg &&
          !/^(rgba?\(.*,\s*0\)|transparent)$/.test(bg) &&
          !/\/\s*0\)$/.test(bg)
        )
          return bg;
        e = e.parentElement;
      }
      return "rgb(255, 255, 255)";
    });
  }

  /** Move the pointer over the element, run `fn`, move it away. */
  async hover<T>(el: Locator, fn: () => Promise<T>): Promise<T> {
    await el.hover();
    try {
      return await fn();
    } finally {
      await this.page.mouse.move(0, 0);
      await this.wait();
    }
  }

  /** Hold the pointer down on the element, run `fn`, release. */
  async press<T>(el: Locator, fn: () => Promise<T>): Promise<T> {
    await el.hover();
    await this.page.mouse.down();
    try {
      return await fn();
    } finally {
      await this.page.mouse.up();
      await this.page.mouse.move(0, 0);
      await this.wait();
    }
  }

  /**
   * Reach the element with the keyboard, so `:focus-visible` matches: a
   * throwaway control is focused before it and Tab moves on. Returns false
   * when Tab did not land on the element (it is not focusable).
   */
  async keyboardFocus<T>(
    el: Locator,
    fn: (landed: boolean) => Promise<T>,
  ): Promise<T> {
    // A span, not a button, so it never matches a selector the instances were found by.
    await el.evaluate((root) => {
      const helper = document.createElement("span");
      helper.id = "__lq_focus_helper";
      helper.tabIndex = 0;
      root.before(helper);
      helper.focus();
    });
    await this.page.keyboard.press("Tab");
    const landed = await el.evaluate((root) => document.activeElement === root);
    try {
      return await fn(landed);
    } finally {
      await this.page.evaluate(() => {
        document.getElementById("__lq_focus_helper")?.remove();
        (document.activeElement as HTMLElement | null)?.blur?.();
      });
      await this.wait();
    }
  }

  /**
   * Apply attribute expressions (`disabled`, `aria-busy=true`) to the
   * element, run `fn`, restore what was there. `html` is optional markup
   * prepended inside the element for the duration (a spinner part).
   */
  async withAttributes<T>(
    el: Locator,
    expressions: string[],
    fn: () => Promise<T>,
    html?: string,
  ): Promise<T> {
    const previous = await el.evaluate(
      (root, { expressions, html }) => {
        const prev: Record<string, string | null> = {};
        for (const x of expressions) {
          const [name, value = ""] = x.split("=");
          prev[name] = root.getAttribute(name);
          root.setAttribute(name, value);
        }
        if (html) root.insertAdjacentHTML("afterbegin", html);
        return prev;
      },
      { expressions, html },
    );
    try {
      return await fn();
    } finally {
      await el.evaluate(
        (root, { previous, html }) => {
          for (const [name, value] of Object.entries(previous))
            value === null
              ? root.removeAttribute(name)
              : root.setAttribute(name, value);
          if (html) root.firstElementChild?.remove();
        },
        { previous, html },
      );
      await this.wait();
    }
  }

  /** Count activations of the element while `fn` runs. */
  async countClicks(el: Locator, fn: () => Promise<void>): Promise<number> {
    await el.evaluate((root) => {
      const r = root as HTMLElement & {
        __lqClicks?: number;
        __lqOn?: () => void;
      };
      r.__lqClicks = 0;
      r.__lqOn = () => {
        r.__lqClicks = (r.__lqClicks ?? 0) + 1;
      };
      r.addEventListener("click", r.__lqOn);
    });
    await fn();
    return el.evaluate((root) => {
      const r = root as HTMLElement & {
        __lqClicks?: number;
        __lqOn?: () => void;
      };
      if (r.__lqOn) r.removeEventListener("click", r.__lqOn);
      return r.__lqClicks ?? 0;
    });
  }

  /** The accessible name Playwright computes, or "" when there is none. */
  async accessibleName(el: Locator): Promise<string> {
    const snapshot = await el.ariaSnapshot();
    const m = snapshot.match(/^- [a-z]+ "((?:[^"\\]|\\.)*)"/m);
    return m ? m[1] : "";
  }

  /** Run axe-core on the page with the given tags; returns its violations. */
  async axe(tags: string[]): Promise<AxeViolation[]> {
    const axe = path.join(
      path.dirname(require_resolve("axe-core/package.json")),
      "axe.min.js",
    );
    await this.page.addScriptTag({ path: axe });
    return this.page.evaluate(async (tags) => {
      const a = (window as unknown as { axe: AxeGlobal }).axe;
      const r = await a.run(document, {
        runOnly: { type: "tag", values: tags },
      });
      return r.violations.map((v) => ({
        id: v.id,
        impact: v.impact ?? "",
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => n.target.join(" ")),
      }));
    }, tags);
  }

  /** Emulate a media feature for the rest of the session (or clear it with null). */
  async reducedMotion(on: boolean) {
    await this.page.emulateMedia({
      reducedMotion: on ? "reduce" : "no-preference",
    });
    await this.wait();
  }
}

export interface AxeViolation {
  id: string;
  impact: string;
  help: string;
  helpUrl: string;
  nodes: string[];
}

interface AxeGlobal {
  run(
    context: Document,
    options: { runOnly: { type: "tag"; values: string[] } },
  ): Promise<{
    violations: {
      id: string;
      impact?: string | null;
      help: string;
      helpUrl: string;
      nodes: { target: string[] }[];
    }[];
  }>;
}

import { createRequire } from "node:module";

const require_resolve = createRequire(import.meta.url).resolve;
