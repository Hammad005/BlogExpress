import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { blogStore } from "./blogStore";

interface User {
    _id: object;
    name?: string;
    email: string;
    bio?: string;
    profilePics?: [{
        profileId?: string;
        profileImage?: string;
        dateTime?: Date;
    }];
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

interface UserStore {
    allUsers: User[] | null;
    user: User | null;
    loading: boolean;
    successLoading: boolean;
    deletePhotoLoading: boolean;
    checkingAuth: boolean;
    checkEmailLoading: boolean;
    getAllUsers: () => Promise<void>;
    signup: (data: { name: string; email: string; password: string }) => Promise<void>;
    login: (data: {  email: string; password: string }) => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    checkEmail: (email: string|undefined) => Promise<void>;
    updateProfile: (data: {  name:string | undefined, email: string | undefined; bio: string | undefined}) => Promise<void>;
    updateProfilePic: (profilePics: {  profilePics: string | ""}) => Promise<void>;
    deletePhoto: (id: string | "") => Promise<void>;
}

export const userStore = create<UserStore>((set) => ({
    user: null,
    allUsers: null,
    loading: false,
    successLoading: false,
    deletePhotoLoading: false,
    checkingAuth: true,
    checkEmailLoading: true,


    getAllUsers: async () => {
        try {
            const response = await axios.get<User[]>('/api/getAllUsers');
            set({ allUsers: response.data });
            console.log(response.data);
             // Update allUsers with the fetched data
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users"); // Show error message
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true }); // Set loading to true before the request
        try {
            const response = await axios.get('api/checkAuth');
            set({ user: response.data.user, checkingAuth: false }); // Update user and set loading to false
        } catch (error) {
            console.log(error);
            
        }
    },

    signup: async (data) => {
        set({ loading: true }); // Set loading to true before the request
        try {
            const response = await axios.post<{ user: User }>('api/signup',  data );
            set({ user: response.data.user, loading: false }); // Update user and set loading to false
            toast.success("Signup successful!"); // Show success message
        }catch (error: unknown) {
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.error || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ loading: false }); // Set loading to false in case of error
        }
    },
    login: async (data) => {
        set({ loading: true }); // Set loading to true before the request
        try {
            const response = await axios.post<{ user: User }>('api/login',  data );
            set({ user: response.data.user, loading: false }); // Update user and set loading to false
            toast.success("Login successful!"); // Show success message
        }catch (error: unknown) {
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.error || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ loading: false }); // Set loading to false in case of error
        }
    },
    logout: async () => {
        set({ loading: true }); // Set loading to true before the request
        try {
            await axios.post('api/logout'); // Call the logout API
            set({ user: null, loading: false }); // Clear user and set loading to false
            toast.success("Logout successful!"); // Show success message
        } catch (error: unknown) {
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.message || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ loading: false }); // Set loading to false in case of error
        }
    },
    checkEmail: async (email) => {
        try {
            await axios.post('/api/checkEmail', {email});
            set({checkEmailLoading: true});
        } catch (error: unknown) {
            console.log(error);
            
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.error || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ checkEmailLoading: false }); // Set loading to false in case of error
        }
    },
    updateProfile: async (data) => {
        set({ successLoading: true }); // Set loading to true before the request
        try {
            const response = await axios.put<{ user: User }>('api/editProfile',  data );
            set({ user: response.data.user, successLoading: false }); // Update user and set loading to false
            toast.success("Profile updated successfully!"); // Show success message
        }catch (error: unknown) {
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.error || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ successLoading: false }); // Set loading to false in case of error
        }
    },
    updateProfilePic: async (profilePics) => {
        set({ successLoading: true }); // Set loading to true before the request
        try {
            const response = await axios.put<{ user: User }>('api/uploadProfile',  profilePics );
            set({ user: response.data.user, successLoading: false }); // Update user and set loading to false
            toast.success("Profile updated successfully!"); // Show success message
            blogStore.getState().fetchBlogs(); // Fetch blogs after updating profile
        }catch (error: unknown) {
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.error || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ successLoading: false }); // Set loading to false in case of error
        }
    },
    deletePhoto: async (id) => {
        set({ deletePhotoLoading: true }); // Set loading to true before the request
        try {
            const response = await axios.put<{ user: User }>(`api/deleteProfilePic`, {id});
            set({ user: response.data.user, deletePhotoLoading: false }); // Update user and set loading to false
            toast.success("Photo deleted successfully!"); // Show success message
            blogStore.getState().fetchBlogs(); // Fetch blogs after updating profile
        }catch (error: unknown) {
            let errorMessage: string;
        
             if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as AxiosError;
                errorMessage = axiosError.response?.data.error || 'An unexpected error occurred'; // Fallback message
            } else {
                errorMessage = 'An unexpected error occurred'; // Fallback message
            }
        
            toast.error(errorMessage); // Show error message
            set({ deletePhotoLoading: false }); // Set loading to false in case of error
        }
    },
    
}));