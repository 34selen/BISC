module.exports = (sequelize, DataTypes) => {
    return sequelize.define("chat", {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        opponent1: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        opponent2: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        is_secret: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
    })
}