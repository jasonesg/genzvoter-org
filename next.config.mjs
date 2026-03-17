<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
=======
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: dirname,
  },
>>>>>>> master
};

export default nextConfig;
