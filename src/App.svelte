<script lang="ts">
	import { onMount } from 'svelte'
	import store, { Actions, INITIAL_STATE } from './store/user'
	import Login from './Login.svelte'
	import Dashboard from './Dashboard.svelte'
	import UserList from './UserList.svelte'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import user from './user'
	import gun from './gun'

	const { subscribe, dispatch } = store

	let userData = INITIAL_STATE.user
	$: userState = userData;

	onMount(async () => {
		if (user && user.is) dispatch({ action: Actions.CLIENT_USER_LOGIN, payload: { pub: user.is.pub, success: true }});

		await gun.get('users').on(() => {
			dispatch({ action: Actions.GET_USERS, payload: {} })
		})

		await gun.user().get("friendRequests").map().on((publicKey, key) => {
			if (!publicKey) return
			console.log(publicKey, key)
		})

		subscribe(async (state) => {
			const getState = await state;
			console.log({ getState });
			userState = getState.user
		})
	})

</script>

<main>
	<SvelteToast />
	<span>{userState.alias}</span>
	{#if userState.authenticated}
		<Dashboard />
	{:else}
		<Login />
	{/if}
	<UserList />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>