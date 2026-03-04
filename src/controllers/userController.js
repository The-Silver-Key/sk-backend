const pool = require('./../db')

exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query( `SELECT * FROM users`)
        console.log("result: ", result);
        
        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            data: result.rows
        })
    } catch (error) {

    }
}