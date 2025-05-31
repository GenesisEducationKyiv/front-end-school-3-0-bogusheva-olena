# Architecture Decision Record

### ADR 1: Validation of cover image URLs to prevent injection, malicious resources, and broken UI

---

### Context

In the current version of the application, users can add a custom cover image for a track by entering an image URL. However, these URLs are not validated, which introduces several risks:

- Inserting dangerous URIs like `javascript:`, `data:`, or `file://` can lead to XSS attacks
- External hosts may track user IP addresses or inject tracking pixels
- Broken or unsupported image formats may cause visual issues in the UI
- Masking malicious files as images (e.g., `.svg` or `.jpg` with embedded `<script>`)
- Using certain domains may open the door to SSRF if the backend later fetches the image
- Without a Content-Security-Policy, external images can be loaded from any origin, increasing the risk of tracking or injection.

At the time of writing, file upload from the user's local device is not yet implemented but is planned for the future.

---

### Decision

We plan to implement client-side validation for the `coverImage` field, using existing `Formik` and `Zod` features without adding new libraries.

#### For image URLs:
- Must be a valid URL (`new URL(...)`)
- Only `http` or `https` schemes are allowed
- Must end with an allowed extension: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Host must be in a predefined whitelist (e.g., `images.unsplash.com`, `cdn.pixabay.com`)
- Image dimensions must be validated via the browser’s Image object before form submission

- If the value is invalid:
  - The user sees a validation message
  - The form is not submitted, and the request is not sent
  - A default image will be used in the UI via an onError handler fallback.

#### For local file upload (planned):
- MIME type must start with `image/`
- Extension must be allowed
- File size must not exceed a specified limit (e.g., 5 MB)
- If invalid:
  - The user sees an explanation
  - The form is not submitted

Due to browser limitations, it is not feasible to reliably validate the actual MIME type, byte content, or file signature of externally hosted image URLs. These checks must be handled on the server.

#### For administrators (planned):
- An interface will allow expanding the whitelist via PATCH requests
- Only users with the `admin` role will be authorized to manage allowed image sources

---

### Rationale

We selected client-side validation as the first layer of protection for the following reasons:

- **Project scope:** The decision is made by the frontend team, without access to backend implementation
- **UX-focused:** Users receive immediate feedback without waiting for a server response
- **Faster and more cost-effective:** A lightweight approach that prevents approximately **70–80% of the most common unsafe or invalid inputs** (e.g., bad URLs, disallowed domains, incorrect formats)

Currently, we support only URLs as input, so the risk level is moderate.
However, we plan to support **local image file uploads**, which introduce significantly more risks. 

We also plan to propose a strict Content-Security-Policy header to the backend team to control external image sources (`img-src` and `default-src`).

Therefore, once backend work begins, full server-side validation will be required to ensure complete protection. It should:

- Repeat URL, extension, and MIME checks
- Reject spoofed Content-Type headers
- Validate actual file signatures using a library like `file-type`
- Re-encode images with `sharp` to sanitize content
- Fetch images through a proxy/CDN to avoid SSRF risks
- Log all rejected inputs and keep the domain whitelist updated.

This decision introduces a first layer of protection on the frontend but must be complemented by future backend validation to ensure full security.

---

### Status:
Planned

---

### Consequences

#### ✅ Positive:
- Improved security (against injections, tracking, and misuse)
- Improved UI stability and user feedback
- No immediate backend changes required; current solution is frontend-only
- Flexible: ready for future extensions (local file upload, role-based access)

#### ⚠️ Negative:
- **Client-side only:** does not protect against direct API calls
- **Whitelist limits user freedom:** list must be maintained and restricts image sources
- **MIME validation is not foolproof:** malicious files can have valid extensions
- **Whitelist management must be restricted to admin users** to avoid abuse

---

### Limitations

- This is not a complete security solution, only the first layer of protection in the UI
- MIME type and file extension validation cannot guarantee the file is safe
- An attacker can bypass the UI entirely and send malicious data directly to the API unless server-side checks are added

---

### Alternatives considered

- Using an image proxy or CDN (e.g., re-hosting with `sharp`) to sanitize external content
- Storing local copies of external images instead of referencing third-party URLs directly

These alternatives provide stronger security but require backend support and are outside the scope of the current frontend-only solution. Once backend work begins, they should be reconsidered.
