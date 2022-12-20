import jwtDecode from 'jwt-decode';
import { localGet } from './localStorage';
import { getUserByUserId } from './api/user';

// eslint-disable-next-line no-unused-vars
const setupWSConnection = (setNotifications) => {
  const token = localGet('token');
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  // if not registered, do nothing
  if (token === null) {
    return;
  }

  const socket = new WebSocket(
    process.env.NODE_ENV === 'development'
      ? 'ws://localhost:8080'
      : `wss://${window.location.hostname}`,
    token,
  );

  // Connection opened
  socket.addEventListener('open', () => {
    console.log('ws connection opened');
    socket.send((JSON.stringify('["hello server from frontend"]')));
  });

  // Listener for messages
  socket.addEventListener('message', async (event) => {
    // parse message to json
    const pushMessage = JSON.parse(event.data);
    console.log('Message from server ', pushMessage);
    if (pushMessage.type === 'new post') {
      const userId = `${pushMessage.post.belongUserId}`;
      let belongUserInfo = await getUserByUserId(userId);
      belongUserInfo = belongUserInfo.data.data;
      if (belongUserInfo.followers.includes(currentUserId)) {
        // update notification to fire re-rendering
        setNotifications((prev) => [...prev, {
          show: true,
          sender: belongUserInfo,
          data: pushMessage.post,
        }]);
      }
    }
    // if (pushMessage.type === 'delivered') {
    //   texts.current.push(`sent(${pushMessage.to}): ${pushMessage.text}`);
    //   // update previous message box via state and props
    //   updateMessages(); // update messages to fire re-rendering
    // }
    // if (pushMessage.type === 'new message') {
    //   console.log('new message');
    //   texts.current.push(`${pushMessage.from}: ${pushMessage.text}`);
    //   // update previous message box via state and props
    //   updateMessages(); // update messages to fire re-rendering
    // }
  });

  // Connection closed
  socket.addEventListener('close', () => {
    console.log('Connection closed bye bye! ');
  });
};

export default setupWSConnection;
