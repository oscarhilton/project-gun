<script lang="ts">
  import store, { Actions } from './store/chat'
  import Chats from './Chats.svelte'
  import UserList from './UserList.svelte'
</script>

<div>
  <div>
    <Chats />
  </div>
  <div>
    <UserList />
  </div>
</div>