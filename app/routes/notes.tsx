import NewNote, { links as NewNoteLink } from "~/components/NewNotes";
import NoteList, { links as NoteListLink } from "~/components/NoteList";
import { redirect, type ActionFunction, type LoaderFunction, ErrorBoundaryComponent, json, MetaFunction } from "@remix-run/node";
import { getStoredNotes, storeNotes } from "~/data/notes";
import { CatchBoundaryComponent, Link, useCatch, useLoaderData } from "@remix-run/react";

export default function NotesPage() {
    const notes = useLoaderData();

    return (
        <main>
            <NewNote />
            <NoteList notes={notes}/>
        </main>
    )
}

export const loader: LoaderFunction = async () => {
    const notes = await getStoredNotes();
    if(!notes || notes.length === 0) {
        throw json({message: "Could not find any notes."}, { status: 404, statusText: "Not Found"})
    }
    return notes;
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const noteData = Object.fromEntries(formData);
    noteData.id = new Date().toISOString(); 
    // Or
    // const noteData = {
    //     id: new Date().toISOString(),
    //     title: formData.get("title") || "",
    //     content: formData.get("content")
    // };
    if(noteData.title.toString().trim().length < 5) {
        return {message: "Invalid title - must be at least 5 characters long"}
    }


    const existingNotes = await getStoredNotes();
    const updatedNotes = existingNotes.concat(noteData);

    await storeNotes(updatedNotes);
    return redirect("/notes");
};

export const links = () => {
    return [...NewNoteLink(), ...NoteListLink()]
};

export const CatchBoundary: CatchBoundaryComponent = () => {
    const caughtResponse = useCatch();
    const message = caughtResponse.data?.message || "Data not found"
    return (
        <main>
            <NewNote />
            <p className="info-message">{message}</p>
        </main>
    )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }: any) => {
    return (
        <main className="error">
          <h1>An error related to your notes occured!</h1>
          <p>{error.message}</p>
          <p>Back to <Link to="/">saftey</Link></p>
        </main>
    )
}

export const meta: MetaFunction = () => {
    return {
        title: "All Notes",
        description: "Manage your notes with ease."
    }
}