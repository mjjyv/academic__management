# Brand Identity & UI Guidelines: stdmanager

## 1. Brand Essence
**stdmanager** is the digital backbone of the university infrastructure. Our brand represents a **Secure, Integrated, and Data-Driven** ecosystem. The visual language must convey professional reliability, academic excellence, and modern technological efficiency.

---

## 2. Core Color Palette
To maintain a cohesive "Tech-Academic" aesthetic, we utilize a primary blue-centric palette combined with slate neutrals.

| Category | Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Enterprise Blue | `#2563EB` | Primary buttons, active states, branding elements. |
| **Deep Neutral** | Slate 900 | `#0F172A` | Sidebar background, primary headings, dark mode elements. |
| **Accent** | Data Amber | `#F59E0B` | Warning states, pending status, "Edit" actions. |
| **System** | Success Green | `#10B981` | Positive feedback, "Active" status, completed tasks. |
| **Background** | Ghost White | `#F8FAFC` | Main workspace background, canvas area. |

---

## 3. Typography
We prioritize legibility for data-intensive views. The system utilizes a **clean sans-serif stack**.

* **Primary Font:** `Inter` or `System Sans-Serif`.
* **Headings:** Semi-bold to Black weight (Slate 900).
* **Body Text:** Regular weight (Slate 600) for general content; Medium for labels.
* **Monospace:** `Fira Code` or `JetBrains Mono` for IDs, UUIDs, and code snippets in logs.

---

## 4. Logo Guidelines
The logo is a typographic mark: **STD MANAGER**.

* **Logotype:** All-caps, font-weight 900 (Black).
* **Coloring:** "STD" in primary blue, "MANAGER" in white or slate-300 depending on background.
* **Clear Space:** Maintain a minimum padding equal to the height of the letter "S" on all sides.
* **Restrictions:** Do not stretch, apply drop shadows, or use non-brand gradients.

---

## 5. UI/UX Components
All interface elements must follow the **Atomic Design** principle established in the React frontend.

### Buttons
* **Primary:** Solid Enterprise Blue, 8px border-radius, white text.
* **Secondary:** Ghost White background with Slate 200 border.
* **Danger:** Red-50 background with Red-600 text for destructive actions.

### Cards & Modals
* **Shadows:** Utilize Tailwind `shadow-sm` for standard cards and `shadow-2xl` for modals.
* **Radius:** Standardized 12px (`rounded-xl`) or 16px (`rounded-2xl`) for containers.
* **Backdrop:** Modals must use a `black/60` overlay with a `backdrop-blur-sm` effect.

---

## 6. Tone of Voice & Messaging
Our communication should be **Authoritative, Concise, and Helpful**.

* **Terminology:** Use standard IT industry terms (e.g., "Authenticate," "Sync," "Provision," "Endpoint") rather than vague layperson terms.
* **Error Messages:** Avoid "Something went wrong." Use "Validation failed: Student Code is required."
* **Success Feedback:** Acknowledge actions immediately (e.g., "Record successfully persisted").

---

## 7. Imagery & Icons
* **Icons:** Use the `Lucide-React` library. Keep stroke weights consistent at `2px`.
* **Visuals:** Use abstract geometric patterns or high-quality SVG illustrations. Avoid stock photos of students unless specifically required for profile headers.