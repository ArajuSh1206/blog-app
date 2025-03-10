import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const POST_PER_PAGE = 2;
    const cat = searchParams.get("cat") || "";

    try {
        const where = cat ? { catSlug: cat } : {}; 

        const posts = await prisma.Post.findMany({
            take: POST_PER_PAGE,
            skip: POST_PER_PAGE * (page - 1),
            where, 
        });

        const count = await prisma.Post.count({ where }); // Fix: Use `where` instead of `query.where`

        return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong in category file!" }),
            { status: 500 }
        );
    }
};
