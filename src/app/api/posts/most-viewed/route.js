// File: /app/api/posts/most-viewed/route.js
import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';

export const dynamic = 'force-dynamic';

export const GET = async (req) => {
  try {
    // Get the URL object to extract query parameters
    const url = new URL(req.url);
    const isTop4 = url.searchParams.get('top4') === 'true';
    
    // If top4 parameter is true, get top 4 posts by views
    if (isTop4) {
      const posts = await prisma.post.findMany({
        take: 4,  // Limit to 4 posts
        orderBy: { views: 'desc' },
        include: { user: true },
      });
      
      if (!posts || posts.length === 0) {
        return new NextResponse(
          JSON.stringify({ message: 'No posts found' }),
          { status: 404 }
        );
      }
      
      console.log("Top 4 posts fetched:", posts.length);
      return new NextResponse(JSON.stringify(posts), { status: 200 });
    } 
    else {
      const post = await prisma.post.findFirst({
        orderBy: { views: 'desc' },
        include: { user: true },
      });
      
      if (!post) {
        return new NextResponse(
          JSON.stringify({ message: 'No posts found' }),
          { status: 404 }
        );
      }
      
      console.log("Most viewed post:", post);
      return new NextResponse(JSON.stringify(post), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
};
