import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SnowmobileIcon from '@mui/icons-material/Snowmobile';
import BrushIcon from '@mui/icons-material/Brush';
import BusinessIcon from '@mui/icons-material/Business';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FeedIcon from '@mui/icons-material/Feed';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch } from 'react-redux';
import { clickFeed } from '../redux/features/cross';

function Rightbar() {
  const dispatch=useDispatch()
  return (
    <div className='p-8 h-screen bg-white w-full md:w-1/4 lg:w-full'>
      <div className='lg:hidden flex justify-end my-3'>
        <ClearIcon className='' onClick={()=>dispatch(clickFeed())}/>
      </div>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg' ><SchoolIcon/> Education</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><SportsCricketIcon/> Sports</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><SnowmobileIcon/>Adventure</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><BrushIcon/>Art</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><BusinessIcon/> Business</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><FaceRetouchingNaturalIcon/>Fashion</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><FastfoodIcon/> Food</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><MedicationLiquidIcon/> Health</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><MusicNoteIcon/> Music</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><FeedIcon/> News</p>
      <hr/>
      <p className='my-3 text-lg hover:bg-slate-200 cursor-pointer hover:p-2 hover:rounded-lg'><FlightTakeoffIcon/>Travel</p>
    </div>
  );
}

export default Rightbar;
