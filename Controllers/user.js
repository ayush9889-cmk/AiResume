const userModel = require("../Models/user");

exports.register = async (req, res) => {
  try {
    const { name, email, photoUrl } = req.body;
    const userExist = await userModel.findOne({ email: email });
    if (!userExist) {
      const newUser = new userModel({ name, email, photoUrl });
      await newUser.save();
      return res
        .status(200)
        .json({ message: "User registered successfully", user: newUser });
    }
    return res.status(200).json({ message: "Welcome Back", user: userExist });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};
