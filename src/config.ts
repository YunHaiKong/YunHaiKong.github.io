import type {
	CommentConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "YunHaiKong",
	subtitle: "具身智能 · AI Agent · 工业视觉与工程落地",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/arknights-banner.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "明日方舟 / 音律联觉「昔时我见」", // Credit text to be displayed
			url: "https://prts.wiki/w/%E5%AE%98%E6%96%B9%E5%AE%A3%E4%BC%A0%E5%9B%BE%E4%B8%80%E8%A7%88#2026%E5%B9%B4_%E9%9F%B3%E5%BE%8B%E8%81%94%E8%A7%89", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/favicon/favicon-light-32.png",
			theme: "light",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-light-128.png",
			theme: "light",
			sizes: "128x128",
		},
		{
			src: "/favicon/favicon-light-180.png",
			theme: "light",
			sizes: "180x180",
		},
		{
			src: "/favicon/favicon-light-192.png",
			theme: "light",
			sizes: "192x192",
		},
		{
			src: "/favicon/favicon-dark-32.png",
			theme: "dark",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-dark-128.png",
			theme: "dark",
			sizes: "128x128",
		},
		{
			src: "/favicon/favicon-dark-180.png",
			theme: "dark",
			sizes: "180x180",
		},
		{
			src: "/favicon/favicon-dark-192.png",
			theme: "dark",
			sizes: "192x192",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "项目",
			url: "/projects/",
		},
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/YunHaiKong", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "YunHaiKong",
	bio: "欢迎来到我的个人博客，记录生活与技术！Base 深圳。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/YunHaiKong",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const commentConfig: CommentConfig = {
	enable: true,
	type: "giscus",
	giscus: {
		repo: "YunHaiKong/YunHaiKong.github.io",
		repoId: "R_kgDOU_IG4Q",
		category: "General",
		categoryId: "DIC_kwDOU_IG4c4DHPKp",
		mapping: "pathname",
		strict: false,
		reactionsEnabled: true,
		emitMetadata: false,
		inputPosition: "top",
		theme: "light",
		darkTheme: "noborder_dark",
		lang: "zh-CN",
	},
};
