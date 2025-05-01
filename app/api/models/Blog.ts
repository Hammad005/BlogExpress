import mongoose, { Document, Schema } from "mongoose";

export interface IblogPics {
    picId?: string;
    picUrl?: string;
    dateTime?: Date;
}

interface IBlog extends Document {
    blogPics: IblogPics[]; // Array of profile picture objects
    blogOwner: object;
    blogContent: string; // Content of the blog post
    blogCategory: string;
}

const BlogSchema: Schema<IBlog> = new Schema<IBlog>({
    blogPics: {
        type: [
            {
                picId: { type: String, required: false },
                picUrl: { type: String, required: false },
                dateTime: { type: Date, default: Date.now() }
            },
        ],
        default: [],
    },
    blogOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    blogContent: { 
        type: String, 
        required: false 
    },
    blogCategory: { 
        type: String, 
        required: true,
        enum:["Tech", "Fitness", "Travel", "Food", "Business", "Education"]
    },
}, { timestamps: true });
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;