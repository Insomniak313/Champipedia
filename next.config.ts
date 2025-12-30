import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nécessaire pour Prisma en environnement serverless:
  // le client généré vit dans `node_modules/.prisma/client` et peut être omis du bundle
  // si le file tracing ne l'inclut pas explicitement.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**", "./node_modules/@prisma/client/**"],
  },
};

export default nextConfig;
