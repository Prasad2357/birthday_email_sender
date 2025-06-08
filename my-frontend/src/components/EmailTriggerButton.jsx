import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/EmailTriggerButton.css";
import Alert from '@mui/material/Alert';

function EmailTriggerButton() {
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('success');

  const triggerEmail = async () => {
    try {
      const response = await axios.get('http://localhost:8000/birthdays/send-emails-now');
      setStatus(response.data.message || 'Emails sent successfully!');
      setSeverity('success');
    } catch (error) {
      setStatus('❌ Failed to send emails');
      setSeverity('error');
      console.error(error);
    }
  };

  // Clear alert after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div>
      <button onClick={triggerEmail} className="send-button">
        ✉️ Send Birthday Emails Now
      </button>
      {status && (
        <div className="alert">
          <Alert severity={severity}>{status}</Alert>
        </div>
      )}
    </div>
  );
}

export default EmailTriggerButton;
