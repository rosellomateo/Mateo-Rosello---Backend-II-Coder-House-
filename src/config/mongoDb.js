import mongoose from "mongoose"

const connectDb = async (url,dbName) =>{
    try {
        await mongoose.connect(
            url, 
            {
                dbName: dbName
            }
        )
        console.log(`DB online!`)
    } catch (error) {
            console.log(`Error: ${error.message}`)
    }
}

export default connectDb