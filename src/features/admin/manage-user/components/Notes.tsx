import { useId, useState } from 'react';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import TextArea from '../../../../components/input/TextArea';
import { UserResponse } from '../../../../api/user/GetUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import GetUserNotes from '../../../../api/notes/GetUserNotes';
import renderToastError from '../../../../utils/renderToastError';
import CreateUserNote from '../../../../api/notes/CreateUserNote';
import FloatingLoadingSpinner from '../../../../components/ui/FloatingLoadingSpinner';
import DeleteUserNote from '../../../../api/notes/DeleteUserNote';
import Heading3 from '../../../../components/headings/Heading3';

export default function Notes({ user }: { user: UserResponse }) {
    const addID = useId();
    const [newNote, setNewNote] = useState<string>('');

    const queryClient = useQueryClient();

    const { data: notes } = useQuery({
        queryKey: ['notes', user.ID],
        queryFn: () => GetUserNotes(user.ID),
    });

    const postNoteMutation = useMutation({
        mutationFn: () => {
            setNewNote(newNote.trim());
            return toast.promise(CreateUserNote(user.ID, newNote.trim()), { pending: 'Creating note...', success: 'Note added', error: renderToastError });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['notes', user.ID] });
            setNewNote('');
        },
    });

    const deleteNoteMutation = useMutation({
        mutationFn: (noteID: number) => toast.promise(DeleteUserNote(noteID), { pending: 'Deleting note...', success: 'Note deleted', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['notes', user.ID] });
        },
    });

    return (
        <section className='bg-theme-700 border border-theme-outline p-4 round:rounded-xl'>
            <Heading3>Notes</Heading3>
            {notes !== undefined && notes.length !== 0
                ? <ul className='relative'>
                    {notes?.map((note) => (
                        <li className='border p-2 my-2' key={note.ID}>
                            <p>{note.Content}</p>
                            <div className='flex justify-between'>
                                <p className='text-sm text-gray-400'>{new Date(note.CreatedAt).toLocaleString()}</p>
                                <button className='text-sm text-red-400 underline-t' onClick={() => deleteNoteMutation.mutate(note.ID)}>remove</button>
                            </div>
                        </li>
                    ))}
                    <FloatingLoadingSpinner isLoading={postNoteMutation.isPending || deleteNoteMutation.isPending} />
                </ul>
                : <p>No notes</p>
            }
            <FormGroup>
                <FormInputLabel htmlFor={addID}>Add new note</FormInputLabel>
                <TextArea id={addID} className='border p-2 w-full' value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                <div className='flex justify-between'>
                    <PrimaryButton onClick={() => postNoteMutation.mutate()} loading={postNoteMutation.isPending} disabled={newNote === ''}>Add</PrimaryButton>
                    <p>{newNote.length}/1000</p>
                </div>
            </FormGroup>
        </section>
    );
}
