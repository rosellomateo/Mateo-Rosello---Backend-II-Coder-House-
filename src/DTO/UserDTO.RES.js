class UserResDTO{
    constructor(user){
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.username = user.username
        this.cart = user.cart
    }
}

export default UserResDTO
