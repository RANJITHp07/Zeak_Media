import React, { useEffect, useState, lazy, Suspense, useMemo, useCallback } from 'react';
import Navbar from '../components/navbar';
import Rightbar from '../components/rightbar';
import Upload from '../components/upload';
import Leftbar from '../components/leftbar';
import { getAllPost } from '../api/post';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clickFeed} from '../redux/features/cross';
import NavbarPanel from '../components/navbarPanel';
import { useNavigate } from 'react-router';



const LazyPost = lazy(() => import('../components/post'));

function Homepage() {
  const [posts, setPosts] = useState([]);
  const navigate=useNavigate()
  const userId = JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')).userId ;
  console.log(userId)
  const click=useSelector((state)=>state.crossReducer.value.cross);
  const navclick=useSelector((state)=>state.crossReducer.value.navcross);
  const dispatch=useDispatch()

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(userId){
          const res = await getAllPost(userId);
          setPosts(res.data);
        }else{
          navigate("/login")
        }
      
      } catch (err) {
        throw err;
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="bg-indigo-900">
        <Navbar />
      </div>
      <button className='p-2 bg-blue-500 m-2 text-white rounded-lg lg:hidden' onClick={()=>{dispatch(clickFeed(true))}}>Feed</button>
      <div className="flex">
      {
        click &&
        <div
            className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 lg:hidden"
          >
            <Rightbar />
          </div>
      }
      {
          navclick &&
          <div
            className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 lg:hidden"
          >
             <NavbarPanel/>
          </div>
         
        }
      
      <div className="w-56 border-r-2 hidden lg:block">
          <Rightbar />
        </div>
        <div className="lg:w-3/5 w-full">
          <Upload  setPosts={setPosts}/>
          {posts.map((p) => (
            <Suspense key={p._id} fallback={<div>Loading...</div>}>
              <LazyPost post={p} page={false} />
            </Suspense>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-500 mx-10">No Posts available</p>
          )}
        </div>
        
        <div className="w-1/4 hidden lg:block">
          <Leftbar />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
