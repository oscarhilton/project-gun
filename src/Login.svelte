<script lang="ts">
  import gun from './gun'
  import user from './user'
  import store, { Actions } from './store/user'

  let username;
  let password;

  const { dispatch } = store

  interface LoginPayload {
    message: string
    success: boolean,
    pub?: string
  }

  const checkUsernameInUse = async (username) => {
		let user = await gun.get(`~@${username}`);
		return user !== undefined;
	}

  const onLogin = () => {
		user.auth(username, password, ({ err, pub }) => {
			if (err) return dispatch({ action: Actions.CLIENT_USER_LOGIN, payload: {message: err, success: false } as LoginPayload});
			else
				return dispatch({ action: Actions.CLIENT_USER_LOGIN, payload: { message: "Welcome back!", success: true, pub: user.is.pub } as LoginPayload});
		});
  }

  const onRegister = async () => {
    if (await checkUsernameInUse(username)) {
      dispatch({ action: Actions.CLIENT_USER_REGISTER, payload: { message: "Username already in use.", success: false } as LoginPayload})
      return
    }
    user.create(
      username,
      password,
      ({ err, pub }) => {
        if (err)
          dispatch({ action: Actions.CLIENT_USER_REGISTER, payload: { message: err, success: false } as LoginPayload})
        else
          dispatch({ action: Actions.CLIENT_USER_REGISTER, payload: { message: "Welcome!", pub, success: true } as LoginPayload})
      }
    );
  }

  const handleUsernameInput = (e) => username = e.target.value;
  const handlePasswordInput = (e) => password = e.target.value;
</script>

<form>
  <div>
    <span>username</span>
    <input type="text" name="username" on:input={handleUsernameInput} />
  </div>
  <div>
    <span>password</span>
    <input type="password" name="password" on:input={handlePasswordInput} />
  </div>
  <div>
    <button type="button" on:click={onLogin}>Login</button>
    <button type="button" on:click={onRegister}>Register</button>
  </div>
</form>