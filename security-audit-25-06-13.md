# Security Audit of Dependencies — Frontend Project

## Part 1. Audit Objective

This audit was conducted to assess the security of all dependencies used in the frontend part of the project. The primary goal is to identify potential vulnerabilities, evaluate supply chain attack risks, and examine the likelihood of zero-day vulnerabilities.

## Part 2. General Project State

    •	package-lock.json is used — ensuring version pinning and protection against unexpected updates
    •	Dependabot Alerts are enabled (GitHub Security → Dependabot)
        The same vulnerabilities were reported as by manual npm audit
    •	DevDependencies are not included in the production build

**npm audit results**
As of the audit date: 13.06.2025, 4 vulnerabilities were detected:
• react-router-dom (via react-router) — 2 high-severity issues:
o GHSA-cpj6-fhp6-mr6j
o GHSA-f46r-rw29-r322
• vite — moderate severity:
o GHSA-859w-5945-r5v3
• brace-expansion (within eslint/typescript-eslint) — low severity:
o GHSA-v6h2-p8h4-qcjw

**Actions taken:**
• Ran npm audit fix
• Upgraded:
o vite to a safe version ≥ 6.3.4
o react-router-dom to 7.6.2
o brace-expansion was transitively updated via @typescript-eslint

**All known CVEs were resolved as of the audit date.**

## Part 3. Zero-Day Vulnerability Assessment Methodology

Since zero-day vulnerabilities do not have public CVEs and are not detected by standard tools (such as npm audit or Snyk), we assessed the risk of each dependency using the following criteria:
• Presence of harmful practices in the codebase (e.g., install scripts, eval, Function, dynamic require, telemetry/analytics)
• Behavior analysis via Socket.dev: potentially dangerous APIs, suspicious activity or lack of transparency; cross-checked with GitHub reputation
• Supply chain risk: number of maintainers and their activity, frequency of releases, level of open-source contribution and community involvement
• Presence of sub-dependencies and their history of vulnerabilities

## Part 4. Audit of Production Dependencies

### I. @mobily/ts-belt

#### 1. General Info

    •	Purpose: Functional programming library for TypeScript, offering utilities like Option, Result, pipe, match.
    •	Version: ^3.13.1 (latest, published 3 years ago)
    •	Weekly downloads (npm): ~133,000
    •	Dependencies: 0

#### 2. Project Activity

    •	Last release: Dec 2023 (6+ months ago)
    •	Maintainers: 1 active maintainer
    •	Activity: Marked as "unstable" by Socket.dev
    •	GitHub: 1.7k stars

#### 3. Security

    •	npm audit: No known CVEs
    •	Socket.dev: no install scripts, no eval, no telemetry, minimal attack surface, 1 maintainer, long release cycle

#### 4. Recommendations

    •	Consider wrapping or replacing in the future for large-scale or long-term projects needing FP integration (e.g., effect, io-ts).

#### 5. Conclusion

Safe to use now. Long-term support may be limited due to single maintainer. Not ideal for critical or enterprise use.

---

### II. axios

#### 1. General Info

    •	Purpose: HTTP client for browser and Node.js. Supports requests, interceptors, headers, error handling, etc.
    •	Version: ^1.8.4 (latest: 1.9.0,  published 24.04.25)
    •	Weekly downloads: 62M+ — highly popular
    •	Dependencies: follow-redirects, form-data, proxy-from-env

#### 2. Project Activity

    •	Regular updates
    •	8+ maintainers, 270+ contributors
    •	GitHub: 103k stars
    •	1.9.0 changelog: Bug fixes and minor improvements (no breaking changes)

#### 3. Security

    •	npm audit: No active CVEs in 1.8.4 or 1.9.0
    •	Snyk: Past vulnerabilities (e.g., SSRF) — patched
    •	Socket.dev: no telemetry or dynamic code, 3 dependencies — must monitor,  popular → potential supply-chain target

#### 4. Recommendations

    •	Upgrade to 1.9.0 for bug fixes
    •	Monitor form-data, follow-redirects

#### 5. Conclusion

Actively maintained and secure. Strong community support. Recommended for use.

---

### III. formik

#### 1. General Info

    •	Purpose: Form state management for React — values, validation, submission, Yup support.
    •	Version: ^2.4.6 (published ~1 year ago)
    •	Weekly downloads: 2.88M+
    •	Dependencies: @types/hoist-non-react-statics, deepmerge, hoist-non-react-statics, lodash, lodash-es, react-fast-compare, tiny-warning, tslib

#### 2. Project Activity

    •	Last release: 1+ year ago
    •	Maintainer: 1 main maintainer
    •	Socket.dev: “Not healthy” — inactivity (GitHub issues discuss lack of support (“Is Formik dead?”))

#### 3. Security

    •	npm audit: No current CVEs in formik
    •	Socket.dev: no telemetry or eval, depends on: lodash (known historical CVEs), deepmerge (prototype pollution)

#### 4. Recommendations

    •	If kept:
        o	Regularly run npm audit
        o	Monitor lodash, deepmerge
    •	Preferably migrate to react-hook-form — smaller footprint, better React 18+ compatibility

#### 5. Conclusion

Safe now, but aging. Carries indirect risk via dependencies.

---

### IV. react

#### 1. General Info

    •	Purpose: Main UI library
    •	Version: ^19.0.0 (latest 19.1.0, 2 months ago)
    •	Weekly downloads: 39M+
    •	Dependencies: 0

#### 2. Project Activity

    •	Highly active (Meta/Facebook)
    •	200k+ GitHub stars
    •	Broad ecosystem (DOM, Native, Concurrent Mode, etc.)

#### 3. Security

    •	No CVEs
    •	Socket.dev: Secure
    •	Large usage = supply-chain risk, but npm & signature-based protection mitigate this

#### 4. Recommendations

None.

#### 5. Conclusion

Top-tier library. Secure, stable, and well-maintained.

---

### V. react-dom

#### 1. General Info

    •	Purpose: Renders React components (browser/SSR)
    •	Version: ^19.0.0 (latest: 19.1.0)
    •	Weekly downloads: ~37M+
    •	Dependencies: scheduler (internal, safe)

#### 2. Project Activity

• Regular releases, synced with react
• Maintained by Meta
• 200k+ GitHub stars

#### 3. Security

• No CVEs
• Socket.dev: Secure
• Monitor scheduler occasionally

#### 4. Recommendations

• None beyond light monitoring

#### 5. Conclusion

Key React component. Secure and stable.

---

### VI. react-router-dom

#### 1. General Info

• Purpose: Routing for React apps
• Version: ^7.6.2 (latest, updated from 7.5.1, after npm audit)
• Weekly downloads: 14.8M+
• Dependencies: react-router (internal)

#### 2. Project Activity

• Regular releases
• Team: Remix-run
• GitHub: 55k+ stars

#### 3. Security

• No CVEs (after npm audit, 13.06.2025)
Before version 7.5.1, the following vulnerabilities were identified:
o GHSA-cpj6-fhp6-mr6j — React Router allows pre-render data spoofing
o GHSA-f46r-rw29-r322 — React Router allows a Denial of Service (DoS) via cache poisoning
Both vulnerabilities were resolved in version 7.6.2.
• Socket.dev: no install scripts, telemetry, eval
• Highly popular = supply-chain risk

#### 4. Recommendations

Keep this dependency up to date, as routing is a critical part of application security.

#### 5. Conclusion

react-router-dom is a securely maintained and widely adopted library for React projects. The current version contains no known CVEs, and previously discovered vulnerabilities were addressed after the audit.

---

### VII. react-toastify

#### 1. General Info

• Purpose: Toast notifications
• Version: ^11.0.5 (latest: 11.1.0, 4 months ago)
• Weekly downloads: 2.4M+
• Dependencies: clsx

#### 2. Project Activity

• Moderately active
• GitHub: 13k+ stars

#### 3. Security

• No CVEs
• Socket.dev: Secure
• clsx = popular, but no known issues

#### 4. Recommendations

• Monitor clsx occasionally

#### 5. Conclusion

Well-maintained, widely used. Trusted.

---

### VIII. vite-plugin-svgr

#### 1. General Info

• Purpose: Load SVG as React components in Vite
• Version: ^4.3.0 (latest, 7 months ago)
• Weekly downloads: 1.76M+
• Dependencies: @svgr/core, @svgr/plugin-jsx, @rollup/pluginutils

#### 2. Project Activity

• Last release: 7 months ago
• GitHub: active, but solo maintainer
• Socket.dev: 0 open-source collaborators

#### 3. Security

• No CVEs
• Dependencies widely used (SVGR stack)
• No dynamic imports, telemetry, or install scripts
• Monitor @svgr/\* updates

#### 4. Recommendations

• Watch maintainer and update cycle
• Consider alternatives if abandoned

#### 5. Conclusion

Trusted in Vite ecosystem, but single maintainer.

---

### IX. zod

#### 1. General Info

• Purpose: TypeScript-first schema validation
• Version: ^3.25.36 (latest: 3.25.63, June 12, 2025)
• Weekly downloads: 31M+
• Dependencies: 0

#### 2. Project Activity

• Very active: new release every few days
• GitHub: 37k+ stars
• Maintainer: 1 active

#### 3. Security

• No CVEs
• Socket.dev: Secure
• Single maintainer = minor risk

#### 4. Recommendations

None.

#### 5. Conclusion

Modern, widely adopted validation library. Secure and recommended.

### Part 5. Audit of devDependencies

#### 1. General Overview

This project includes several devDependencies used exclusively during development, build, linting, and styling stages. Key devDependencies include:
• eslint and plugins (@typescript-eslint/_, eslint-plugin-_)
• typescript
• vite and @vitejs/plugin-react
• tailwind and postcss

#### 2. Security Evaluation

• A vulnerability was previously identified in brace-expansion (GHSA-v6h2-p8h4-qcjw – Regular Expression Denial of Service), used transitively via ESLint-related packages.
• The issue was resolved by running npm audit fix, which upgraded affected packages to secure versions.
• No information that the listed packages contain install scripts, eval, telemetry, or dynamic imports.
• As of the audit date, no active CVEs remain according to npm audit, Snyk Advisor, and Socket.dev.
• No install scripts, use of eval, telemetry, or dynamic imports were found in any of the current devDependencies.
• package-lock.json locks all versions, including transitive devDependencies, reducing supply-chain risk and ensuring build reproducibility.
• Tools like ESLint and Vite can access source code and build processes — timely updates are crucial, even if not shipped to production.

#### 3. Recommendations

• Maintain regular updates of linting, build, and development tools.
• Especially monitor for CVEs in packages like eslint, vite, and typescript which have broad access to the development environment.
• Keep package-lock.json committed and up to date to minimize risks from transitive updates.

#### 4. Conclusion

While devDependencies do not directly impact the production bundle, they are part of the critical development and build pipeline. The resolved vulnerability in brace-expansion highlights the need for continuous monitoring. With proper auditing and update practices, devDependencies pose minimal security risks.

---

### Part 6. Audit of Zero-Day Vulnerabilities

None of the dependencies showed signs of zero-day vulnerabilities or malicious behavior. However, some packages require additional monitoring due to supply-chain risks:
-@mobily/ts-belt (1 maintainer, low release frequency)
-formik (1 active maintainer, aging repo)
-vite-plugin-svgr (no public maintainers on Socket.dev)
-zod (1 maintainer, but highly active)

Although all known CVEs were addressed during the audit (see Part 2), these packages merit regular monitoring due to their maintenance structure.

### Part 7. General Security Recommendations

    To maintain long-term package security across the entire project:

    1. Pin exact versions in package.json to avoid uncontrolled updates (use 1.2.3, not ^1.2.3)
    2. Run npm audit before each deployment
    3. Never add a new dependency without first checking it on Socket.dev
    4. Integrate security checks into CI/CD (e.g., via npm audit, snyk test)
    5. Enable automated monitoring tools:
        o GitHub Dependabot
        o Snyk
        o Socket.dev
        o GitHub Advanced Security
    6. Track and version package-lock.json in Git — required for build reproducibility
    7. Evaluate alternatives for low-maintenance packages:
        o Consider migrating from formik to react-hook-form
        o Reassess ts-belt if ecosystem demands grow
        o Monitor vite-plugin-svgr for signs of deprecation

### Part 8. Summary

• All production and development dependencies passed the security audit and meet current standards as of 13.06.2025.
• All known CVEs identified during the audit have been addressed through upgrades (vite, react-router-dom, and transitive dependencies).
• No signs of malicious behavior (install scripts, eval, telemetry, dynamic imports) were found.
• A few packages — formik, @mobily/ts-belt, and vite-plugin-svgr — require ongoing monitoring due to limited maintainership or low update frequency.
• Supply-chain risks are minimized through locked dependencies (package-lock.json) and the absence of runtime-impacting dev tools.

---

### Part 9. Proposed Solution to Reduce Risk — Replace formik with react-hook-form

#### 1. Motivation for Replacement

Current form-handling library — Formik — poses multiple long-term risks:
• Last update was over a year ago
• Has 8 dependencies, some historically vulnerable (e.g., lodash, deepmerge)
• Low project activity, maintained by a single active maintainer
• Does not support modern React features (Concurrent Mode, Suspense, React 18/19 compatibility)
In contrast, react-hook-form offers a lightweight, modern, and secure alternative:
• Designed for modern React paradigms
• Zero dependencies
• Actively maintained and widely adopted

---

#### 2. Security Audit of react-hook-form

General Information:
• Version: ^7.51.5 (Latest: 7.57.0, published recently)
• Weekly Downloads: 11M+
• GitHub: 43k stars, 500+ contributors
• Maintenance: Frequent releases (every 1–2 weeks)
• Ecosystem: Strong integration with Zod, Yup, TanStack Form, React Query
Security Status:
• No known CVEs (via npm audit, Snyk Advisor)
• No install scripts, telemetry, or use of eval (via Socket.dev)
• Fully static imports
Zero-day Vulnerability Assessment:
• No signs of suspicious activity or risky patterns
• Smaller attack surface due to zero dependencies
• Transparent and active maintenance — reduces likelihood of unnoticed zero-day vectors

---

#### 3. Key Benefits

• Zero dependencies — smaller bundle size and fewer transitive risks
• Modern React integration — full support for Concurrent Mode, StrictMode, Suspense
• Advanced API — declarative hooks: useForm, useController, useFormContext
• Native support for validation schemas (Zod, Yup) via @hookform/resolvers
• Works well with SSR, async validation, and React Query-based workflows
• Ecosystem alignment — more maintainable architecture across the app

---

#### 4. Migration Plan

• Use react-hook-form exclusively for new forms
• Start with a small existing form as a Proof of Concept (POC)
• Add validation adapter using @hookform/resolvers (safe)
• Gradually migrate all forms, starting with those easiest to isolate
• Remove formik entirely after migration is complete

---

#### 5. Conclusion

react-hook-form is a modern, secure, and well-supported solution that meets and exceeds Formik’s capabilities with lower maintenance risks.
It:
• Passes all security checks (no CVEs, no eval/install scripts)
• Has minimal supply-chain footprint
• Is actively maintained and scales well with modern frontend practices

Recommended for gradual migration in production environments to ensure long-term security, ecosystem stability, and improved developer experience.
