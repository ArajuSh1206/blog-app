import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/utils/auth';

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

export const DELETE = async (req, { params }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not authenticated" }),
      { status: 401 }
    );
  }

  const { slug } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found" }),
        { status: 404 }
      );
    }

    if (post.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: "Not authorized to delete this post" }),
        { status: 403 }
      );
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: { postSlug: slug },
      }),
      prisma.post.delete({
        where: { slug },
      }),
    ]);

    return new NextResponse(
      JSON.stringify({ message: "Post has been deleted" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};