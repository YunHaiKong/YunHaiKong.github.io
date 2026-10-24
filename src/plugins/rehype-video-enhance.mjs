import fs from "node:fs";
import path from "node:path";

const META_DIR = path.resolve(process.cwd(), "public/assets/videos/meta");
const cache = new Map();

function loadMeta(id) {
	if (cache.has(id)) return cache.get(id);
	let meta = null;
	const file = path.join(META_DIR, `${id}.json`);
	if (fs.existsSync(file)) {
		try {
			meta = JSON.parse(fs.readFileSync(file, "utf8"));
		} catch {
			meta = null;
		}
	}
	cache.set(id, meta);
	return meta;
}

function esc(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function clock(sec) {
	const total = Math.max(0, Math.round(sec));
	return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function chaptersHtml(meta) {
	const buttons = meta.chapters
		.map(
			(ch) => `<button type="button" class="hr-chapter" data-video-seek data-video="${esc(meta.id)}" data-start="${ch.start}" aria-label="跳转到 ${clock(ch.start)} ${esc(ch.title)}">
<span class="hr-chapter-time">${clock(ch.start)}</span><span class="hr-chapter-title">${esc(ch.title)}</span>
</button>`,
		)
		.join("");
	return `<div class="hr-chapters" data-chapters="${esc(meta.id)}" aria-label="视频章节">
<div class="hr-chapters-head"><span>章节导航</span><span class="hr-chapters-count">${meta.chapters.length} 段 · ${clock(meta.durationSec)}</span></div>
<div class="hr-chapters-grid">${buttons}</div>
</div>`;
}

function transcriptHtml(meta) {
	const rows = meta.chapters
		.map((ch, index) => {
			const text = meta.scenes[index]?.narration ?? "";
			return `<p class="hr-transcript-row"><button type="button" class="hr-ts" data-video-seek data-video="${esc(meta.id)}" data-start="${ch.start}">${clock(ch.start)}</button><span>${esc(text)}</span></p>`;
		})
		.join("");
	return `<details class="hr-transcript">
<summary><span>完整文字稿</span><span class="hr-transcript-hint">点击时间戳跳转 · <a href="/assets/videos/meta/${esc(meta.id)}.vtt" download>下载 VTT</a> · <a href="/assets/videos/meta/${esc(meta.id)}.transcript.txt" download>下载 TXT</a></span></summary>
<div class="hr-transcript-body">${rows}</div>
</details>`;
}

function enhanceTag(tag) {
	const src = tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "";
	const id = src.match(/\/assets\/videos\/([\w-]+)\.mp4/)?.[1];
	if (!id) return tag;
	const meta = loadMeta(id);
	if (!meta) return tag;

	const open = tag.match(/^<video\b[^>]*>/)?.[0] ?? "";
	if (!open) return tag;
	const fallback = tag.slice(open.length, tag.lastIndexOf("</video>")) || "您的浏览器不支持 HTML5 视频播放，请升级浏览器。";
	const attrs = open
		.slice(6, -1)
		.replace(/\s+src="[^"]*"/, "")
		.replace(/\s+data-(desktop|mobile)-src="[^"]*"/g, "")
		.trim();

	const video = `<video ${attrs} data-video-id="${esc(id)}" data-desktop-src="${esc(meta.videoPath ?? meta.video)}" data-mobile-src="${esc(meta.mobilePath ?? meta.mobile)}" playsinline>
${fallback}<track kind="captions" src="/assets/videos/meta/${esc(id)}.vtt" srclang="zh" label="中文字幕">
</video>`;

	return `<div class="hr-video-block" data-video-block="${esc(id)}">
${video}
${chaptersHtml(meta)}
${transcriptHtml(meta)}
</div>`;
}

export default function rehypeVideoEnhance() {
	return (tree) => {
		const stack = [tree];
		while (stack.length) {
			const node = stack.pop();
			if (!node || !Array.isArray(node.children)) continue;
			for (const child of node.children) {
				if (child.type === "raw" && typeof child.value === "string" && child.value.includes("<video")) {
					child.value = child.value.replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, enhanceTag);
				}
				stack.push(child);
			}
		}
	};
}
