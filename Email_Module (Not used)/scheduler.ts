// scheduler.ts
import { retrySendEmail as sendEmail } from "./mailer";
import { 
  renderTemplate, 
  getStudentDetails, 
  getTemplateKeys, 
  getParentEmail,
  type StudentData,
  type FileAttachment,
  formatAttachments
} from "./utils";

interface SchedulePayload {
  recipients: string[]; // List of regNo or email IDs
  templateName: string; // template filename (without .hbs)
  cc?: string[];
  bcc?: string[];
  from?: string; // Optional sender address
  toParents?: boolean; // whether to fetch parent email instead of student
  subject: string;
  attachments?: FileAttachment[];
}

interface ScheduleResult {
  regNo: string;
  status: 'success' | 'failed';
  info?: any;
  error?: string;
}

export async function scheduleMailHandler(payload: SchedulePayload): Promise<ScheduleResult[]> {
  const {
    recipients,
    templateName,
    cc = [],
    bcc = [],
    from = process.env.DEFAULT_SENDER_EMAIL,
    toParents = false,
    subject,
    attachments = [],
  } = payload;

  if (!from) {
    throw new Error('Sender email is required. Set DEFAULT_SENDER_EMAIL in .env or provide in payload.');
  }

  const results: ScheduleResult[] = [];

  for (const regNo of recipients) {
    try {
      // 🔥 Fetch student data from Firebase or mock
      const studentData = await getStudentDetails(regNo);

      if (!studentData) {
        throw new Error(`No data found for ${regNo}`);
      }

      // 🎯 Prepare handlebars data
      const templateKeys = getTemplateKeys(templateName);
      const mailData: Record<string, string> = {};
      
      for (const key of templateKeys) {
        mailData[key] = studentData[key] || ""; // fallback empty
      }

      // 🎨 Render template
      const htmlContent = renderTemplate(templateName, mailData);

      // 📨 Determine recipient
      const to = toParents ? getParentEmail(studentData) : studentData.email;

      // 📤 Format attachments
      const formattedAttachments = formatAttachments(attachments);

      // 📤 Send
      const result = await sendEmail({
        to,
        subject,
        html: htmlContent,
        cc,
        bcc,
        from,
        attachments: formattedAttachments,
      });

      results.push({ regNo, status: "success", info: result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      results.push({ regNo, status: "failed", error: errorMessage });
    }
  }

  return results;
}
