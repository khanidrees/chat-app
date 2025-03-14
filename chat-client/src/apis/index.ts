import { User, UserCredentials } from '@/types';
import axios from 'axios';

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
        return response;
    }catch(error){
        console.error('Error while Login user:', error);
        throw error;
    }
}