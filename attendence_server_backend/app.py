import os
import re
import fitz
import uuid
import json
import pandas as pd
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # Set max upload size to 100 MB
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

try:
    firebase_admin.get_app()
except ValueError:
    SERVICE_ACCOUNT_KEY = json.loads(os.environ.get("FIREBASE_CREDS_JSON"))
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
    firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/extract-attendance', methods=['POST'])
def extract_attendance():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    file = request.files['pdf']
    original_filename = secure_filename(file.filename)
    unique_id = uuid.uuid4().hex
    pdf_filename = f"{unique_id}_{original_filename}"
    filepath = os.path.join(UPLOAD_FOLDER, pdf_filename)

    # Save the uploaded PDF file
    file.save(filepath)

    try:
        doc = fitz.open(filepath)
        data, subject_set = [], set()

        full_text = "\n".join([page.get_text() for page in doc])
        student_block_pattern = re.compile(r'(\d+)\s+(RA\d{13})\s+([A-Z ]+)')
        matches = list(student_block_pattern.finditer(full_text))

        subject_attendance_pattern = re.compile(r'(21[A-Z]{3}\d{3}[TJL]?(?:\([A-Z]\))?)\s*[\r\n]+\s*(\d{2,3}\.\d+)')

        for i, match in enumerate(matches):
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(full_text)

            reg_no = match.group(2)
            name = match.group(3).strip()
            sno = int(match.group(1))
            block = full_text[start:end]

            subjects = subject_attendance_pattern.findall(block)
            row = {"S.No": sno, "Reg No": reg_no, "Name": name}

            for code, percent in subjects:
                clean_code = code.strip()
                row[clean_code] = float(percent)
                subject_set.add(clean_code)

            data.append(row)

        df = pd.DataFrame(data)
        for subject in subject_set:
            if subject not in df.columns:
                df[subject] = None

        df = df[["S.No", "Reg No", "Name"] + sorted(list(subject_set))]

        # Save CSV with same base name as PDF
        base_name = os.path.splitext(pdf_filename)[0]
        csv_filename = f"{base_name}.csv"
        output_csv = os.path.join(UPLOAD_FOLDER, csv_filename)
        df.to_csv(output_csv, index=False)

        # Firestore upload logic
        for _, row in df.iterrows():
            reg_no = row["Reg No"]
            ref = db.collection('User').document(reg_no)
            attendance_map = {
                subject: row[subject]
                for subject in subject_set if pd.notna(row[subject])
            }

            try:
                doc = ref.get()
                if doc.exists:
                    ref.update({f"attendance.{k}": v for k, v in attendance_map.items()})
                else:
                    ref.set({"attendance": attendance_map})
                    print(f"[NEW DOC CREATED] {reg_no}")
            except Exception as e:
                print(f"[ERROR] While processing {reg_no}: {e}")

        return jsonify({
            "message": "Upload and processing successful.",
            "csv_filename": csv_filename,
            "download_url": f"/download/{csv_filename}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Cleanup both PDF and CSV
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
            if os.path.exists(output_csv):
                os.remove(output_csv)
        except Exception as cleanup_err:
            print(f"[CLEANUP ERROR] Failed to remove temp files: {cleanup_err}")

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
