import React from "react";
import "../css/BirthdayCard.css";
import { Calendar, User } from "lucide-react";

function BirthdayCard({ birthday, age }) {
  const birthDate = new Date(birthday.date);
  
  return (
    <div className="birthday-card">
      <div className="birthday-card-content">
        <div className="avatar">
          {birthday.name.charAt(0)}
        </div>
        <div className="birthday-details">
          <div className="birthday-header">
            <h4 className="person-name">{birthday.name}</h4>
            <span className="person-age">{age} years</span>
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