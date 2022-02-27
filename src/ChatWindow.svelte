<script>
  import { onMount, afterUpdate } from 'svelte'
  import ChatBubble from './ChatBubble.svelte';
  import storeUser from './store/user'
  import storeChat from './store/chat'
  import gun from './gun'

  const { subscribe: subscribeUser } = storeUser
  const { subscribe: subscribeChat } = storeChat

  export let room;
  // Create a local store to cache data from GUN
  let windowEl

  let newMessage = ''
  let user = {}
  let log = {}

  $: windowEl

  onMount(async () => {
    subscribeUser(async (userState) => {
      const getState = await userState;
      user = await getState.user;
    })

    gun.get('chats').get(room).get('log').on(async (gunLog) => {
      log = gunLog;
    })
  })

  afterUpdate(() => {
    windowEl.scrollTo({
      top: windowEl.scrollHeight,
      behavior: 'smooth'
    })
  })

  $: log
  $: user
	$: log = Object.entries(log).sort(([_1, a], [_2, b]) => (+new Date(a.timestamp) > +new Date(b.timestamp)) ? -1 : 1)

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

    newMessage = ''
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
    <div>
      <form class="text-form" on:submit|preventDefault={onSubmit}>
        <div class='text-box'>
          <input 
            class="text-input" 
            type="text"
            id="message"
            name="message"
            bind:value={newMessage}
          />
        </div>
        <!-- <button type="submit">Send!</button> -->
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
    max-height: 400px;
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

  .text-form {
    width: calc(100% - 60px);
    padding: 30px;
    display: flex;
    flex-grow: 1;
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
    padding: 10px;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 3;
    background: rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
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
    z-index: -1;
  } 
</style>