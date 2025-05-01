import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
    commentOwner: object;
    blogOwner: object;
    commentBlog: object;
    comment: string; // Content of the blog post
}

const commentSchema: Schema<IComment> = new Schema<IComment>({
    commentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    blogOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    commentBlog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Blog",
    },
    comment: { 
        type: String, 
        required: false 
    },
}, { timestamps: true });
const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
export default Comment;