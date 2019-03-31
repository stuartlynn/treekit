import {Model, DataTypes} from 'sequelize'

export const define  = (sequelize) =>{
    return sequelize.define(
        'street',
        {
            name: DataTypes.TEXT,
            length: DataTypes.DOUBLE,
            osm_id: DataTypes.STRING,
            isEmpty: DataTypes.BOOLEAN,
            state: DataTypes.ENUM('DONE','CHECKED_OUT','TODO','SKIP'),
            geom : DataTypes.GEOMETRY("LINESTRING", 4326),
        },
        {
            timestamps:true,
            indexes:[{
                fields:['geom'],
                using:'GIST'
            }]
        }
    )
}

export const associate = models =>{
    console.log('models are ', models)
    models.Street.belongsTo(models.Neighborhood)
    models.Street.belongsTo(models.Project)
    models.Street.belongsTo(models.User)
    models.Street.hasMany(models.TreeBed)
}
