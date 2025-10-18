import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useEffect } from 'react'
import UserCard from './UserCard'
import { data } from 'react-router-dom'


const Feed = () => {

    const feed = useSelector((store) => store.feed);
    
    const dispatch = useDispatch();

    const getFeed = async () => {
      if (feed && feed.length > 0) return;

        const res = await axios.get(BASE_URL + "/feed", {withCredentials: true});
        console.log(res);
        dispatch(addFeed(res.data.data));}

    useEffect(() => {
        getFeed();
    }, []);

    if(!feed) return;

    if(feed.length <= 0) return <h1 className='flex justify-center my-10'>No new users found</h1>
      
    

  return (
    feed && feed.length > 0 &&(
      <div className=' min-h-screen flex items-center justify-center pb-27'>
          <UserCard user={feed[0]}/>
      </div>
    )
  )
  
}

export default Feed;