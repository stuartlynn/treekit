import {Style, Fill, Stroke, Icon} from 'ol/style';
import Point from 'ol/geom/Point';

const StreetToDoStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(0,256,0,0.7)',
    width: 4,
  }),
});

const StreetDoneStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(0,0,200,0.6)',
    width: 4,
  }),
});

const StreetDefaultStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(0,0,0,0.4)',
    width: 4,
  }),
});

const HiddenStreetStyle = new Style({
  stroke: new Stroke({}),
});

const SelectedStreetStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(255,0,0,0.9)',
    width: 4,
  }),
});

const ArrowStyle = (feature, direction) => {
  const coords = feature.getGeometry().getCoordinates();
  const dx = coords[0][0] - coords[1][0];
  const dy = coords[0][1] - coords[1][1];

  const midX = (coords[0][0] + coords[1][0]) / 2;
  const midY = (coords[0][1] + coords[1][1]) / 2;

  const rotation = Math.atan2(dy, dx);
  return new Style({
    geometry: new Point([midX, midY]),
    image: new Icon({
      src: 'https://openlayers.org/en/latest/examples/data/arrow.png',
      anchor: [0.75, 0.5],
      rotateWithView: true,
      rotation: direction === 'Backward' ? -rotation : Math.PI - rotation,
    }),
  });
};

export const CurrentBedStyle = (feature) =>{
 return new Style({
  stroke: new Stroke({
    color: 'red',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgba(1,0,0,0.6)',
  }),
});
}

export const BedStyle= new Style({
  stroke: new Stroke({
    color: 'red',
    width: 2,
  }),
});

export const StreetStyle = options => (feature, zoom) => {
  const state = feature.get('state');
  if (options && feature.get('id') === options.selectedId) {
    if (options && options.showArrow) {
      return [ArrowStyle(feature, options.arrowDirection), SelectedStreetStyle];
    }
    return SelectedStreetStyle;
  }

  if (options && options.onlySelected) {
    return HiddenStreetStyle;
  }

  switch (state) {
    case 'TODO':
      return StreetToDoStyle;
    case 'DONE':
      return StreetDoneStyle;
    default:
      return StreetDefaultStyle;
  }
};

export const NeighborhoodStyle = new Style({
  fill: new Fill({
    color: 'rgba(200,0,0,0.6)',
  }),
  stroke: new Stroke({
    color: 'rgba(200,0,0,0.8)',
    width: 2,
  }),
});

export const NeighborhoodStyleSimple = new Style({
  stroke: new Stroke({
    color: 'rgba(200,0,256,0.8)',
    lineDash: [0.1, 5],
    width: 4,
  }),
});
