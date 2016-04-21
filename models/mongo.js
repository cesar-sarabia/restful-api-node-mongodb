var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/demoDb');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "userEmail" : String,
    "userPassword" : String
};
var otrSchema={
	"nombre":String
}
// create model if not exists.
var data = mongoose.model('datos',userSchema);
var otr = mongoose.model('otr',otrSchema)
module.exports = {
	datos:data,
	otro:otr
}