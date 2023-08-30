"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Post from "../models/post.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createPost({ text, author, communityId, path }: Params
    ) {
      try {
        connectToDB();
    
        const createdPost = await Post.create({
          text,
          author,
          community: null, // Assign communityId if provided, or leave it null for personal account
        });

        // Update User model
        await User.findByIdAndUpdate(author, {
        $push: { post: createdPost._id },
        });

        revalidatePath(path);
      } catch (error: any) {
      throw new Error(`Failed to create post: ${error.message}`);
      }
    }

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch top-level post (no parents)
  const postsQuery = Post.find({parentId: { $in: [null, undefined]}})
  .sort({createdAt:'desc'})
  .skip(skipAmount)
  .limit(pageSize)
  .populate({path:'author', model: User})
  .populate({
    path:'children',
    populate: {
      path: 'author',
      model: User,
      select: "-id name parentId image"
    }
  })

  const totalPostsCount = await Post.countDocuments({parentId:{$in: [null, undefined]}})

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext }
}

export async function fetchPostById(id: string) {
  connectToDB();

  try {

    //TODO: Populate Comunity
    const post = await Post.findById(id)
    .populate({
      path: 'author',
      model: User,
      select: "_id id name image"
    })
    .populate({
      path: "children",
      populate: [
        {
          path: "author",
          model: User,
          select: "_id id name parentId image"
        },
        {
          path: "children",
          model: Post,
          populate: {
            path: "author",
            model: User,
            select: "_id id name parentId image"
          }
        }
      ]
    }).exec()

    return post
  } catch (error: any) {
    throw new Error(`Error fetching post: ${error.message}`)
  }
}