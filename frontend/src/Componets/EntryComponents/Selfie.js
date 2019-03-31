import React, {useState} from 'react';
import CameraIcon from '@material-ui/icons/CameraAlt';
import Camera from 'react-html5-camera-photo';
import {Link} from '@reach/router';

export default function Selfie(props) {
  const {selfie} = props.data.tree;

  const update = changes => {
    if (props.onChange) {
      props.onChange(changes);
    }
  };
  const submit = () => {
    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  return (
    <div>
      <h3>Optionally take a photo of the tree</h3>
      {selfie ? (
        <React.Fragment>
          <img width={200} src={selfie} />
          <button
            onClick={() =>
              update({
                selfie: null,
              })
            }>
            Clear
          </button>
          <button onClick={submit}>Submit</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Camera
            style={{width: '100%', height: '100%'}}
            onTakePhoto={dataUri => {
              update({selfie: dataUri});
            }}
          />
          <button onClick={submit}>Skip</button>
        </React.Fragment>
      )}
    </div>
  );
}
