import fs from "fs";
import path from "path";
import handlebars from "handlebars";

/**
 * Type for email attachments compatible with Nodemailer
 */
export interface Attachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

/**
 * Type for student data
 */
export interface StudentData {
  regNo: string;
  name: string;
  email: string;
  parentEmail: string;
  department: string;
  [key: string]: string; // Allow additional string properties
}

/**
 * Type for file attachment input
 */
export interface FileAttachment {
  filename: string;
  path: string;
  contentType?: string;
}

/**
 * Render a template with dynamic variables using Handlebars
 * @param templateName - name of the template file (without extension)
 * @param data - dynamic variables to inject into the template
 * @returns rendered HTML string
 */
export function renderTemplate(templateName: string, data: Record<string, any>): string {
  const templatePath = path.join(__dirname, "../templates", `${templateName}.hbs`);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateContent);
  return compiledTemplate(data);
}

/**
 * Validate the input payload for email sending
 * Ensures required fields are present
 */
export function validateEmailPayload(payload: any): { valid: boolean; error?: string } {
  if (!payload.to && !payload.bcc) {
    return { valid: false, error: "Recipient (to or bcc) is required." };
  }
  if (!payload.subject) {
    return { valid: false, error: "Email subject is required." };
  }
  if (!payload.html && !payload.templateCode) {
    return { valid: false, error: "Email body or template code is required." };
  }
  return { valid: true };
}

/**
 * Normalize attachments to nodemailer-friendly format
 * @param attachments - array of file details from request
 */
export function formatAttachments(attachments: FileAttachment[]): Attachment[] {
  if (!attachments || !Array.isArray(attachments)) return [];

  return attachments.map((file) => {
    const content = fs.readFileSync(file.path);
    return {
      filename: file.filename,
      content,
      contentType: file.contentType,
    };
  });
}

/**
 * Mock function to get student details by registration number
 * Replace this with your actual Firestore query in production
 */
export async function getStudentDetails(regNo: string): Promise<StudentData> {
  return {
    regNo,
    name: "Mock Student",
    email: "anuragsujit2005@gmail.com",
    parentEmail: "sujitroy74@gmail.com",
    department: "CSE"
  };
}

/**
 * Extract required keys for the given template
 * You can later parse templates dynamically
 */
export function getTemplateKeys(templateName: string): string[] {
  // You can later enhance this to extract keys from template file
  return ["regNo", "name", "email", "department"];
}

/**
 * Get parent email from student data
 */
export function getParentEmail(student: StudentData): string {
  return student.parentEmail || "";
}
