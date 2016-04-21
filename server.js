var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoOp     =   require("./models/mongo");
var router      =   express.Router();
console.log('mongoOp ' + JSON.stringify(mongoOp,null,2));

app.use(bodyParser.urlencoded({"extended" : false}));
app.use(bodyParser.json());

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

router.route("/users")
    .get(function (req,res){
        var response = {};
        mongoOp.datos.find(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
 	.post(function (req,res){
		var db = new mongoOp.datos();
		var response = {};
		// fetch email and password from REST request.
		// Add strict validation when you use this in Production.
		db.userEmail = req.body.email;
		// Hash the password using SHA1 algorithm.
		db.userPassword = req.body.password;
			
		// require('crypto')
		// .createHash('sha1')
		/*.update(
			)*/
		// .digest('base64');		
		db.save(function(err){
			// save() will run insert() command of MongoDB.
			// it will add new data in collection.
			if(err) {
			response = {"error" : true, "message" : "Error adding data"};
			} else {
			response = {"error" : false, "message" : "Data added"};
			}
			res.json(response);
		});
	});

router.route("/users/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.datos.findById(req.params.id,function(err,data){
        // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
            console.log(response);
        });
    })
	.put(function(req, res){
		var response={};
		mongoOp.datos.findById(req.params.id, function (err,data){
			if(err){
				response={"error": true, "message":"Error fetching data"};
			}else{
				if(req.body.email !== undefined){
					data.userEmail=req.body.email;
				}
				if(req.body.password!=undefined){
					data.userPassword=req.body.password;
				}
				data.save(function(err){
					if(err){
						response={"error":true,"message":"Error update"}
					}else{
						response={"error":false, "message" : "Data is update for "+ req.params.id};
					}
					res.json(response);
				})
			}
		});
	})
	.delete(function(req,res){
		var response={};
		mongoOp.datos.findById(req.params.id, function(err, data){
			if(err){response={"error":true, "message":"error fetching data"}
			}else{
				mongoOp.datos.remove({_id : req.params.id},function(err){
					if (err){
						response={"error":true, "message":"error deleting"}
					}else{

					response={"error":false, "message":"delete ok"}
					}
					res.json(response);
				});
			}

		});

	})

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");