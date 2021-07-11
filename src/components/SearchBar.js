import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import db from '../firebase';

const SearchBar = () => {
  const history = useHistory();
  const [results, setResults] = useState([]);
  
  function searching (e) {
    db.collection('users')
    .where('username', '==', e.target.value)
    .get()
    .then(data => {
      const docs = data.docs.map( doc => doc.data() )
      setResults(docs)
    })
    .catch(err => console.log(err))

  }

  function toProfile (username) {
    history.push(`/${username}`)
    setResults([])
  }


  useEffect(() => {
    console.log(results);
  }, [results]);

  return (
    <div className="relative">
      <input onChange={searching} type="text" className="text-sm py-2 px-4 border-2 rounded-xl focus:outline-none" placeholder="Search for fellow users..." />
      {results.length ? (<div className="searchResults absolute bg-white rounded-xl p-3 w-full">
        {results?.map(result => <div onClick={() => toProfile(result.username)} className="flex item-center p-2 border-b-2 cursor-pointer space-x-1" key={result.uid}>
          <div className="profileImg__container overflow-hidden h-5 w-5 rounded-full">
            <img src={result.profile_img} alt="" className="h-full w-full" />
          </div>
          <h4 className="font-semibold text-sm flex-1">{result.username}</h4>
        </div>)}
      </div>) : ""}
    </div>
  );
}

export default SearchBar;
