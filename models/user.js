/* User model */
'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const MessageSchema = new mongoose.Schema({
	From: {
		type: String
	},
	To: {
		type: String
	},
	content: {
		type: String,
		maxlength: 200
	}
})

const MovieSchema = new mongoose.Schema({
	movieid: {
		type: Number
	},
	name: {
		type: String
	},
	poster: {
		type: String
	}
})

const CommentSchema = new mongoose.Schema({
	nickname: {
		type: String
	},
	movie: {
		type: String
	},
	content: {
		type:String
	},
	poster: {
		type: String
	}
})

const ReportSchema = new mongoose.Schema({
	Reporter: {
		type: String
	},
	Author: {
		type: String
	},
	movie: {
		type: String
	},
	content: {
		type:String
	}
})

// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	}, 
	password: {
		type: String,
		required: true,
		minlength: 4
	},
	nickname: {
		type: String,
		maxlength: 10,
		minlength: 1,
		unique: true
	},
	type: {
		type: Number
	},
	messages: [MessageSchema],
	collections: [MovieSchema]
})

// const AdminSchema = new mongoose.Schema({
// 	messages: [MessageSchema],
// 	reports: [ReportSchema]
// })

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this // binds this to the User model

	// First find the user by their email
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema)
const Report = mongoose.model('Report', ReportSchema)
const Comment = mongoose.model('Comment', CommentSchema)
module.exports = { User, Report, Comment }
