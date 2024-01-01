const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");



const transactionSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            // enum: ["income", "cost"],
        },
        amount: {
            type: Number,
        },
        comments: {
            type: String,
            trim: true,
            stringType: "lowercase",
            default: "-",
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: "user"
        },
        category: {
            type: String,
            trim: true,
            stringType: "lowercase",
            default: "Основной доход", //TODO написати функцію 
        },
        balance: {
            type: Number,
            // required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
    }
);

transactionSchema.plugin(mongoosePaginate);
const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;