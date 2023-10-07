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


);
export default LoginForm
