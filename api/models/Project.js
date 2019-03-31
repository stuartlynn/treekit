import {Model, DataTypes} from 'sequelize'
import slugify from 'slugify'

export const define= (sequelize)=>{
    return sequelize.define(
        'project',
        {
            name : DataTypes.STRING,
            slug : DataTypes.STRING,
            img  : DataTypes.STRING,
            description: DataTypes.TEXT,
            geom: DataTypes.GEOMETRY("POLYGON", 4326),
        },
        {
            timestamps:true,
            hooks:{
                beforeSave:(project,options)=>{
                    project.slug = slugify(project.name)
                }
            }
        }
    )
}

export const associate = models =>{
    models.Project.hasMany(models.Neighborhood)
}
