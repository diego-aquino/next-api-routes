import prisma from '@/app/api/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export async function POST(request: Request) {
  const { title, content } = createNoteSchema.parse(await request.json());

  const note = await prisma.note.create({
    data: {
      title,
      content,
    },
  });

  return NextResponse.json(note);
}

export async function GET() {
  const notes = await prisma.note.findMany();
  return NextResponse.json(notes);
}
