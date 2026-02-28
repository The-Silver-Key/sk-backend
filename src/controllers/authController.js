module.exports = async (req, res) => {
    res.send("Signup route")

    const result = await pool.query(`INSERT INTO users (email, password) VALUES ('rddfed', 'password')`)
    console.log("result: ", result);
}