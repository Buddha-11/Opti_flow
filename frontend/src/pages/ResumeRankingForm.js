import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../index.css'; // Ensure this is linked to your global CSS file

const ResumeRankingForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState(null);
  const [rankedResumes, setRankedResumes] = useState([]);
  const [errors, setErrors] = useState({ jobDescription: '', resumes: '', form: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim() || !resumes || resumes.length === 0) {
      setErrors({
        ...errors,
        jobDescription: !jobDescription.trim() ? 'Job description is required.' : '',
        resumes: !resumes || resumes.length === 0 ? 'Please upload at least one resume.' : ''
      });
      return;
    }

    const formData = new FormData();
    formData.append('job_description', jobDescription);

    for (let i = 0; i < resumes.length; i++) {
      formData.append('resumes', resumes[i]);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, form: 'Failed to rank resumes. Please try again.' });
      } else {
        setRankedResumes(json.ranked_resumes);
        setErrors({ jobDescription: '', resumes: '', form: '' });
        setJobDescription('');
        setResumes(null);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setErrors({ ...errors, form: 'Failed to rank resumes. Please try again later.' });
    }
  };

  return (
    <div className="form-container">
      <Navbar />

      {/* Spacer div */}
      <div className="spacer"></div>

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

      {rankedResumes.length > 0 && (
        <div className="results">
          <h3>Ranked Resumes</h3>
          <ul>
            {rankedResumes.map((resume, index) => (
              <li key={index}>
                {resume.filename} - Score: {resume.score}
                <br />
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
