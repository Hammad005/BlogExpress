import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface Blog {
    _id: object;
    blogPics?: [{
        picId?: string;
        picUrl?: string;
        dateTime?: Date;
    }];
    blogOwner?: {
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
    blogContent: string;
    blogCategory?: string;
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

interface BlogStore {
    blogs: Blog[];
    blogLoading: boolean;
    deleteBlogLoading: boolean;
    updateBlogLoading: boolean;
    fetchBlogLoading: boolean;
    createBlog: (blog: { blogPics: string[] | undefined; blogContent: string | undefined; blogCategory: string | undefined }) => Promise<void>;
    fetchBlogs: () => Promise<void>;
    deleteBlog: (id: object) => Promise<void>;
    updateBlog: (blog: object) => Promise<void>;
}

export const blogStore = create<BlogStore>((set, get) => ({
    blogs: [],
    blogLoading: false,
    deleteBlogLoading: false,
    updateBlogLoading: false,
    fetchBlogLoading: true,
    createBlog: async (blog) => {
        set({ blogLoading: true }); // Set loading to true before the request
        try {
            await axios.post('/api/createBlog', blog);
            toast.success("Blog created successfully!");
            get().fetchBlogs(); // Fetch blogs after creating a new one
            set({ blogLoading: false }); // Set loading to false after the request
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
            set({ blogLoading: false }); // Set loading to false in case of an error
        }
    },
    fetchBlogs: async () => {
        set({ fetchBlogLoading: true }); // Set loading to true before the request
        try {
            const response = await axios.get('/api/getAllBlog');
            set({ blogs: response.data, fetchBlogLoading: false }); // Update blogs and set loading to false
            
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
            set({ fetchBlogLoading: false }); // Set loading to false in case of an error
        }
    },
    deleteBlog: async (id) => {
        set({ deleteBlogLoading: true }); // Set loading to true before the request
        try {
            await axios.delete('/api/deleteBlog', { data: { _id: id } });
            toast.success("Blog deleted successfully!");
            get().fetchBlogs(); // Fetch blogs after deleting one
            set({ deleteBlogLoading: false }); // Set loading to false after the request
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
            set({ deleteBlogLoading: false }); // Set loading to false in case of an error
        }
    },
    updateBlog: async (blog) => {
        set({ updateBlogLoading: true }); // Set loading to true before the request
        try {
            console.log({blog});
            
            await axios.put('/api/editBlog', {blog})
            toast.success("Blog updated successfully!");
            set({ updateBlogLoading: false }); // Set loading to false after the request
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.data.error || err.response?.data.message || "An error occurred");
            toast.error(err.response?.data.error || err.response?.data.message || "An error occurred");
            set({ updateBlogLoading: false }); // Set loading to false in case of an error
        }
    }
}));