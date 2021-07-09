const arrayUnion = (...arguments_) => [...new Set(arguments_.flat())];

module.exports = arrayUnion;