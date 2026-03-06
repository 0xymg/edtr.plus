import { getAllPosts } from "./lib/blog.js";
const posts = getAllPosts();
console.log("Total posts found:", posts.length);
posts.forEach(p => console.log("- ", p.title, "(", p.slug, ")"));
