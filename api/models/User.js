import {Model, DataTypes} from 'sequelize'

export const define = (sequelize)=>{
    return sequelize.define(
    'user',
    {
        username: DataTypes.STRING,
        password: DataTypes.STRING,

    },
    {
        timestamps:true
    }
    )
}

export const associate = models =>{
    models.TreeBed.belongsTo(models.Street)
}

