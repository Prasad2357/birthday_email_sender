import { useEffect, useState } from 'react';
import "../css/AddBirthdayForm.css";
import * as React from 'react';
import Alert from '@mui/material/Alert';

function UserForm() {
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("birthday")
    const [email, setEmail] = useState("")
    const [alert, setAlert] = useState("")

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            name: name,
            date: date,
            description: description,
            email: email,  // ✅ changed key to match 'email'
        };

        fetch("http://localhost:8000/birthdays", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Saved: ", data);
                setAlert("✅ Successfully added!");
            })
            .catch(err => {
                console.error("Submit failed:", err);
                setAlert("❌ Submission failed.");
            });

        setName("");
        setDate("");
        setDescription("birthday");
        setEmail("");
    }

    return (
        <>
            {alert && (
                <div className="alert">
                    <Alert severity="success">{alert}</Alert>
                </div>
            )}
            <div className='container'>
                <h1>Birthday App</h1>
                <form onSubmit={handleSubmit}>
                    <h2>Add Entry</h2>

                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <select
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                            <option value="birthday">Birthday</option>
                            <option value="anniversary">Anniversary</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Email:</label><br />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@example.com"
                            required
                        />
                    </div>

                    <button className='submit-button' type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}

export default UserForm;
