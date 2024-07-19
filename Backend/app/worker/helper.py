import os
import aiofiles
from aiohttp import ClientSession
import requests
import aiohttp
import asyncio

async def save_file(file, out_file_path: str | os.PathLike):
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content) 

async def api_update_request(url, params = {}):

    async def fetch_data(session: ClientSession, url):
        # Use 'session.get()' to make an asynchronous HTTP GET request
        async with session.put(url, params=params) as response:
            # Return the JSON content of the response using 'response.json()'
            return await response.json()
        
    async with aiohttp.ClientSession() as session:
        # Create a list of tasks, where each task is a call to 'fetch_data' with a specific URL
        tasks = [fetch_data(session, url)]
        
        # Use 'asyncio.gather()' to run the tasks concurrently and gather their results
        results = await asyncio.gather(*tasks)

    # Print the results obtained from fetching data from each URL
    print(results)