import React from "react";
import "../css/BirthdayCard.css";
import { Calendar, User, Trash2, Loader } from "lucide-react";

function BirthdayCard({ birthday, age, onDelete, isDeleting }) {
  const birthDate = new Date(birthday.date);
  
  return (
    <div className={`birthday-card ${isDeleting ? 'birthday-card--deleting' : ''}`}>
      <div className="birthday-card-content">
        <div className="avatar">
          {birthday.name.charAt(0)}
        </div>
        <div className="birthday-details">
          <div className="birthday-header">
            <h4 className="person-name">{birthday.name}</h4>
            <div className="birthday-header-right">
              <span className="person-age">{age} years</span>
              {onDelete && (
                <button
                  className="delete-btn"
                  onClick={() => onDelete(birthday.bday_id)}
                  disabled={isDeleting}
                  title={`Delete ${birthday.name}`}
                  aria-label={`Delete ${birthday.name}`}
                >
                  {isDeleting ? (
                    <Loader className="delete-icon spinning" size={14} />
                  ) : (
                    <Trash2 className="delete-icon" size={14} />
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="detail-row">
            <Calendar className="icon" />
            <span>{birthDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          
          {birthday.relationship && (
            <div className="detail-row">
              <User className="icon" />
              <span>{birthday.relationship}</span>
            </div>
          )}
          
          {birthday.notes && (
            <p className="notes">{birthday.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BirthdayCard;