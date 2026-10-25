type MermaidTheme = "default" | "dark";
type MermaidApi = typeof import("mermaid").default;

let loader: Promise<MermaidApi> | null = null;
let activeTheme: MermaidTheme | null = null;
let seq = 0;

function currentTheme(): MermaidTheme {
	return document.documentElement.classList.contains("dark") ? "dark" : "default";
}

function sourceOf(pre: HTMLElement): string {
	return Array.from(pre.querySelectorAll<HTMLElement>(".ec-line .code"))
		.map((line) => (line.textContent ?? "").replace(/\u200b/g, ""))
		.join("\n")
		.trim();
}

function loadMermaid(): Promise<MermaidApi> {
	if (!loader) {
		loader = import("mermaid").then((mod) => mod.default);
	}
	return loader;
}

function mountSource(pre: HTMLElement): HTMLElement | null {
	const block = pre.closest<HTMLElement>(".expressive-code");
	const parent = block?.parentElement;
	if (!block || !parent) return null;

	const host = document.createElement("div");
	host.className = "mermaid-diagram";
	parent.insertBefore(host, block);

	const details = document.createElement("details");
	details.className = "mermaid-source";
	const summary = document.createElement("summary");
	summary.textContent = "Mermaid 源码";
	details.appendChild(summary);
	parent.insertBefore(details, block);
	details.appendChild(block);

	return host;
}

function normalizeSvgSize(host: HTMLElement) {
	const svg = host.querySelector<SVGSVGElement>("svg");
	const viewBox = svg?.viewBox?.baseVal;
	if (!svg || !viewBox?.width) return;
	svg.style.removeProperty("max-width");
	const width = svg.getAttribute("width");
	if (!width || width === "100%") {
		svg.setAttribute("width", String(Math.round(viewBox.width)));
	}
	if (!svg.getAttribute("height") && viewBox.height) {
		svg.setAttribute("height", String(Math.round(viewBox.height)));
	}
}

async function renderDiagram(pre: HTMLElement, host: HTMLElement, theme: MermaidTheme) {
	if (pre.dataset.mermaidBusy === "1") return;
	pre.dataset.mermaidBusy = "1";
	try {
		const mermaid = await loadMermaid();
		mermaid.initialize({
			startOnLoad: false,
			securityLevel: "strict",
			theme,
			fontFamily:
				"ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Noto Sans SC', sans-serif",
			flowchart: {
				useMaxWidth: false,
				htmlLabels: true,
				curve: "basis",
				wrappingWidth: 420,
				nodeSpacing: 30,
				rankSpacing: 36,
			},
		});
		const { svg } = await mermaid.render(`mermaid-svg-${++seq}`, sourceOf(pre));
		host.innerHTML = svg;
		normalizeSvgSize(host);
		host.dataset.theme = theme;
		host.dataset.state = "ready";
	} catch (error) {
		host.dataset.state = "error";
		if (!host.innerHTML) host.remove();
		console.warn("[mermaid] render failed", error);
	} finally {
		pre.dataset.mermaidBusy = "0";
	}
}

async function renderAll(force = false) {
	const blocks = Array.from(
		document.querySelectorAll<HTMLElement>('pre[data-language="mermaid"]'),
	);
	if (!blocks.length) return;

	const theme = currentTheme();
	for (const pre of blocks) {
		if (pre.dataset.mermaidMounted !== "1") {
			const host = mountSource(pre);
			if (!host) continue;
			pre.dataset.mermaidMounted = "1";
			await renderDiagram(pre, host, theme);
			continue;
		}

		const details = pre.closest<HTMLElement>(".mermaid-source");
		const host = details?.previousElementSibling as HTMLElement | null;
		if (!host || !host.classList.contains("mermaid-diagram")) continue;
		if (force || host.dataset.theme !== theme) {
			await renderDiagram(pre, host, theme);
		}
	}
}

function boot() {
	activeTheme = currentTheme();
	renderAll();
}

new MutationObserver(() => {
	const theme = currentTheme();
	if (theme === activeTheme) return;
	activeTheme = theme;
	renderAll(true);
}).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", boot);
} else {
	boot();
}
document.addEventListener("swup:page:view", boot);
