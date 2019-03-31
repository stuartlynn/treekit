import React from 'react';

export default function BedLocation(props) {
  const {currentStreetBed, streetBeds} = props.data;
  const first = streetBeds.length == 0;
  const {distance, width, depth, previousBedEnd} = currentStreetBed;

  const updateDistance = distance => {
    const absoluteStart = previousBedEnd ? previousBedEnd + distance : distance;
    const absoluteEnd = previousBedEnd
      ? previousBedEnd + distance + width
      : distance + width;

    if (props.onChange) {
      props.onChange({
        distance,
        absoluteStart,
        absoluteEnd,
      });
    }
  };

  const updateWidth = width => {
    const absoluteEnd = previousBedEnd
      ? previousBedEnd + distance + width
      : distance + width;
    if (props.onChange) {
      props.onChange({
        width,
        absoluteEnd,
      });
    }
  };

  const updateDepth = depth => {
    if (props.onChange) {
      props.onChange({
        depth,
      });
    }
  };

  const validate = e => {
    const raw = parseFloat(e.target.value);
    return raw ? Math.max(raw, 0) : 0;
  };

  const submit = result => {
    if (props.onSubmit) {
      props.onSubmit(result);
    }
  };

  return (
    <section>
      <h3>{first ? 'Add your first tree bed' : 'Add another tree bed'}</h3>
      <p>
        Distance from {first ? 'Street start' : 'Last bed'}{' '}
        <input
          type="number"
          value={distance}
          placeholder="distance"
          onChange={e => updateDistance(validate(e))}
        />
      </p>
      <p>
        Width:{' '}
        <input
          type="number"
          value={width}
          placeholder="width"
          onChange={e => updateWidth(validate(e))}
        />
      </p>
      <p>
        Depth:{' '}
        <input
          type="number"
          value={depth}
          placeholder="depth"
          onChange={e => updateDepth(validate(e))}
        />
      </p>

      <button onClick={submit}>Submit</button>
    </section>
  );
}
