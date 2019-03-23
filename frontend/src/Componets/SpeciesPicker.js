import React, {useState, useEffect, useRef} from 'react';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import Fuse from 'fuse.js';

export default function SpeciesPicker(props) {
  const [loaded, setLoaded] = useState(false);
  const [species, setSpecies] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSeleceted] = useState('');
  const fuzzy = useRef(null);
  const speciesBox = useRef(null);

  //Grab the species list then setup the fuzzy search and
  //data
  useEffect(() => {
    fetch('/species.json')
      .then(r => r.json())
      .then(result => {
        console.log('result is ', result);
        fuzzy.current = new Fuse(result, {
          keys: ['CommonName', 'ScientificName'],
        });
        setSpecies(result);
        setLoaded(true);
      });
  }, []);

  //Scroll to the start when the filter changes
  useEffect(() => {
    if (speciesBox.current) {
      speciesBox.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [filter]);

  const filteredSpecies =
    loaded && filter && filter.length > 0
      ? fuzzy.current.search(filter)
      : species;

  return (
    <div style={props.style} className="sepciesPicker">
      <input
        type="text"
        value={filter}
        placeholder="Search species..."
        onChange={e => setFilter(e.target.value)}
        style={{
          width: '100%',
          height: '30px',
          boxSizing: 'border-box',
          padding: '5px',
        }}
      />
      <h3>Species</h3>
      {loaded && (
        <div
          ref={el => (speciesBox.current = el)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            width: '100%',
          }}>
          {filteredSpecies.map(s => (
            <div
              key={s.CommonName}
              style={{disply: 'flex', flexDirection: 'column'}}
              onClick={() => setSeleceted(s)}
              style={{
                backgroundColor: selected === s ? '#729530' : '#99CA3E',
                boxSizing: 'border-box',
                padding: '10px 5px',
              }}>
              <p style={{height: '40px', fontSize: '13px'}}>
                {s.CommonName} / {s.ScientificName}
              </p>
              <img style={{margin: '5px 0px', width: '100px'}} src={s.leaf} />
              <img style={{margin: '5px 0px', width: '100px'}} src={s.flower} />
              <img style={{margin: '5px 0px', width: '100px'}} src={s.fruit} />
            </div>
          ))}
        </div>
      )}
      <div
        className="controlls"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          padding: '0px 10px',
        }}>
        <Fab color="secondary" aria-label="reject" onClick={props.onReject}>
          <CloseIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="confirm"
          onClick={() => {
            props.onConfirm(selected);
          }}>
          <DoneIcon />
        </Fab>
      </div>
    </div>
  );
}
