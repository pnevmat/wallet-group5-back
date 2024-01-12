const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const budgetSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: "user"
        },
        budget: [{
					planAmount: {
						type: Number,
					},
					factAmount: {
						type: Number,
					},
					category: {
						type: String,
						trim: true,
						stringType: "lowercase",
					},
				}],
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

budgetSchema.plugin(mongoosePaginate);
const Budget = model("Budget", budgetSchema);

module.exports = Budget;