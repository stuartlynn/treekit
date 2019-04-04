import {Style, Fill, Stroke} from 'ol/style';

const StreetToDoStyle = new Style({
    stroke: new Stroke({
        color:'rgba(0,256,0,0.7)',
        width: 4
    })
})

const StreetDoneStyle = new Style({
    stroke: new Stroke({
        color:'rgba(0,0,200,0.6)',
        width: 4
    })
})

const StreetDefaultStyle = new Style({
    stroke: new Stroke({
        color:'rgba(0,0,0,0.4)',
        width: 4
    })
})

const SelectedStreetStyle = new Style({
    stroke: new Stroke({
        color:'rgba(255,0,0,0.9)',
        width: 4
    })
})


export const StreetStyle = (options) => (feature,zoom) =>{
    const state = feature.get('state')
    if(options && feature.get('id') === options.selectedId){
        return SelectedStreetStyle
    }

    switch(state){
        case 'TODO':
            return StreetToDoStyle
        case 'DONE':
            return StreetDoneStyle
        default:
            return StreetDefaultStyle 
    }
}

export const NeighborhoodStyle =new Style({
      fill: new Fill({
        color: 'rgba(200,0,0,0.6)',
      }),
      stroke: new Stroke({
        color: 'rgba(200,0,0,0.8)',
        width: 2,
      }),
})

export const NeighborhoodStyleSimple = new Style({
      stroke: new Stroke({
        color: 'rgba(200,0,256,0.8)',
        lineDash: [.1, 5],
        width: 4,
      }),
})
