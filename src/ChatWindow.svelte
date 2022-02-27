<script>
  import { onMount } from 'svelte'
  import ChatBubble from './ChatBubble.svelte';
  import storeUser from './store/user'
  import storeChat, { Actions as ChatActions } from './store/chat'
  import gun from './gun'

  const { subscribe: subscribeUser } = storeUser
  const { subscribe: subscribeChat, dispatch: dispatchChat } = storeChat

  export let room;
  // Create a local store to cache data from GUN
  let windowEl

  let user = {}
  let log = {}

  onMount(async () => {
    subscribeUser(async (userState) => {
      const getState = await userState;
      user = await getState.user;
    })

    subscribeChat(async (chatState) => {
      const getState = await chatState;
      log = await getState.log
    })
  })

  $: log
  $: user
	$: log = Object.entries(log)

  gun.get('chats').get(room).get('log').on((gunLog) => {
    log = gunLog
  })

  async function onSubmit(e) {
    const formData = new FormData(e.target);

    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    const { message } = data;

    const json = {
      author: user.alias,
      message,
      timestamp: new Date(),
    };

    await gun
				.get("chats")
				.get(room)
				.get("log")
				.set(JSON.stringify(json));
  }	
</script>

<div class='container'>
  <div bind:this={windowEl} class='chat-window'>
    {#each log as [key, messageJSON]}
      <div class='chat-message'>
        <ChatBubble messageJSON={messageJSON} user={user.alias} />
      </div>
    {/each}
  </div>
  <div>
    <div class='text-box'>
      <form on:submit|preventDefault={onSubmit}>
        <input 
          class="text-input" 
          type="text"
          id="message"
          name="message"
        />
        <button type="submit">Send!</button>
      </form>
    </div>
  </div>
</div>

<style>
  .container {
    margin: auto;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .chat-window {
    height: 100%;
    overflow-y: auto;
    max-width: 1500px;
  }

  .chat-window--waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .text-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    position: relative;
    margin: 0;
    z-index: 2;
  }

  .image {
    width: 200px;
    height: 200px;
  }

  .image > svg {
    width: 100%;
    height: 100%;
  }

  .text-box {
    margin: 10px 0;
    padding: 20px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .text-box::before {
    content: '';
    display: block;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    z-index: -1;
  } 
</style>