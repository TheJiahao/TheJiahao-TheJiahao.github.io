// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Astro Blog";
export const SITE_DESCRIPTION = "Welcome to my website!";
export const SITE_AVATAR = "/assets/avatar.svg";

export const NAVIGATION_LINKS = [
    { href: "/", text: "首页", icon: "i-fluent-emoji-flat-house" },
    { href: "/posts", text: "归档", icon: "i-fluent-emoji-flat-file-cabinet" },
    { href: "/about", text: "关于", icon: "i-fluent-emoji-flat-star" },
];

export const BLOG_IMAGE_WIDTH = 200;
export const BLOG_IMAGE_HEIGHT = BLOG_IMAGE_WIDTH / 1.618;

export const BLOG_IMAGE_PLACEHOLDER = Object.freeze({
    src: "/src/assets/images/cover_placeholder.svg",
    width: BLOG_IMAGE_WIDTH,
    height: BLOG_IMAGE_HEIGHT,
    format: "svg",
});
