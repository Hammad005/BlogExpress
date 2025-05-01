import mongoose, { Document, Schema } from "mongoose";

interface ILike extends Document {
    likeOwner: object;
    likeBlog: object;
}

const likeSchema: Schema<ILike> = new Schema<ILike>({
    likeOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    likeBlog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Blog",
    },
    
}, { timestamps: true });
const Like = mongoose.models.Like || mongoose.model<ILike>("Like", likeSchema);
export default Like;