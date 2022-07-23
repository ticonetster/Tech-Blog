async function deleteFormHandler(event) {
  event.preventDefault();
  
  const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];

  const response = await fetch(`/api/post/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      document.location.replace('/dashboard/mydashboard/');
    } else {
      alert(response.statusText);
    }
  
}

document.querySelector('#delete-post-btn').addEventListener('click', deleteFormHandler);