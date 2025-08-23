# 📬 University Email Management System - Complete Module Plan

This README serves as the **single source of truth** for designing, building, and extending the **Email Management System** for a university-wide web application serving 20,000–30,000+ students and faculty. It includes the finalized system architecture, features, libraries, workflows, and all technical specifications necessary for current and future developers.

---

## 🔥 Project Context & Purpose

The university web platform involves various components like attendance tracking, placement matrix, achievement logging, and profile management. Among these, the **Email Management System** is an independent, API-based microservice responsible for sending highly customizable and secure emails to students, parents, and faculty.

This module will:

* Enable faculty to send personalized or batch emails
* Support attachments, dynamic templates, and CC/BCC
* Centralize email delivery using secure SMTP or institutional credentials
* Integrate with a job scheduler for large email operations

---

## 🧩 Architecture Overview

```text
[Frontend / Other Module] → Scheduler → Email API → SMTP (Gmail, Zoho, Institutional)
```

* **Frontend**: Consumes and triggers email API endpoints.
* **Scheduler**: Queues bulk/personalized emails one by one and calls email API.
* **Email API**: Our core system. Accepts instructions, renders templates, and sends emails.
* **SMTP Server**: Final delivery via secured email server (Institutional or Faculty's own).

---

## 📚 Core Features

### 1. Personalized Mail Support

* Use template strings with placeholders: `{{name}}`, `{{regNo}}`, `{{subjectList}}`
* Each student's data is dynamically inserted using a template engine (Handlebars)

### 2. Batch Mail Support

* If body is identical (no personal data), use BCC field to include all recipients in one mail

### 3. Attachment Support

* Support PDF, DOCX, images, and more
* Attachments sent as Base64-encoded strings from frontend or scheduler

### 4. Template Management

* Templates are predefined **within the email module**, not in a database
* Frontend sends a key like `LOW_ATTENDANCE_TEMPLATE`, email system fetches associated content
* Custom free-text/HTML emails also supported

### 5. Flexible Sending Options

* **Option 1**: Default institutional email via hardcoded SMTP credentials (configured in `.env`)
* **Option 2**: Faculty-provided SMTP credentials (added during profile setup)

---

## ⚙️ Tech Stack

| Component        | Technology               |
| ---------------- | ------------------------ |
| Backend          | Node.js + TypeScript     |
| Mail Sending     | Nodemailer               |
| Templating       | Handlebars.js            |
| Queue (optional) | BullMQ / In-memory Queue |

---

## 🔐 Security & Anti-Spam Strategy

| Concern                       | Mitigation                                                    |
| ----------------------------- | ------------------------------------------------------------- |
| Unauthorized default mail use | Restrict by role or authorization token                       |
| Spam flagging                 | Use verified SMTP + DKIM/SPF records, personalize mail bodies |
| Credential safety             | Store SMTP creds encrypted or use secure `.env` vars          |
| Mail limits                   | Add hourly/daily send limits; add logging and alerts          |

---

## 🧪 API Interface Specification

All endpoints use a common base URL (e.g. `/api/email/`)

### `/send/single`

```http
POST /send/single
```

Send one personalized email with optional attachment

**Payload:**

```json
{
  "templateKey": "LOW_ATTENDANCE_TEMPLATE",
  "senderType": "default", // or "custom"
  "recipients": [
    {
      "email": "abc@student.edu",
      "name": "ABC",
      "regNo": "123"
    }
  ],
  "attachments": [
    {
      "filename": "report.pdf",
      "content": "<base64-content>",
      "encoding": "base64"
    }
  ],
  "cc": ["advisor@uni.edu"],
  "bcc": ["parent@domain.com"]
}
```

### `/send/batch`

```http
POST /send/batch
```

Send one email to many recipients (no personalization)

### `/templates/list`

```http
GET /templates/list
```

Returns a list of available templates and description keys

### `/templates/render`

```http
POST /templates/render
```

Return rendered version of a template with given data (for preview/testing)

---

## 📦 Template System (Handlebars)

**Example Template:**

```html
Dear {{name}}, (Reg No: {{regNo}})

You have attendance shortage in the following subjects:
{{#each subjects}}
 - {{this}}
{{/each}}

Please take immediate action.
```

**Rendered Using:**

```ts
const compiled = handlebars.compile(template);
const html = compiled({ name: "Anurag", regNo: "21CS1234", subjects: ["Math", "Physics"] });
```

---

## 📦 Attachment Handling

Files are passed as base64 in API call and attached via Nodemailer:

```ts
attachments: [
  {
    filename: "report.pdf",
    content: Buffer.from(base64String, 'base64')
  }
]
```

---

## 🔄 Scheduler Integration

The Scheduler will:

* Handle all heavy logic and queue management
* Make sequential API calls to `/send/single` for personalized mails
* Decide recipients, personalization content, and templateKey

This modular separation ensures email module only focuses on delivery.

---

## 📊 Logging & Monitoring

Each email sent should be logged with:

* Timestamp
* Template used
* Sender
* Recipient(s)
* Success/failure

Rate-limiting & error logging should also be implemented.

---

## 🔑 Environment Variables (`.env`)

```env
DEFAULT_SMTP_USER=admin@university.edu
DEFAULT_SMTP_PASS=your-password
INSTITUTE_NAME=MyUniversity
FROM_NAME=University Admin
DOMAIN_BASE_URL=https://myuniversity.edu
```

---

## 🧾 Summary of Flow

1. **Frontend / Other Module** selects students and triggers Scheduler
2. **Scheduler** determines personalized data & template
3. Scheduler calls `/send/single` with 1 student at a time
4. Email API:

   * Renders template
   * Adds attachments
   * Sends via selected SMTP
5. Log and return success/failure

---

## 🧠 Additional Recommendations

* Add retry mechanism for failed deliveries
* Add admin panel to monitor send logs
* Add test mode to preview rendered templates in frontend
* Implement background queue if traffic increases

---

## ✅ Ready for Development

This README fully outlines the Email Module. Now you can:

* Begin building in a new repo or folder with clear targets
* Share this doc with team members
* Extend or migrate this service independently

Let me know when you're ready, and we’ll scaffold the code and APIs step-by-step.
