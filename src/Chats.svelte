<script lang='ts'>
    import { onMount } from 'svelte'; 
    import store, { Actions } from './store/chat'
    import ChatWindow from './ChatWindow.svelte'

    const { dispatch } = store

    let room = 'Empty'
    onMount(async () => {
      dispatch({ action: Actions.GET_LOG, payload: 'public' })
    })
    $: room
</script>

<div>
  <h1>Chat room:</h1>
  <h2>{room}</h2>
  <ChatWindow room='public' />
</div>