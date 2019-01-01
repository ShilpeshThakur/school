var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
app.set('view engine', 'pug');
app.set('views','./views');

///
///	Create connection to MySQL database server.
/// 
function getMySQLConnection() {
	return mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'school'
	});
}




// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


app.get('/', function(req, res){
    var noticeList = [];
    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from notice", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                let notice = {
                    'title':rows[i].title,
                    'description':rows[i].description,
                    
                }
                // Add o bject into array
                noticeList.push(notice);
            } 
            console.log(noticeList);
            res.render('Home',{
                noticeList : noticeList

            });
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
});


app.post('/register', function(req, res){

    var connection = getMySQLConnection();
    
    
    connection.connect();
    var student = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        contact: req.body.contact,
        class: req.body.cls,
        username: req.body.u_name,
        password: req.body.pwd,
        address: req.body.address
    }
    // console.log(student);
    
    connection.query("insert into student(name, surname, email, contact, class, username, password, address) values('"+student.name+"', '"+student.surname+"','"+student.email+"','"+student.contact+"','"+student.class+"', '"+student.username+"', '"+student.password+"', '"+student.address+"')", function(err, rows, fields) {
        if (err) {
            // res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            res.render('Add_Student', {
                message: 'Something went wrong'+err
            });
        }
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();
        
        res.redirect('/Student_Record/'+destid);
        connection.end();

    });    
});

app.post('/register_Student', function(req, res){

    var connection = getMySQLConnection();
    
    
    connection.connect();
    var student = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        contact: req.body.contact,
        class: req.body.cls,
        username: req.body.u_name,
        password: req.body.pwd,
        address: req.body.address
    }
    // console.log(student);
    
    connection.query("insert into student(name, surname, email, contact, class, username, password, address) values('"+student.name+"', '"+student.surname+"','"+student.email+"','"+student.contact+"','"+student.class+"', '"+student.username+"', '"+student.password+"', '"+student.address+"')", function(err, rows, fields) {
        if (err) {
            // res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            res.render('Add_Student', {
                message: 'Something went wrong'+err
            });
        }
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();
        
        res.redirect('/Teacher_Record/'+destid);
        connection.end();

    });    
});

app.post('/Add_Teacher', function(req, res){
    var connection = getMySQLConnection();
    
    
    connection.connect();
    var teacher = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        contact: req.body.contact,
        qualification: req.body.qualification,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address
    }
     console.log(teacher);
    
    connection.query("insert into teacher(name, surname, email, contact, qualification, username, password, address) values('"+teacher.name+"', '"+teacher.surname+"','"+teacher.email+"','"+teacher.contact+"','"+teacher.qualification+"', '"+teacher.username+"', '"+teacher.password+"', '"+teacher.address+"')", function(err, rows, fields) {
        if (err) {
            // res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            res.render('Add_Teacher', {
                message: 'Something went wrong'+err
            });
        }
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();

        res.redirect('/Teacher_Record/'+destid);
        connection.end();

    });
});

app.post('/Admin_Add_Notice', function(req, res){
    var connection = getMySQLConnection();
    
    
    connection.connect();
    var notice = {
       title: req.body.title,
       description: req.body.description
     
    }
    //  console.log(teacher);
    
    connection.query("insert into notice(title,description) values('"+notice.title+"', '"+notice.description+"')", function(err, rows, fields) {
        if (err) {
            // res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            res.render('Admin_Add_Notice', {
                message: 'Something went wrong'+err
            });
        }
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();
        console.log(req.headers.referer);


        res.redirect('/Teacher_Record/'+destid);
        connection.end();

    });
});



app.get('/Home', function(req, res){
    res.render('Home');
    
 }); 

app.get('/Student_Login', function(req, res){

    res.render('Student_Login', {

    });
});

app.post('/Student_Login', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select id from student where username = '"+ req.body.username+"' and password = '"+req.body.password+"'", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            console.log(rows);
            if(rows.length>0){
                res.redirect('Student_Profile/'+rows[0].id)
            }
            else{
                res.status(201).json({"status_code": 201,"status_message": "unauthenticated user"});
            }
        }
    });
    
});

app.get('/Teacher_Login', function(req, res){

    res.render('Teacher_Login', {
      
    });
});

app.post('/Teacher_Login', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select id from teacher where username = '"+ req.body.username+"' and password = '"+req.body.password+"'", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            console.log(rows);
            if(rows.length>0){
                res.redirect('Student_Record/'+rows[0].id)
            }
            else{
                res.status(201).json({"status_code": 201,"status_message": "unauthenticated user"});
            }
        }
    });
    
});

app.get('/Admin_Login', function(req, res){

    res.render('Admin_Login', {

    });
});

app.post('/Admin_Login', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select id from admin where username = '"+ req.body.username+"' and password = '"+req.body.password+"'", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            console.log(rows);
            if(rows.length>0){
                res.redirect('/Teacher_Record/'+rows[0].id)
            }
            else{
                res.status(201).json({"status_code": 201,"status_message": "unauthenticated user"});
            }
        }
    });
    
});


app.get('/Teacher_Profile/:id', function(req, res){

    // var studentList = [];
    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from teacher where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            // console.log("rows ", rows);

                // Create an object to save current row's data
                    let teacher = {
                        'name':rows[0].name,
                        'surname':rows[0].surname,
                        'contact':rows[0].contact,
                        'id':rows[0].id,
                        'email':rows[0].email,
                        'qualification':rows[0].qualification,
                        'address':rows[0].address,
                        'username':rows[0].username
                    }

                    
                // Add object into array
                // console.log(teacher);
                
                res.render('Teacher_Profile', {
                    teacher: teacher
                });
                           
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});

app.get('/Add_Student/:id', function(req, res){

    //console.log('I m here');
    res.render('Add_Student', {

    });
});

app.get('/Admin_Add_Student/:id', function(req, res){

    console.log('I m in admin_add_student');
    res.render('Admin_Add_Student', {

    });
});

app.get('/Add_Teacher/:id', function(req, res){

    // console.log('I m here');
    res.render('Add_Teacher', {

    });
});

app.get('/Admin_Add_Notice/:id', function(req, res){

    // console.log('I m here');
    res.render('Admin_Add_Notice', {

    });
});



app.get('/View_Teacher/:id', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from teacher where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            

                // Create an object to save current row's data
                let teacher = {
                    'name':rows[0].name,
                    'surname':rows[0].surname,
                    'contact':rows[0].contact,
                    'id':rows[0].id,
                    'email':rows[0].email,
                    'qualification':rows[0].qualification,
                    'address':rows[0].address,
                    'username':rows[0].username
                }
                // Add object into array
                // studentList.push(student);
                console.log(teacher);
                
                res.render('View_Teacher', {
                    teacher : teacher
                });
                
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    

});

app.get('/View_Student/:id', function(req, res){

    // var studentList = [];
    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from student where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            

                // Create an object to save current row's data
                let student = {
                    'name':rows[0].name,
                    'surname':rows[0].surname,
                    'contact':rows[0].contact,
                    'id':rows[0].id,
                    'email':rows[0].email,
                    'class':rows[0].class,
                    'address':rows[0].address,
                    'username':rows[0].username
                }
                // Add object into array
                // studentList.push(student);
                console.log(student);
                
                res.render('View_Student', {
                    student: student
                });
                
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});

app.get('/View_Notice/:id', function(req, res){

    // var studentList = [];
    var connection = getMySQLConnection();
    connection.connect();
    console.log(req.params.id);
    connection.query("select * from notice where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            

                // Create an object to save current row's data
                let notice = {
                    'title':rows[0].title,
                    'description':rows[0].description,
                }
                // Add object into array
                // studentList.push(student);
                console.log(notice);
                
                res.render('View_Notice', {
                    notice: notice
                });
                
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});


app.get('/Student_Profile/:id', function(req, res){


    // var studentList = [];
    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from student where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            

                // Create an object to save current row's data
                let student = {
                    'name':rows[0].name,
                    'surname':rows[0].surname,
                    'contact':rows[0].contact,
                    'id':rows[0].id,
                    'email':rows[0].email,
                    'class':rows[0].class,
                    'address':rows[0].address,
                    'username':rows[0].username
                }
                // Add object into array
                // studentList.push(student);
                console.log(student);
                
                res.render('student_profile', {
                    student: student
                });
                
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    

    
});


app.get('/Update_Student/:id', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from student where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            var hrefpath=req.headers.referer;
            var destid = hrefpath.split('/').pop();

                // Create an object to save current row's data
                let student = {
                    'name':rows[0].name,
                    'surname':rows[0].surname,
                    'contact':rows[0].contact,
                    'id':rows[0].id,
                    'email':rows[0].email,
                    'class':rows[0].class,
                    'address':rows[0].address,
                    'username':rows[0].username,
                    'password':rows[0].password,
                    'modifier':destid
                }
                // Add object into array
                // studentList.push(student);
                console.log(student);
                
                res.render('Update_Student', {
                    student: student
                });
                
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    

});

app.post('/Update_Student/:id', function(req, res){

    var connection = getMySQLConnection();
    
    console.log(req.body);

    connection.connect();
    var student = {
        id:req.params.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        contact: req.body.contact,
        class: req.body.cls,
        password: req.body.pwd,
        address: req.body.address
    }
    console.log(student);
    
    connection.query("update student set name = '"+student.name+"' , surname = '"+student.surname+"' , email = '"+student.email+"' , contact = '"+student.contact+"' , class = '"+student.class+"' , password = '"+student.password+"' , address = '"+student.address+"' where id = "+student.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            
        }
        // res.status(200).json({"status_code":200,"status_message": "success"});
        res.redirect('/Student_Record/'+req.body.modi);
        connection.end();

    });    
});

app.get('/Admin_Update_Student/:id', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from student where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            var hrefpath=req.headers.referer;
            var destid = hrefpath.split('/').pop();

                // Create an object to save current row's data
                let student = {
                    'name':rows[0].name,
                    'surname':rows[0].surname,
                    'contact':rows[0].contact,
                    'id':rows[0].id,
                    'email':rows[0].email,
                    'class':rows[0].class,
                    'address':rows[0].address,
                    'username':rows[0].username,
                    'password':rows[0].password,
                    'modifier':destid
                }
                // Add object into array
                // studentList.push(student);
                console.log(student);
                
                res.render('Admin_Update_Student', {
                    student: student
                });
                
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    

});

app.post('/Admin_Update_Student/:id', function(req, res){

    var connection = getMySQLConnection();
    
    console.log(req.body);

    connection.connect();
    var student = {
        id:req.params.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        contact: req.body.contact,
        class: req.body.cls,
        password: req.body.pwd,
        address: req.body.address
    }
    console.log(student);
    
    connection.query("update student set name = '"+student.name+"' , surname = '"+student.surname+"' , email = '"+student.email+"' , contact = '"+student.contact+"' , class = '"+student.class+"' , password = '"+student.password+"' , address = '"+student.address+"' where id = "+student.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            
        }
        // res.status(200).json({"status_code":200,"status_message": "success"});
        res.redirect('/Teacher_Record/'+req.body.modi);
        connection.end();

    });    
});


app.get('/Update_Teacher/:id', function(req, res){

    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from teacher where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            

                // Create an object to save current row's data
                let teacher = {
                    'name':rows[0].name,
                    'surname':rows[0].surname,
                    'contact':rows[0].contact,
                    'id':rows[0].id,
                    'email':rows[0].email,
                    'qualification':rows[0].qualification,
                    'address':rows[0].address,
                    'username':rows[0].username,
                    'password':rows[0].password
                }
                // Add object into array
                // studentList.push(student);
                console.log(teacher);
                
                res.render('Update_Teacher', {
                    teacher : teacher
                });            
        }    
    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});

app.post('/Update_Teacher/:id', function(req, res){

    var connection = getMySQLConnection();  
    //console.log(req.body);
    connection.connect();
    var teacher = {
        id:req.params.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        contact: req.body.contact,
        qualification: req.body.qualification,
        password: req.body.pwd,
        address: req.body.address
    }
    console.log(teacher);
    
    connection.query("update teacher set name = '"+teacher.name+"' , surname = '"+teacher.surname+"' , email = '"+teacher.email+"' , contact = '"+teacher.contact+"' , qualification = '"+teacher.qualification+"' , password = '"+teacher.password+"' , address = '"+teacher.address+"' where id = "+teacher.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});            
        }
        // res.status(200).json({"status_code":200,"status_message": "success"});
        res.redirect('/Teacher_Record/'+req.params.id);
        connection.end();

    });    
});


app.get('/Admin_Update_Notice/:id' ,function(req,res){

    var connection =getMySQLConnection();
    connection.connect();

    connection.query("select * from notice where id = "+req.params.id, function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            
            var hrefpath=req.headers.referer;
            var destid = hrefpath.split('/').pop();

            
                // Create an object to save current row's data
                let notice = {
                    'title':rows[0].title,
                    'description':rows[0].description,
                    'id':rows[0].id,
                    'modi':destid
                }
                // Add object into array
                // studentList.push(student);
                console.log("attention here");
                console.log(notice.modi);
                
                res.render('Admin_Update_Notice', {
                    notice : notice
                });            
        }    
    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});

app.post('/Admin_Update_Notice/:id',function(req,res){
    var connection = getMySQLConnection();  
    //console.log(req.body);
    connection.connect();

    console.log(req.body);

    var notice = {
        id:req.params.id,
        title: req.body.title,
        description: req.body.description
        
    }
    console.log(notice);
    
    connection.query("update notice set title = '"+notice.title+"' , description = '"+notice.description+"' where id = "+notice.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});            
        }
        // res.status(200).json({"status_code":200,"status_message": "success"});
    
        res.redirect('/Teacher_Record/'+req.body.modi);
        connection.end();

    });


});


app.get('/Delete_Student/:id', function(req, res){

    var connection = getMySQLConnection();
    
    console.log(req.body);

    connection.connect();
    
    
    connection.query("delete from student  where id = "+req.params.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            
        }
        // res.status(200).json({"status_code":200,"status_message": "success"});
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();

        res.redirect('/Student_Record/'+ destid);
        connection.end();

    });    
});

app.get('/Admin_Delete_Student/:id', function(req, res){

    var connection = getMySQLConnection();
    
    console.log(req.body);

    connection.connect();
    
    
    connection.query("delete from student  where id = "+req.params.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            
        }
        // res.status(200).json({"status_code":200,"status_message": "success"});
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();

        res.redirect('/Teacher_Record/'+ destid);
        connection.end();

    });    
});

app.get('/Delete_Teacher/:id', function(req, res){

    var connection = getMySQLConnection();
    
    console.log(req.body);

    connection.connect();
    
    
    connection.query("delete from teacher  where id = "+req.params.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            
        }
       
        // res.status(200).json({"status_code":200,"status_message": "success"});
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();
        console.log(destid);
        res.redirect('/Teacher_Record/'+ destid);
        connection.end();

    });    
});

app.get('/Admin_Delete_Notice/:id', function(req, res){

    var connection = getMySQLConnection();
    
   // console.log(req.body);

    connection.connect();

    connection.query("delete from notice where id = "+req.params.id+" " , function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
            
        }
       
        // res.status(200).json({"status_code":200,"status_message": "success"});
        var hrefpath=req.headers.referer;
        var destid = hrefpath.split('/').pop();
        console.log(destid);
        res.redirect('/Teacher_Record/'+ destid);
        connection.end();

    });    
});

app.get('/Student_Record/:id',function(req,res){
    
    var studentList = [];
    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from student", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                let student = {
                    'name':rows[i].name,
                    'surname':rows[i].surname,
                    'contact':rows[i].contact,
                    'id':rows[i].id,
                    'email':rows[i].email,
                    'class':rows[i].class,
                    'address':rows[i].address,
                    'username':rows[i].username
                }
                // Add object into array
                studentList.push(student);
            } 
            console.log(studentList);
            console.log(req.params.id);
            res.render('Student_Record',{
                studentList: studentList,
                teacherid : req.params.id

            });
            
        }
        

    });
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});


app.get('/Teacher_Record/:id',function(req,res){
    
    var teacherList = [];
    var studentList = [];
    var noticeList =[];
    var connection = getMySQLConnection();
    connection.connect();

    connection.query("select * from teacher", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                let teacher = {
                    'name':rows[i].name,
                    'surname':rows[i].surname,
                    'contact':rows[i].contact,
                    'id':rows[i].id,
                    'email':rows[i].email,
                    'qualification':rows[i].qualification,
                    'address':rows[i].address,
                    'username':rows[i].username
                }
                // Add object into array
                teacherList.push(teacher);
                //console.log(teacherList);
            } 
               
        }
    });

    connection.query("select * from notice", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                let notice = {
                    'id': rows[i].id,
                    'title':rows[i].title,
                    'description':rows[i].description
                    
                }
                // Add object into array
                noticeList.push(notice);
                //console.log(noticeList);
            } 
               
        }
    });


    connection.query("select * from student", function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error", 'error': err});
        }
        else{
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                let student = {
                    'name':rows[i].name,
                    'surname':rows[i].surname,
                    'contact':rows[i].contact,
                    'id':rows[i].id,
                    'email':rows[i].email,
                    'class':rows[i].class,
                    'address':rows[i].address,
                    'username':rows[i].username
                }
                // Add object into array
                studentList.push(student);
                console.log(teacherList);

                
            }
            res.render('Teacher_Record',{
                teacherList: teacherList,
                studentList: studentList,
                noticeList: noticeList,
                adminid : req.params.id

            }); 
                    
        }
    });
    //console.log(teacherList);
            
               
    // res.status(200).json({"status_code":200,"status_message": "success", 'data': studentList });        
    connection.end();
    
});



app.listen(3001);