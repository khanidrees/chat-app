import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(10),
});
import { loginUser, postUser } from "@/apis";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate(); 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email:"",
            password:"",
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
        try{    
            const response = await loginUser(values);
            if(response.status ==200 && response.data.data.token){
                localStorage.setItem('token',response.data.data.token);
                navigate("/");
            }
        }catch(err){
            //TODO
            alert("username/password is incorrect")
        }
        
    
      }
      return (
        <div className="w-full flex flex-col items-center">
            <div>
                <h1 className="mb-4">Login</h1>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/3">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="******" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Log In</Button>
                <p>New User ? <NavLink className={'text-blue-700'} to="/signup">Sign Up</NavLink></p>
            </form>
            </Form>
        </div>
    )
}

export default Login;

