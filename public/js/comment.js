async function commentFormHandler(event) {
  event.preventDefault();

  const content = document.querySelector('#content').value.trim();
  const post_id = document.querySelector('#post_id').value.trim();
  
  if (content) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          post_id,
          content
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }else{
      console.log("error")
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);