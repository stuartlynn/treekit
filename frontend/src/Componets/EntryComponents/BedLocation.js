import React from 'react';

export default function BedLocation(props) {
  const {currentStreetBed, currentStreetBeds} = props.data;
  const first = currentStreetBeds.length == 0;
  const {distance, width, depth} = currentStreetBed;

  const update = updates => {
    if (props.onUpdate) {
      props.onUpdate(updates);
    }
  };

  const submit = () => {
    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  return (
    <section>
      <h3>Add your first tree bed</h3>
      <p>
        Distance from {first ? 'Street start' : 'Last bed'}{' '}
        <input
          type="numeric"
          value={distance}
          placeholder="distance"
          onChange={e => update({distance: e.target.value})}
        />
      </p>

      <p>
        Width:{' '}
        <input
          type="numeric"
          value={width}
          placeholder="width"
          onChange={e => update({width: e.target.value})}
        />
      </p>

      <p>
        Depth:{' '}
        <input
          type="numeric"
          value={depth}
          placeholder="depth"
          onChange={e => update({depth: e.target.value})}
        />
      </p>

      <button onClick={submit}>Submit</button>
    </section>
  );
}
