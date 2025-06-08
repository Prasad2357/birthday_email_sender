import UserForm from "../components/AddBirthdayForm"
import { Link } from 'react-router-dom'
import EmailTriggerButton from "../components/EmailTriggerButton"
<Link to="/userform">Add New Birthday</Link>

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <EmailTriggerButton />
    </div>
  )
}

export default Home
