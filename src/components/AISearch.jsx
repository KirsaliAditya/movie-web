import React, {useState} from 'react'


export const AISearch = ({ setSearchPrompt }) => {

    const [prompt, setPrompt] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleAISearch = async () => {
        
        if(!prompt.trim()) {
            alert("Please enter a valid description");
            return;
        }
        setLoading(true);
        await setSearchPrompt(prompt);
        setLoading(false);
        console.log("AI Search triggered");
    }
  return (
    <div>
    <h2 className='mt-4'>AI Search</h2>
    <div className='search mt-0.5'>
      <div>
        <img src="./search.svg" alt="search" />
        <input type="text" name="" id="" placeholder='write your description'
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        />
      </div>
    </div>
    <button className='mt-2 p-1.5 text-xl rounded-xl text-white bg-dark-100 hover:bg-slate-700 cursor: pointer;' onClick={handleAISearch}>Search</button>
    </div>
  )
}
