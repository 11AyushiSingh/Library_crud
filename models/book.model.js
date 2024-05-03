const mongoose = require('mongoose')
const { buffer } = require('stream/consumers')
const bookSchema = mongoose.Schema(
    {
       title: {
           type: String,
           required: true
        },
        image: {
            data: Buffer,
            contentType:String,
        },
        author: {
            type: String,
            required: true
        },
        publicationYear: {
            type: Number,
            required: true
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User', required: true 
        },
    }
)

module.exports = BookModel = mongoose.model('BookModel',bookSchema)