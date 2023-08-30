"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CommentValidation } from "@/lib/validations/post";
//import { createPost } from "@/lib/actions/post.actions";


interface Props {
    postId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({postId, currentUserImg, currentUserId}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
  
    const { organization } = useOrganization();
  
    const form = useForm<z.infer<typeof CommentValidation>>({
      resolver: zodResolver(CommentValidation),
      defaultValues: {
        post: "",
      },
    });
  
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    //   await createPost({
    //     text: values.post,
    //     author: userId,
    //     communityId: null,
    //     path: pathname,
    //   });
  
      router.push("/")
    };
    
    return (
        <Form {...form}>
        <form
          className='comment-form'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='post'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Content
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                  <Input type="text" placeholder="Comment..." className="no-focus text-light-1 outline-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <Button type='submit' className='bg-primary-500'>
            Post Post
          </Button>
          </form>
      </Form>
    )
}

export default Comment