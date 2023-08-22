'use client';

import type { Note } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  content: string;
}

function Home() {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: { title: '', content: '' },
  });

  const { data: notes = [], isLoading: isLoadingNotes } = useQuery(['notes'], async () => {
    const { data: notes } = await axios.get<Note[]>('/api/notes');
    return notes;
  });

  const createNoteMutation = useMutation(
    async (values: FormValues) => {
      const { data: newNote } = await axios.post<Note>('/api/notes', {
        title: values.title,
        content: values.content,
      });
      return newNote;
    },
    {
      onMutate() {
        form.reset({ title: '', content: '' });
      },
      onSuccess(newNote) {
        queryClient.setQueryData<Note[]>(['notes'], (currentNotes = []) => [...currentNotes, newNote]);
      },
    },
  );

  return (
    <main className="p-8">
      <h1 className="text-4xl bold mb-2">Notes</h1>

      <form
        className="flex space-x-2 mb-2 items-end"
        onSubmit={form.handleSubmit((values) => createNoteMutation.mutateAsync(values))}
      >
        <label>
          <span className="block">Title</span>
          <input
            type="text"
            {...form.register('title')}
            className="p-1 bg-slate-100 border-slate-300 border-2 rounded"
          />
        </label>
        <label>
          <span className="block">Content</span>
          <input
            type="text"
            {...form.register('content')}
            className="p-1 bg-slate-100 border-slate-300 border-2 rounded"
          />
        </label>
        <button
          type="submit"
          className="px-3 py-1.5 hover:bg-slate-400 transition-colors bg-slate-500 text-white rounded-md"
        >
          Create
        </button>
      </form>

      {isLoadingNotes && <p>Loading...</p>}

      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="p-2 bg-slate-100 rounded-md">
            <h2 className="font-bold">{note.title}</h2>
            <p className="text-sm">{note.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Home;
