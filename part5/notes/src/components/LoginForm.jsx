import PropType from 'prop-types'
const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => (
  <form onSubmit={handleLogin}>
    Username
    <input
      type="text"
      name="username"
      value={username}
      onChange={handleUsernameChange}
    />
    Password
    <input
      type="password"
      name="password"
      value={password}
      onChange={handlePasswordChange}
    />
    <button type="submit">Login</button>
  </form>


)

LoginForm.propTypes = {
  handleLogin: PropType.func.isRequired,
  handleUsernameChange: PropType.func.isRequired,
  handlePasswordChange: PropType.func.isRequired,
  username: PropType.string.isRequired,
  password: PropType.string.isRequired

}
export default LoginForm
