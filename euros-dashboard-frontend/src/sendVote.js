function sendVote(team) {
    fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(team),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // Use text() to read the response body as text
    })
    .then(text => {
      // Only attempt to parse the text as JSON if it's not empty
      const data = text ? JSON.parse(text) : {};
      console.log('Vote successful:', data);
    })
    .catch((error) => console.error('Error:', error));
  }
  
  export default sendVote