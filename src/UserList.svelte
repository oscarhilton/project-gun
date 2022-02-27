<script lang="ts">
  import store, { Actions } from './store/user'

  const { subscribe } = store

  let userList = {}
  subscribe(async (state) => {
    const getState = await state
    if (getState.users) userList = getState.users
  })
  $: userListState = Object.values(userList)

</script>

<div>
  <pre>{userListState && JSON.stringify(userListState)}</pre>
  <ul>
    {#each userListState as userDetail}
      <li>
        {userDetail.alias}: {userDetail.online ? "online" : "offline"}
      </li>
    {/each}
  </ul>
</div>