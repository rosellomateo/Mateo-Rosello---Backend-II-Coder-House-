import UserModel from "./Models/userModel.js"
import MongoDao from "./mongoDAO.js"

class UserDao extends MongoDao {
  	constructor(model) {
    	super(model)
  	}

  	async register(user) {
    	try {
			return await this.model.create(user)
		} catch (error) {
			throw new Error(error)
    	}
  	}	

	async login(email, password) {
		try {
			return await this.model.findOne({ email, password })
		} catch (error) {
			throw new Error(error)
		}
	}

	async getByEmail(email) {
		try {
			return await this.model.findOne({ email })
		} catch (error) {
			throw new Error(error)
		}
	}

	async getByFilter(filter) {
		try {
			return await this.model.findOne(filter )
		} catch (error) {
			throw new Error(error)
		}
	}

	async getById(id) {
		try {
			return await this.model.findById(id)
		} catch (error) {
			throw new Error(error)
		}
	}
}

const userDao = new UserDao(UserModel)
export default userDao