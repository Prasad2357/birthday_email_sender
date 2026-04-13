import React, { useState, useEffect } from 'react';
import '../css/Settings.css';
import { Mail, Key, Save, CheckCircle, AlertCircle, Eye, EyeOff, Shield, Info } from 'lucide-react';

const SETTINGS_STORAGE_KEY = 'reminday_settings';

function Settings() {
  const [email, setEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [isDirty, setIsDirty] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEmail(parsed.email || '');
        setAppPassword(parsed.appPassword || '');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handlePasswordChange = (e) => {
    setAppPassword(e.target.value);
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSaveStatus('error');
      return;
    }

    try {
      const settings = { email: email.trim(), appPassword: appPassword.trim() };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setSaveStatus('success');
      setIsDirty(false);

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div className="settings-header-icon">
            <Shield className="header-icon" />
          </div>
          <div>
            <h1>Settings</h1>
            <p className="settings-subtitle">Configure your email and notification preferences</p>
          </div>
        </div>

        {/* Status Banner */}
        {saveStatus === 'success' && (
          <div className="settings-alert settings-alert--success">
            <CheckCircle className="alert-icon" />
            <span>Settings saved successfully!</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="settings-alert settings-alert--error">
            <AlertCircle className="alert-icon" />
            <span>Please fill in a valid email address.</span>
          </div>
        )}

        {/* Form */}
        <form className="settings-form" onSubmit={handleSave} autoComplete="off">
          {/* Email Section */}
          <div className="settings-section">
            <div className="section-label">
              <Mail className="section-icon" />
              <div>
                <h3>Email Address</h3>
                <p>Used as both sender and receiver for birthday reminders</p>
              </div>
            </div>
            <div className="settings-field">
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@gmail.com"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* App Password Section */}
          <div className="settings-section">
            <div className="section-label">
              <Key className="section-icon" />
              <div>
                <h3>Google App Password</h3>
                <p>A 16-character app-specific password from your Google account</p>
              </div>
            </div>
            <div className="settings-field password-field">
              <input
                id="settings-app-password"
                type={showPassword ? 'text' : 'password'}
                value={appPassword}
                onChange={handlePasswordChange}
                placeholder="xxxx xxxx xxxx xxxx"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="settings-info-box">
            <Info className="info-icon" />
            <div>
              <strong>How to get your Google App Password:</strong>
              <ol>
                <li>Go to your Google Account → Security</li>
                <li>Enable 2-Step Verification if not already enabled</li>
                <li>Search for "App Passwords" in your Google account settings</li>
                <li>Generate a new app password and paste it here</li>
              </ol>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button
              type="submit"
              className={`save-btn ${isDirty ? 'save-btn--active' : ''}`}
              disabled={!isDirty}
            >
              <Save size={18} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
