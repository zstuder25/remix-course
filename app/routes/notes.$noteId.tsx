import { json, type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";
import styles from "~/styles/note-details.css";
import type { Note } from "~/types/Note";

export const meta: MetaFunction = ({ data }) => {
    return {
        title: data.title,
        description: "Manage your notes with ease."
    }
  }

const NoteDetailsPage = () => {
    const note = useLoaderData();

    return (
        <main id="note-details">
            <header>
                <nav>
                    <Link to={"/notes"}>Back to all Notes</Link>
                </nav>
                <h1>{note.title}</h1>
                <p id="note-details-content">{note.content}</p>
            </header>
        </main>
    )
};

export const loader: LoaderFunction = async ({params}) => {
    const notes: Note[] = await getStoredNotes();
    const noteId = params.noteId;

    const selectedNote = notes.find(note => note.id === noteId);
    if(!selectedNote){
        throw json({message: "Could not find note for id " + noteId}, { status: 404 })
    }
    return selectedNote;
};

export const links = () => [{rel: "stylesheet", href: styles}];

export default NoteDetailsPage