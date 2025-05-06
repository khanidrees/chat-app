import { User, UserCredentials } from '@/types/user';
import axios from 'axios';
import  axiosInstance  from './axios';
const BE_URL =  import.meta.env.VITE_BE_URL;
console.log(BE_URL);

export const postUser = async (user:User)=>{
    try{
        const response = await axios.post(BE_URL+"/api/v1/users/register",user);
        return response;
    }catch(error){
        console.error('Error creating user:', error);
        throw error;
    }
}

export const loginUser = async (user: UserCredentials)=>{
    try{
        const response = await axios.post(BE_URL+"/api/v1/users/login",user);
        console.log(response);
        return response;
    }catch(error){
        console.error('Error while Login user:', error);
        throw error;
    }
}

export const  getUsers = async (query:string, signal : AbortSignal)=>{
    const url = `${BE_URL}/api/v1/users?query=${encodeURIComponent(query)}`;
    
    return await axiosInstance.get(url,{signal});
     
}

export const  createOrgetChatApi = async (userId: string)=>{
    const url = `${BE_URL}/api/v1/chat/${userId}`;
    
    return await axiosInstance.post(url);
     
}

export const getChatMessages = async (chatId:string)=>{
    try{
        const response = await axiosInstance.get(BE_URL+"/api/v1/chat/"+chatId+"/message");
        return response;
    }catch(error){
        console.error('Error while fetching message:', error);
        throw error;
    }
}

export const postChatMessage = async (content:string,chatId:string)=>{
    try{
        const response = await axiosInstance.post(BE_URL+"/api/v1/chat/"+chatId+"/message",{content});
        return response;
    }catch(error){
        console.error('Error while sending message:', error);
        throw error;
    }
}

export const getAllChats = async ()=>{
    try{
        const response = await axiosInstance.get(BE_URL+"/api/v1/chat/");
        return response;
    }catch(error){
        console.error('Error while getting all chats:', error);
        throw error;
    }
}