import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recomind — Discover products that fit you",
    short_name: "Recomind",
    description:
      "An intelligent e-commerce platform with personalized product recommendations powered by AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F9F7",
    theme_color: "#477A57",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
