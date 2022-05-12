
const empoModel = require("../models/employeeModel")
const jwt = require('jsonwebtoken')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email.trim())
};
const validatePassword = function (password) {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    return re.test(password.trim())
};
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//Q1 Create Api to register a employee 
const createEmployee = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide employee details' })
            return
        }
        const { fname,lname,email,password } = requestBody;
        // Validation starts
        if (!isValid(fname)) {
            res.status(400).send({ status: false, message: 'fname is required' })
            return
        }
        if (!isValid(lname)) {
            res.status(400).send({ status: false, message: 'lname is required' })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
          }
          if (!validateEmail(email)) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
          }
          const isEmailAlreadyUsed = await userModel.findOne({ email }); 
      
          if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
          }
      
          if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
          }
          if (!validatePassword(password)) {
            res.status(400).send({ status: false, message: 'password should be between 8 and 15 characters' })
            return
          }
        // Validation ends
        const empoData = await empoModel.create({
            fname,lname,age ,email, password,department
        });
        res.status(201).send({ status: true, message: ' registration creates Successfully', data: empoData })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

};




///Authentication

//Q2 Create Api to login the employee
const loginUser = async function (req, res) {
    try {
      const requestBody = req.body;
      if (!validate.isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
        return
      }
  
    
      const { email, password } = requestBody;
  
    
      if (!isValid(email)) {
        res.status(400).send({ status: false, message: `Email is required` })
        return
      }
  
      if (!validateEmail(email)) {
        res.status(400).send({ status: false, message: `Email should be a valid email address` })
        return
      }
  
      if (!isValid(password)) {
        res.status(400).send({ status: false, message: `Password is required` })
        return
      }
      if (!validatePassword(password)) {
        res.status(400).send({ status: false, message: 'password should be between 8 and 15 characters' })
        return
      }
      
  
      const user = await empoModel.findOne({ email: email, password: password });
  
      if (!user) {
        res.status(401).send({ status: false, message: `Invalid login credentials` });
        return
      }
      const token = await jwt.sign(
          {userId: user._id}, 'kishan')
  
      res.header('x-api-key', token);
      res.status(200).send({ status: true, message: `user login successfull`, data: { token } });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  }
//Q 3 Create Api to fetch all the employee in employee table
const getprofile = async function (req, res) {
    try {
        let Data = await empoModel.find({ isDeleted: false })
        if (!Data) {
            res.status(404).send({ status: false, msg: 'profile not found' })
        }

        res.status(200).send({ status: true, message: 'Success', data: Data })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

};

//Q 4 Create Api to update employee profile
const updateProfile = async function (req, res) {
    try {
        const requestBody = req.body
        const empoId = req.params.empoId
        const empoIdFromToken = req.emploId

        
        if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${empoId} is not a valid userId id` })
            return
        }
        const empo = await empoModel.findOne({ _id: empoId, isDeleted: false, deletedAt: null })
        if (!empo) {
            res.status(404).send({ status: false, message: `employee not found` })
            return
        }
        if (empo.empoId.toString() != empoIdFromToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Please provide paramateres to update profile' })
            return
        }

        
        const { fname,lname,email,password,department } = requestBody;

        const updatedData = {}

        if (isValid(fname)) {
            
            updatedData['fname'] = fname.trim()
        }
        if (isValid(lname)) {
            
            updatedData['lname'] =lname.trim()
        }
        if (isValid(department)) {
            
            updatedData['department'] =department.trim()
        }
        const isEmailAlreadyUsed = await empoModel.findOne({ email }); 
      
        if (isEmailAlreadyUsed) {
          res.status(400).send({ status: false, message: `${email} email address is already registered` })
          return
        }
        if (!validateEmail(email)) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
          }
          if (isValid(email)) {
            
            updatedData['email'] =email
        }
        
          if (!validatePassword(password)) {
            res.status(400).send({ status: false, message: 'password should be between 8 and 15 characters' })
            return
          }
          
      
          if (isValid(password)) {
            updatedData['password'] =password
          }
        const updatedprofile = await empoModel.findOneAndUpdate({ _id: empoId }, updatedData, { new: true })

        res.status(200).send({ status: true, message: 'user updated successfully', data: updatedprofile });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
//Q 5 Create Api to delete a user
let deleteUser = async function (req, res) {
    try {
        const empoId = req.params.empoId
        const userIdFromToken = req.userId
       

        if (!(isValid(empoId) && isValidObjectId(bookId))) {
            return res.status(400).send({ status: false, msg: "employee Id is not valid" })
        }
        const employee = await empoModel.findOne({ _id: empoId })
        if (!employee) {
            res.status(404).send({ status: false, message: `id don't exist in employee collection` })
            return
        }

        if (eployee.empoId.toString() != userIdFromToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        let deletedprofile = await empoModel.findOneAndUpdate({ _id: empoId, isDeleted: false, deletedAt: null },
            { isDeleted: true, deletedAt: new Date() }, { new: true })

        if (!deletedprofile) {
            res.status(404).send({ status: false, msg: "either the profile is already deleted or you are not valid user to access this book" })
            return
        }
        res.status(200).send({ status: true, msg: "user has been deleted" })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};



module.exports = { createEmployee,loginUser,updateProfile, deleteUser,getprofile}

