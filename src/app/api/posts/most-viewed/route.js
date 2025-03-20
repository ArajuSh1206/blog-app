// File: /app/api/posts/most-viewed/route.js
import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    // Get the URL object to extract query parameters
    const url = new URL(req.url);
    const isTop4 = url.searchParams.get("top4") === "true";

    let posts;
    
    if (isTop4) {
      // Fetch top 4 posts by views
      posts = await prisma.post.findMany({
        take: 4,
        orderBy: { views: "desc" },
        include: { user: true },
      });
    } else {
      // Fetch the single most viewed post
      posts = await prisma.post.findFirst({
        orderBy: { views: "desc" },
        include: { user: true },
      });
    }

    if (!posts || (Array.isArray(posts) && posts.length === 0)) {
      return new NextResponse(
        JSON.stringify({ message: "No posts found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(isTop4 ? "Top 4 posts fetched:" : "Most viewed post:", posts);
    
    return new NextResponse(
      JSON.stringify(posts),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
