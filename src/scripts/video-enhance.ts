const mobileQuery = window.matchMedia("(max-width: 768px)");

function applySource(video: HTMLVideoElement) {
	const desktop = video.dataset.desktopSrc;
	const mobile = video.dataset.mobileSrc;
	if (!desktop || !mobile) return;
	const wanted = mobileQuery.matches ? mobile : desktop;
	if (video.dataset.currentSource === wanted) return;
	if (!video.paused && video.currentTime > 0.5) return;
	video.dataset.currentSource = wanted;
	video.src = wanted;
}

function initVideos() {
	for (const video of document.querySelectorAll<HTMLVideoElement>("video[data-video-id]")) {
		applySource(video);
	}
}

function seek(target: Element) {
	const id = (target as HTMLElement).dataset.video;
	const start = Number((target as HTMLElement).dataset.start);
	if (!id || !Number.isFinite(start)) return;
	const video = document.querySelector<HTMLVideoElement>(`video[data-video-id="${CSS.escape(id)}"]`);
	if (!video) return;
	applySource(video);
	video.currentTime = start;
	video.play().catch(() => {});
}

document.addEventListener("click", (event) => {
	const button = (event.target as Element | null)?.closest?.("[data-video-seek]");
	if (!button) return;
	event.preventDefault();
	seek(button);
});

document.addEventListener(
	"timeupdate",
	(event) => {
		const video = event.target as HTMLVideoElement;
		if (video.tagName !== "VIDEO") return;
		const id = video.dataset.videoId;
		if (!id) return;
		const block = video.closest(".hr-video-block");
		if (!block) return;
		for (const button of block.querySelectorAll<HTMLElement>("[data-video-seek]")) {
			const start = Number(button.dataset.start);
			button.classList.toggle("is-past", Number.isFinite(start) && video.currentTime >= start);
		}
		let active: Element | null = null;
		for (const button of block.querySelectorAll<HTMLElement>(".hr-chapter")) {
			const start = Number(button.dataset.start);
			if (Number.isFinite(start) && video.currentTime >= start) active = button;
			button.classList.remove("is-active");
		}
		active?.classList.add("is-active");
	},
	true,
);

mobileQuery.addEventListener("change", initVideos);
document.addEventListener("DOMContentLoaded", initVideos);
document.addEventListener("swup:page:view", initVideos);
