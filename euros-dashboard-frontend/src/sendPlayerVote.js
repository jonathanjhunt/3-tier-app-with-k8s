function sendVote(player) {
    fetch('/api/playerVote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(player),
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