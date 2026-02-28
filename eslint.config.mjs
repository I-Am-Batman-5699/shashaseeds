import next from "eslint-config-next";

const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "dist/**",
      "src/generated/**",
      "src/**/*X*.tsx",
    ],
  },

  ...next,

  {
    rules: {
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default config;