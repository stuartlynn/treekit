import { DataTypes} from 'sequelize'

export const define = (sequelize)=>{
    return sequelize.define(
        'neighborhood',
        {
            name:DataTypes.TEXT,
            geom: DataTypes.GEOMETRY("MULTIPOLYGON", 4326),
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
    models.Neighborhood.belongsTo(models.Project)
    models.Neighborhood.hasMany(models.Street)
}

