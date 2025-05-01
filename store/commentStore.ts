import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface Comment {
    _id: object;
    commentOwner?: {
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
    blogOwner?: object;
    commentBlog?: {
        _id: object;
    };
    comment: string;
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

interface CommentStore {
    comments: Comment[];
    postCommentLoading: boolean;
    fetchCommentLoading: boolean;
    fetchComments: () => Promise<void>;
    createComment: (comment: object) => Promise<void>;
    deleteComment: (id: object) => Promise<void>;
}

export const commentStore = create<CommentStore>((set) => ({
    comments: [],
    postCommentLoading: false,
    fetchCommentLoading: false,
    fetchComments: async () => {
        set({ fetchCommentLoading: true }); // Set loading to true before the request
        try {
            const response = await axios.get('/api/getComments');
            set({ comments: response.data }); // Update the comments state with the fetched comments
            set({ fetchCommentLoading: false }); // Set loading to false after the request
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
            set({ fetchCommentLoading: false }); // Set loading to false in case of an error
        }
    },
    createComment: async (comment) => {
        set({ postCommentLoading: true }); // Set loading to true before the request
        try {
            const response = await axios.post('/api/createComment', comment);
            const newComment = response.data.comment; // Assuming the response contains the new comment
            set((state) => ({ comments: [newComment, ...state.comments] })); // Update the comments state with the new comment
            set({ postCommentLoading: false }); // Set loading to false after the request
            toast.success("Comment post successfully!");
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
            set({ postCommentLoading: false }); // Set loading to false in case of an error
        }
    },
    deleteComment: async (id) => {
        try {
            await axios.delete('/api/deleteComment', { data: { _id: id } });
            toast.success("Comment deleted successfully!");
            set((state) => ({ comments: state.comments.filter((comment) => comment._id !== id) })); // Remove the deleted comment from the state

        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
        }
    }
}));