const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SUPERSECRET = 'thisIsASecretKey123';

exports.signUp = async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        const user = await newUser.save();

        if (req.body.roles) {
            const roles = await Role.find({ name: { $in: req.body.roles } });
            user.roles = roles.map(role => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            user.roles = [role._id];
        }

        await user.save();
        res.send({ message: "Registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.signIn = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("roles");

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password"
            });
        }

        const token = jwt.sign({ id: user.id }, JWT_SUPERSECRET, { expiresIn: "1h" });

        const authorities = user.roles.map(role => role.name);

        res.status(200).send({
            id: user._id,
            user: user.name,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};
