
'use strict';
const log = console.log

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')

// import the mongoose models
const { User, Report, Comment } = require('./models/user')

// to validate object IDs
const { ObjectID } = require('mongodb')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

// express-session for managing user sessions
const session = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }));

/*** Session handling **************************************/
// Create a session cookie
app.use(session({
    secret: 'oursecret',
    resave: false,
	saveUninitialized: false,
    cookie: {
        expires: 600000000000,
        httpOnly: true
    }
}));

// Our own express middleware to check for 
// an active user on the session cookie (indicating a logged in user.)
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/dashboard'); // redirect to dashboard if logged in.
    } else {
        next(); // next() moves on to the route.
    }    
};


/** User routes below **/
// Set up a POST route to *create* a user of your web app (*not* a student).
app.post('/signup', (req, res) => {
	// Create a new user
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		nickname: req.body.nickname,
		type: 0
	})

	// Save the user
	user.save().then((user) => {
		req.session.user = user._id;
		res.send(user)
	}, (error) => {
		res.status(400).send() // 400 for bad request
	})
})


// A route to login and create a session
app.post('/users/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password
	// Use the static method on the User model to find a user
	// by their email and password
	User.findByUsernamePassword(username, password).then((user) => {
		if (!user) {
			res.redirect('/signin');
		} else {
			// Add the user's id to the session cookie.
			// We can check later if this exists to ensure we are logged in.
			req.session.user = user._id;
			if (user.type === 0) {
				res.redirect('/user')
			} else {
				res.redirect('/admin')
			}
		}
	}).catch((error) => {
		res.status(400).redirect('/signin');
	})
})


// A route to logout a user
app.get('/users/logout', (req, res) => {
	// Remove the session
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})


/*** Webpage routes below **********************************/
// Inject the sessionChecker middleware to any routes that require it.
// sessionChecker will run before the route handler and check if we are
// logged in, ensuring that we go to the dashboard if that is the case.

// The various redirects will ensure a proper flow between login and dashboard
// pages so that your users have a proper experience on the front-end.

// route for root: should redirect to login route
app.get('/', (req, res) => {
	res.redirect('/index')
})

app.get('/index', (req, res) => {
	res.sendFile(__dirname + '/public/Index.html');
})

app.get('/signin', (req, res) => {
	res.sendFile(__dirname + '/public/SignIn.html')
})

app.get('/signup', (req, res) => {
	res.sendFile(__dirname + '/public/SignUp.html')
})

app.get('/search', (req, res) => {
	res.sendFile(__dirname + '/public/Search.html')
})

app.get('/admin', (req, res) => {
	if (req.session.user){
		User.findById(req.session.user).then((user) => {
			if (!user) {
				 res.status(404).send()
		   } else {
			   if (user.type === 0) {
				res.sendFile(__dirname + '/public/UserMain.html')
			   } else {
				res.sendFile(__dirname + '/public/AdminMain.html')
			   }
		   }
	   }).catch((error) => {
			res.status(500).send()
	   })
	} else {
		res.redirect('/signin');
	}
})

app.get('/user', (req, res) => {
	if (req.session.user){
		User.findById(req.session.user).then((user) => {
			if (!user) {
				 res.status(404).send()
		   } else {
			   if (user.type === 0) {
				res.sendFile(__dirname + '/public/UserMain.html')
			   } else {
				res.sendFile(__dirname + '/public/AdminMain.html')
			   }
		   }
	   }).catch((error) => {
			res.status(500).send()
	   })
	} else {
		res.redirect('/signin');
	}
})

app.get('/user_profile', (req, res) => {
	if (req.session.user){
		res.sendFile(__dirname + '/public/UserProfile.html')
	} else {
		res.redirect('/signin');
	}
})

app.get('/movieinfo', (req, res) => {
	res.sendFile(__dirname + '/public/MovieInfo.html')
})

// dashboard route will check if the user is logged in and server
// the dashboard page
// app.get('/user', (req, res) => {
// 	if (req.session.user) {
// 		res.sendFile(__dirname + '/public/UserMain.html');
// 	} else {
// 		res.redirect('/login')
// 	}

// })

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/image", express.static(__dirname + '/public/image'))
app.use("/css", express.static(__dirname + '/public/css'))

/*********************************************************/

/*** API Routes below ************************************/

/// a GET route to get a student by their id.
// id is treated as a wildcard parameter, which is why there is a colon : beside it.
// (in this case, the database id, but you can make your own id system for your project)
// app.get('/users/:id', (req, res) => {
// 	/// req.params has the wildcard parameters in the url, in this case, id.
// 	// log(req.params.id)
// 	const id = req.params.id

// 	// Good practise: Validate id immediately.
// 	if (!ObjectID.isValid(id)) {
// 		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
// 	}

// 	// Otherwise, findById
// 	Student.findById(id).then((student) => {
// 		if (!student) {
// 			res.status(404).send()  // could not find this student
// 		} else {
// 			/// sometimes we wrap returned object in another object:
// 			//res.send({student})   
// 			res.send(student)
// 		}
// 	}).catch((error) => {
// 		res.status(500).send()  // server error
// 	})

// })

// a PATCH route for changing properties of a resource.
// (alternatively, a PUT is used more often for replacing entire resources).
app.post('/users/update', (req, res) => {
	const id = req.session.user
	// get the updated name and year only from the request body.
	const nickname = req.body.nickname
	const password = req.body.password
	const old = req.body.oldPassword

	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			user.nickname = nickname
			user.password = password
			// Save the user
			user.save().then((user) => {
				res.send(user)
			}, (error) => {
				res.status(400).send() // 400 for bad request
			})
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.post('/users/comment', (req, res) => {
	if (!req.session.user) {
		res.status(201).send()
	} else {
	const id = req.session.user
	// get the updated name and year only from the request body.
	const content = req.body.content
	const movie = req.body.movie
	const poster = req.body.poster
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			const comment = new Comment ({
				nickname: user.nickname,
				movie: movie,
				content: content,
				poster: poster
			})
			// Save the user
			comment.save().then((comment) => {
				res.send(user)
			}, (error) => {
				res.status(400).send() // 400 for bad request
			})
		}
	}).catch((error) => {
		res.status(500).send()
	})
}
})

app.get('/users/comment', (req, res) => {
	Comment.find().then((comments) => {
		res.send({comments})
    }, (error) => {
		res.status(500).send(error)
    })
})

/// Route for getting information for one user.
// GET /user/id
app.post('/users/sendmsg', (req, res) => {
	const id = req.session.user
	// get the updated name and year only from the request body.
	const msg = req.body
	const userToFind = msg.To

	// Fetching Student documents
	User.findById(id).then((fromUser) => {
		if(!fromUser) {
			res.status(404).send()
		} else {
			msg.From = fromUser.nickname
		}
	})

	User.find({nickname: userToFind}).then((user) => {
		if(!user) {
			res.status(404).send()
		} else {
			user[0].messages.push(msg)
			user[0].save().then((userRes) => {
				res.send(userRes)
			}, (error) => {
				res.status(400).send() // 400 for bad request
			})
		}
	})
})

app.get('/users/sendmsg', (req, res) => {
	const id = req.session.user
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user.messages)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.post('/admin/update', (req, res) => {
	const username = req.body.username
	const password = req.body.password
	User.find().then((users) => {
	 	let user = users.filter((user) => user.username === username)[0]
	 	user.password = password
	 	user.save().then((user) => {
	  		res.send(user)
	 	}, (error) => {
	  		res.status(400).send() // 400 for bad request
	 	})
	}, (error) => {
	 	res.status(500).send(error)
	})
})
   
app.get('/users/current', (req, res) => {
	const id = req.session.user
	User.findById(id).then((user) => {
	 	if (!user) {
	  		res.status(404).send()
		} else {
	  		res.send(JSON.stringify(user.nickname))
		}
	}).catch((error) => {
	 	res.status(500).send()
	})
})
   
app.get('/users', (req,res) => {
	User.find().then((users) => {
	 	res.send({users})
	}, (error) => {
	 	res.status(500).send(error)
	})
})

app.delete('/users/:nickname', (req, res) => {
	const nickname = req.params.nickname
	User.find().then((users) => {
		let user = users.filter((user) => user.nickname === nickname)[0]
		const id = user.id
		User.findByIdAndRemove(id).then((user) => {
			if (!user) {
				res.status(404).send()
			} else {
				res.send(user)
			}
		}).catch((error) => {
			res.status(500).send() // server error, could not delete.
		})
   }, (error) => {
		res.status(500).send(error)
   })
})

app.get('/admin/reports', (req, res) => {
	Report.find().then((reports) => {
		res.send({ reports })
	},(error) => {
		res.status(500).send(error)
	})
})

// Add report (This is for POSTMAN)
app.post('/reports', (req, res) => {
	const report = new Report({
		Reporter: req.body.Reporter,
		Author: req.body.Author,
		movie: req.body.movie,
		content: req.body.content
	})
	report.save().then((report) => {
		res.send(report)
	}, (error) => {
		res.status(400).send() // 400 for bad request
	})
})

// Add report (This is for Web user)
app.post('/users/reports', (req, res) => {
	if (!req.session.user) {
		res.status(201).send()
	} else {
	const id = req.session.user
	const Author = req.body.Author
	const movie = req.body.movie
	const content = req.body.content
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			const Reporter = user.nickname
			const report = new Report({
				Author: Author,
				Reporter: Reporter,
				movie: movie,
				content: content
			})
			report.save().then((report) => {
				res.send(report)
			}, (error) => {
				res.status(400).send() // 400 for bad request
			})
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})}
})

// Add report (This is for POSTMAN)
app.post('/messages/:id', (req, res) => {
	const id = req.params.id
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			const message = {
				From: req.body.From,
				To: req.body.To,
				content: req.body.content
			}
			user.messages.push(message)
			user.save().then((user) => {
				res.send(user)
			}, (error) => {
				res.status(400).send() // 400 for bad request
			})
		}	
	}).catch((error) => {
		res.status(500).send()
	})
})


/// Route for getting information for one user.
// GET /user/id
app.post('/users/collections', (req, res) => {
	if (! req.session.user) {
		res.status(201).send()
	} else {
	const id = req.session.user
	// get the updated name and year only from the request body.
	const collection = req.body

	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			user.collections.push(collection)
			user.save().then((userRes) => {
				res.send(userRes)
			}, (error) => {
				res.status(400).send() // 400 for bad request
			})
		}
	})
}
})

app.get('/users/collections', (req, res) => {
	const id = req.session.user
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user.collections)
		}
	})
})

app.delete('/reports', (req, res) => {
	const reporter = req.body.reporter
	const content = req.body.content
	Report.find().then((reports) => {
		const toDelete = reports.filter((report) => (report.Reporter === reporter) && (report.content === content))[0]._id
		log(toDelete)
		Report.findByIdAndRemove(toDelete).then((report) => {
			if (!report) {
				res.status(404).send()
			} else {
				res.send(report)
			}
		}).catch((error) => {
			res.status(500).send() // server error, could not delete.
		})
	},(error) => {
		res.status(500).send(error)
	})
})

app.delete('/comments', (req, res) => {
	const nickname = req.body.nickname
	const movie = req.body.movie
	const content = req.body.content
	Comment.find().then((comments) => {
		const toDelete = comments.filter((comment) => (comment.nickname === nickname) && (comment.content === content) && (comment.movie === movie))[0]._id
		log(toDelete)
		Comment.findByIdAndRemove(toDelete).then((comment) => {
			if (!comment) {
				res.status(404).send()
			} else {
				res.send(comment)
			}
		}).catch((error) => {
			res.status(500).send() // server error, could not delete.
		})
	},(error) => {
		res.status(500).send(error)
	})
})

app.post("/users/collections/bynickname", (req, res) => {
	const nickname = req.body.nickname
	User.find().then((users) => {
		const target = users.filter((user) => user.nickname === nickname)[0]
		res.send(target.collections)
	})
})

/*************************************************/
// Express server listening...
const port = process.env.PORT || 3001
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 


