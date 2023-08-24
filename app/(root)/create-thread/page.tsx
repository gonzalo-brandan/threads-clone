import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser } from "@/lib/actions/user.actions"
import PostThread from "@/components/forms/PostThread"

async function Page() {
    const user = await currentUser()
    
    if (!user) return null

    const userInfo = await fetchUser(user.id)


    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={userInfo._id}/>
        </>)
}

export default Page