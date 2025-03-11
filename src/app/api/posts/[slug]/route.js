import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';

export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { user: true },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: 'Post not found' }),
        { status: 404 }
      );
    }

    console.log("Fetched post:", post);

    return new NextResponse(JSON.stringify({ post }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
};
