const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const transactionSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["income", "cost"],
        },
        amount: {
            type: Number,
        },
        comments: {
            type: String,
            trim: true,
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: "user"
        },
        category: {
            type: String,
            enum: [
                "Основные расходы",
                "Продукты",
                "Машина",
                "Забота о себе",
                "Забота о детях",
                "Товары для дома",
                "Образование",
                "Досуг",
                "Прочее",
                "Другие расходы"
            ]
        }
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