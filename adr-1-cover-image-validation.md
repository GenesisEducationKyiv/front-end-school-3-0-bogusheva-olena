# Architecture Decision Record

### ADR 1: Validation of cover image URLs to prevent injection, malicious resources, and broken UI

---

### Context

In the current version of the application, users can add a custom cover image for a track by entering an image URL. However, these URLs are not validated, which introduces several risks:

- Inserting dangerous URIs like `javascript:`, `data:`, or `file://` can lead to XSS attacks
- External hosts may track user IP addresses or inject tracking pixels
- Broken or unsupported image formats may cause visual issues in the UI
- Masking malicious files as images (e.g., `.svg` or `.jpg` with embedded `<script>`)

At the time of writing, file upload from the user's local device is not yet implemented but is planned for the future.

---

### Decision

We plan to implement client-side validation for the `coverImage` field, using existing `Formik` features without adding new libraries.

#### For image URLs:
- Must be a valid URL (`new URL(...)`)
- Only `http` or `https` schemes are allowed
- Must end with an allowed extension: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Host must be in a predefined whitelist (e.g., `images.unsplash.com`, `cdn.pixabay.com`)
- If the value is invalid:
  - The user sees a validation message
  - The form is not submitted, and the request is not sent
  - A default cover image is used in the UI

#### For local file upload (planned):
- MIME type must start with `image/`
- Extension must be allowed
- File size must not exceed a specified limit (e.g., 5 MB)
- If invalid:
  - The user sees an explanation
  - The form is not submitted

#### For administrators (planned):
- An interface will allow expanding the whitelist via PATCH requests
- Only users with the `admin` role will be authorized to manage allowed image sources

---

### Rationale

We selected client-side validation for the following reasons:

- **Project scope:** The decision is made by the frontend team, without access to backend implementation
- **UX-focused:** Users receive immediate feedback without waiting for a server response
- **Faster and more cost-effective:** A lightweight approach that prevents approximately **70–80% of the most common unsafe or invalid inputs** (e.g., bad URLs, disallowed domains, incorrect formats)

Currently, we support only URLs as input, so the risk level is moderate.
However, we plan to support **local image file uploads**, which introduce significantly more risks. 

Therefore:
server-side validation will be required in the future to provide complete protection.

This decision provides a basic defense that enhances frontend security without affecting the existing backend API.

---

### Status:
Planned

---

### Consequences

#### ✅ Positive:
- Improved security (against injections, tracking, and misuse)
- Improved UI stability and user feedback
- No backend changes required
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
