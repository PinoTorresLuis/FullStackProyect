import { Schema, model } from "mongoose";

const messagesSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
})

export const messagesModel = model ('messages', messagesSchema)