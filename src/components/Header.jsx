import { Link } from 'react-router-dom'
export function Header() {
  return (
    <div>
      <h1>Welcome to my Blog!</h1>
      <br />
      <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
