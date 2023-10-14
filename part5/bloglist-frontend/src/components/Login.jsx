const Login = ({ username,password,handleLogin,usernameChanged,passChanged }) => {
  return (
    <div>
      <h2>log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username :
          <input type="text" value={username} onChange={usernameChanged}/>
        </div>

        <div>
          Password :
          <input type="password" value={password} onChange={passChanged}/>
        </div>
        <button type="submit">Login</button>
      </form>


    </div>
  )

}
export default Login 
