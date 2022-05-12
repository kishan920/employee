const express = require('express');
const router = express.Router();


const empoController = require("../controllers/employeecontroller")
const middleware = require("../middleware/commonmiddleware")

////Q1 Create Api to register a employee 
router.post('/createEmployee', empoController.createEmployee);
//Q2 Create Api to login the employee
router.post('/createEmployee', empoController.loginUser);
//Q 3 Create Api to fetch all the employee in employee table
router.get('/getprofile', middleware.commonmiddleware, empoController.allEmployee)
    //Q 4 Create Api to update employee profile
router.put('/employee/:empoId', middleware.commonmiddleware, empoController.updateProfile)
    //Q 5 Create Api to delete a user
router.delete("/employee/:empoId", middleware.commonmiddleware, empoController.deleteUser)



module.exports = router;