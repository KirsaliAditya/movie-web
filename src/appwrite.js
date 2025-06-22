import { Client, Databases, Query, ID } from "appwrite";

const ProjectID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DatabaseID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CollectionID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(ProjectID);

const database = new Databases(client);

export const updateMovie = async (searchTerm, movie) => {

    console.log(DatabaseID, CollectionID, searchTerm, movie);
    try{
        const result = await database.listDocuments(DatabaseID, CollectionID, [
            Query.equal('searchTerm', searchTerm),
        ]);

        if (result.documents.length >0)
        {
            const doc = result.documents[0];

            await database.updateDocument(DatabaseID, CollectionID, doc.$id, {
                count: doc.count + 1,
            });
        }
        else {
            await database.createDocument(DatabaseID, CollectionID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            });
        }
    }
    catch (error) {
        console.error("Error updating movie:", error);
    }
}

export const getMovies = async (searchTerm) => {
    try {
        const result = await database.listDocuments(DatabaseID, CollectionID, [
            Query.limit(10),
            Query.orderDesc('count'),
        ]);

        if (result.documents.length > 0) {
            return result.documents;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};