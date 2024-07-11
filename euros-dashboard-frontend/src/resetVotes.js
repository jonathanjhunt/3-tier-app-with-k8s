async function resetVotes() {
    try {
      const response = await fetch('/api/resetVotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Votes reset successful:', data);
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  }
  
  export default resetVotes;