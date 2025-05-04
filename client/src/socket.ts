import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : import.meta.env.VITE_BE_URL;
console.log(URL);
export const socket = io(URL, {
    autoConnect: false,
    auth: {
      token: localStorage.getItem('token')
    },
  },
);