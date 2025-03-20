import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const POST_PER_PAGE = 2;
    const cat = searchParams.get("cat") || "";

    try {
        const where = cat ? { catSlug: cat } : {}; 

        const posts = await prisma.post.findMany({
            take: POST_PER_PAGE,
            skip: POST_PER_PAGE * (page - 1),
            where, 
        });

        const count = await prisma.post.count({ where });

        return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong in category file!" }),
            { status: 500 }
        );
    }
};

//Create a post for write jsx
export const POST = async (req) => {
    const session = await getAuthSession();
  
    if(!session) {
      return new NextResponse(
        JSON.stringify({ message: "Not Authenticated"}, {status: 401})
      )
    }
  
    try {
      const body = await req.json();
      const post = await prisma.post.create({
        data: { ...body, userEmail: session.user.email },
      })
  
      return new NextResponse(JSON.stringify( post, { status: 200 }));
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: 'Something went wrong!' }),
        { status: 500 }
      );
    }
  };
  
