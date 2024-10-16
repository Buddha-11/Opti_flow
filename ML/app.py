from dotenv import load_dotenv
import base64
import os
import io
from PIL import Image
import pdf2image
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import logging

# Load environment variables
load_dotenv()

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Flask App
app = Flask(__name__)
CORS(app)
# Set the absolute path to poppler's bin folder (change as per your system)
POPPLER_PATH = r"C:\Program Files (x86)\poppler-24.08.0\Library\bin"

# Set up logging
# logging.basicConfig(level=logging.DEBUG)

def get_gemini_response(input_text, pdf_content, prompt):
    logging.debug(f"Input to Gemini - Text: {input_text}, PDF Content: {pdf_content}")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input_text, pdf_content[0], prompt])
    logging.debug(f"Response from Gemini: {response}")
    return response.text

def input_pdf_setup(uploaded_file):
    if uploaded_file is not None:
        logging.debug(f"File uploaded: {uploaded_file.filename}")
        images = pdf2image.convert_from_bytes(uploaded_file.read())
        logging.debug(f"Number of pages in the PDF: {len(images)}")
        first_page = images[0]
        
        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        pdf_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()  # encode to base64
            }
        ]
        logging.debug(f"Processed first page of PDF to image (base64 encoded).")
        return pdf_parts
    else:
        logging.error("No file uploaded")
        raise FileNotFoundError("No file uploaded")

def calculate_match_score(response):
    logging.debug(f"Response for score calculation: {response}")
    # Extract percentage match from response
    try:
        score = float(response.split('%')[0].strip())
    except ValueError:
        logging.error(f"Error parsing score from response: {response}")
        score = 0.0  # Default to 0 if no valid percentage found
    return score

# Flask Route to Handle Resume Analysis
@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    logging.info("Received request to analyze resume")
    
    # Expecting job description and resumes in the request
    job_description = request.form.get('job_description')
    if 'resumes' not in request.files or not job_description:
        logging.error("Job description or resumes missing in the request")
        return jsonify({"error": "Job description and resumes are required"}), 400
    
    uploaded_files = request.files.getlist('resumes')
    
    # Limit to 5 PDFs
    if len(uploaded_files) > 5:
        uploaded_files = uploaded_files[:5]
    
    input_prompt = """
    You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality. 
    Your task is to evaluate the resume against the provided job description. Provide a percentage match, followed by missing keywords, 
    and finally your professional thoughts. be a bit harsh on precentage match if something is missing do deduct points .
    """
    
    scores = []
    
    for file in uploaded_files:
        try:
            pdf_content = input_pdf_setup(file)
            response = get_gemini_response(job_description, pdf_content, input_prompt)
            score = calculate_match_score(response)
            scores.append({
                "filename": file.filename,
                "score": score,
                "response": response
            })
        except Exception as e:
            logging.error(f"Error processing file {file.filename}: {str(e)}")
    
    # Sort by score in decreasing order
    scores.sort(key=lambda x: x['score'], reverse=True)
    
    # Log final ranked scores
    logging.info(f"Final ranked resumes: {scores}")
    
    # Return a JSON response with ranked resumes
    return jsonify({"ranked_resumes": scores}), 200

if __name__ == '__main__':
    logging.info("Starting Flask app")
    app.run(debug=True)
