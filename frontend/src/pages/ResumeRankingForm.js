import { useState } from 'react';

const ResumeRankingForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState(null); // File input for multiple resumes
  const [rankedResumes, setRankedResumes] = useState([]);
  const [errors, setErrors] = useState({ jobDescription: '', resumes: '', form: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!jobDescription.trim() || !resumes || resumes.length === 0) {
      setErrors({
        ...errors,
        jobDescription: !jobDescription.trim() ? 'Job description is required.' : '',
        resumes: !resumes || resumes.length === 0 ? 'Please upload at least one resume.' : ''
      });
      return;
    }

    // Create FormData and append fields
    const formData = new FormData();
    formData.append('job_description', jobDescription);

    // Append each resume file to FormData
    for (let i = 0; i < resumes.length; i++) {
      formData.append('resumes', resumes[i]);
    }
    console.log(formData);
    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, form: 'Failed to rank resumes. Please try again.' });
      } else {
        console.log(json)
        setRankedResumes(json.ranked_resumes);
        setErrors({ jobDescription: '', resumes: '', form: '' });
        setJobDescription('');
        setResumes(null); // Reset resumes after submission
      }
    } catch (err) {
      console.error('Request failed:', err);
      setErrors({ ...errors, form: 'Failed to rank resumes. Please try again later.' });
    }
  };

  return (
    <div className="form_container">
      <form className="create" onSubmit={handleSubmit}>
        <h3>Submit Job Description and Resumes</h3>

        <label>Job Description:</label>
        <textarea
          onChange={(e) => setJobDescription(e.target.value)}
          value={jobDescription}
          rows="5"
        />
        {errors.jobDescription && <div className="error">{errors.jobDescription}</div>}

        <label>Upload Resumes (PDF):</label>
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => setResumes(e.target.files)}
        />
        {errors.resumes && <div className="error">{errors.resumes}</div>}

        <button type="submit">Analyze Resumes</button>

        {errors.form && <div className="error">{errors.form}</div>}
      </form>

      {/* Display ranked resumes */}
      {rankedResumes.length > 0 && (
        <div className="results">
          <h3>Ranked Resumes</h3>
          <ul>
            {rankedResumes.map((resume, index) => (
              <li key={index}>
                {resume.filename} - Score: {resume.score} 
                <br/>
                Review: {resume.response}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeRankingForm;
