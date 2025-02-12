import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"


export const GET = async () => {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching todos', error }, { status: 500 });
  }
}


export const POST = async (request) => {
  try {
    const { title } = await request.json();
    if (!title) return NextResponse.json({ message: 'Title is required' }, { status: 400 });

    const newTodo = await prisma.todo.create({
      data: {
        title
      }
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json({ message: 'Error creating todo', error }, { status: 500 });
  }
}


export const DELETE = async (request) => {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });


    const todoToDelete = await prisma.todo.findUnique({
      where: {
        id,
      }
    });

    if (!todoToDelete) return NextResponse.json({ message: 'Todo not found' }, { status: 404 });


    await prisma.todo.delete({
      where: {
        id,
      }
    });

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting todo', error }, { status: 500 });
  }
}
