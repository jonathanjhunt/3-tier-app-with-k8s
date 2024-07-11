async function getVotes() {
    try {
      // Make a GET request to the server to get all the data
      const response = await fetch('/api/getVotes'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Convert the response payload to JSON
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
export default getVotes;