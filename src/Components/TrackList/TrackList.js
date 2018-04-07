import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

const TrackList = (props) =>
    (<div className="TrackList">
      {props.tracks.map(track =>
        <Track
          key={track.id}
          track={track}
          onAdd={props.onAdd}
          onRemove={props.onRemove}
          isRemoval={props.isRemoval} />)}
  </div>);

export default TrackList;
