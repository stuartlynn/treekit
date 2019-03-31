import {Model, DataTypes} from 'sequelize'

export const define = (sequelize)=>{
    return sequelize.define(
    'treeBed',
    {
            species : DataTypes.STRING,
            img: DataTypes.STRING,
            status: DataTypes.STRING,
            circumference: DataTypes.STRING,
            width: DataTypes.DOUBLE,
            depth: DataTypes.DOUBLE,
            roadFracStart: DataTypes.DOUBLE,
            roadFracEnd: DataTypes.DOUBLE,
            location : DataTypes.GEOMETRY("POINT", 4326),
    },
    {
        timestamps:true
    }
    )
}

export const associate = models =>{
    models.TreeBed.belongsTo(models.Street)
}

