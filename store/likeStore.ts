import axios from "axios";
import { create } from "zustand";

interface Like {
    _id: object;
    likeOwner?: {
        _id: object;
        name: string;
        profilePics?: [
            {
                profileId?: string;
                profileImage?: string;
                dateTime?: Date;
            }
        ];
    };
    likeBlog?: object;
    createdAt: Date;
    updatedAt: Date;
}
interface AxiosError {
    response?: {
        data: {
            message?: string;
            error?: string;
        };
    };
}

interface LikeStore {
    likes: Like[];
    fetchLikes: () => Promise<void>;
    createLike: (likeBlog: string) => Promise<void>;
    removeLike: (id: object) => Promise<void>;
}

export const likeStore = create<LikeStore>((set, get) => ({
    likes: [],
    fetchLikes: async () => {
        try {
            const response = await axios.get("/api/getLikes");
            set({ likes: response.data });
        } catch (error) {
            const err = error as AxiosError;
            console.error(err.response?.data.message || "Failed to fetch likes.");
        }
    },
    createLike: async (likeBlog) => {
        ;
        try {
            await axios.post("/api/createLike", { likeBlog });
            get().fetchLikes(); // Refresh the likes after adding a new one
        } catch (error) {
            const err = error as AxiosError;
            console.error(err.response?.data.message || "Failed to add like.");
        }
    },
    removeLike: async (id: object) => {
        try {
            await axios.delete(`/api/removeLike/`, { data: { _id: id } });
            get().fetchLikes(); // Refresh the likes after removing one
        } catch (error) {
            const err = error as AxiosError;
            console.error(err.response?.data.message || "Failed to remove like.");
        }
    }
}));