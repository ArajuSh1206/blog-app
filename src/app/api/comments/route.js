import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import { getAuthSession } from '@/utils/auth';

//get all comments of post

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  console.log(searchParams)

  const postSlug = searchParams.get("postSlug");

  try {
    const comments = await prisma.comment.findMany({
      where: { postSlug },
      include: { user: true },
    });

    console.log("Fetched post:", comments);

    return new NextResponse(JSON.stringify( comments, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
};

//create another endpoint to add comments

export const POST = async (req) => {
  const session = await getAuthSession();

  if(!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated"}, {status: 401})
    )
  }

  try {
    const body = await req.json();
    const comment = await prisma.comment.create({
      data: { ...body, userEmail: session.user.email },
    })

    return new NextResponse(JSON.stringify( comment, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  const { commentId } = await req.json(); // The comment ID to delete

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new NextResponse(
        JSON.stringify({ message: "Comment not found" }),
        { status: 404 }
      );
    }

    if (comment.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Not authorized to delete this comment" }),
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new NextResponse(
      JSON.stringify({ message: "Comment deleted successfully" }),
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