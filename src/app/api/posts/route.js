import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const POST_PER_PAGE = 2;

    try {
        // Fetch the posts for the current page
        const posts = await prisma.Post.findMany({
            take: POST_PER_PAGE,
            skip: POST_PER_PAGE * (page - 1),
        });

        // Get the total number of posts
        const count = await prisma.Post.count();

        // Return both posts and the total count
        return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong in category file!" }),
            { status: 500 }
        );
    }
};
