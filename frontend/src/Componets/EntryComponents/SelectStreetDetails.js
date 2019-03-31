import React, {useState} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function SelectStreetDetails(props) {
  const {street} = props.data;
  const {direction, side} = street;

  const update = updates => {
    if (props.onChange) {
      props.onChange(updates);
    }
  };

  const submit = result => {
    if (props.onSubmit) {
      props.onSubmit(result);
    }
  };

  return (
    <div>
      <h3>
        Select the direction you are going to walk along the street and the side
        that the trees are on.
      </h3>
      {street && (
        <div>
          <FormControl component="fieldset" >
            <FormLabel component="legend">Direction</FormLabel>
            <RadioGroup
              aria-label="Direction"
              name="direction"
              value={direction}
              row
              onChange={e => update({direction: e.target.value})}>
              <FormControlLabel
                value="Forward"
                control={<Radio />}
                label="Forward"
              />
              <FormControlLabel
                value="Backward"
                control={<Radio />}
                label="Backward"
              />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" >
            <FormLabel component="legend">Tree Side</FormLabel>
            <RadioGroup
              aria-label="Tree Side"
              name="side"
              value={side}
              row
              onChange={e => update({side: e.target.value})}>
              <FormControlLabel value="Left" control={<Radio />} label="Left" />
              <FormControlLabel
                value="Right"
                control={<Radio />}
                label="Right"
              />
            </RadioGroup>
          </FormControl>
        </div>
      )}
      <button onClick={submit}>Submit</button>
      <button onClick={() => submit('no_trees')}>No Trees</button>
    </div>
  );
}
