import React, {useContext} from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import {DataEntryStore} from '../Contexts/DataEntryContext';

export default function SelfiePage(props) {
  const [state, dispatch] = useContext(DataEntryStore);
  return (
    <div className="page">
      <Camera
        style={{width:'100%',height:'100%'}}
        onTakePhoto={dataUri => {
          dispatch({type: 'UPDATE_TREE', payload: {selfie: dataUri}});
          props.navigate('/map_entry');
        }}
      />
    </div>
  );
}
