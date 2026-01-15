
const ALL_CHALLENGES = [
  { id: 'web_xss_1', name: 'Web XSS' },
  { id: 'web_idor_1', name: 'Web IDOR' },
  { id: 'api_bola_1', name: 'API BOLA' },
  { id: 'api_auth_1', name: 'API Broken Auth' },
  { id: 'llm_prompt_injection_1', name: 'LLM Prompt Injection' }
]

const CHALLENGE_HINTS = {
  web_xss_1: 'Think about how user input might be interpreted as code by the browser',
  web_idor_1: 'Check whether you can delete a post that does not belong to you',
  api_bola_1: 'Does the server verify that the requested object belongs to the authenticated user?',
  api_auth_1: 'What happens if the token is missing, expired, or manipulated?',
  llm_prompt_injection_1: 'Try to make the system explain how it works instead of answering your question'
}

let token = null;

async function checkSolvedChallengesOnLoad() {
  try {
    const response = await fetch('http://localhost:3005/api/users/me/solved-challenges', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    const data = await response.json();

   
if (
  Array.isArray(data.solvedChallenges) &&
  !data.solvedChallenges.includes('web_idor_1')
) {
  localStorage.removeItem('web_idor_1_toast_shown');
}

   renderChecklist(data.solvedChallenges)

   


const idorShownKey = 'web_idor_1_toast_shown';

if (
  Array.isArray(data.solvedChallenges) &&
  data.solvedChallenges.includes('web_idor_1') &&
  !localStorage.getItem(idorShownKey)
) {
  showChallengeSuccess(' פתרת את אתגר WEB 2 (IDOR)');
  localStorage.setItem(idorShownKey, 'true');
}



if (
  Array.isArray(data.solvedChallenges) &&
  data.solvedChallenges.includes('api_auth_1') &&
  !sessionStorage.getItem('api_auth_1_shown')
) {
  showChallengeSuccess(' פתרת את אתגר API (Broken Authentication)');
  sessionStorage.setItem('api_auth_1_shown', 'true');
}

if (
  Array.isArray(data.solvedChallenges) &&
  data.solvedChallenges.includes('api_bola_1') &&
  !sessionStorage.getItem('api_bola_1_shown')
) {
  showChallengeSuccess(' פתרת את אתגר API BOLA (Broken Object Level Authorization)');
  sessionStorage.setItem('api_bola_1_shown', 'true');
}

if (
  Array.isArray(data.solvedChallenges) &&
  data.solvedChallenges.includes('llm_prompt_injection_1') &&
  !sessionStorage.getItem('llm_prompt_injection_1_shown')
) {
  showChallengeSuccess(' פתרת את אתגר LLM Prompt Injection');
  sessionStorage.setItem('llm_prompt_injection_1_shown', 'true');
}





  } catch (err) {
    console.error('Failed to check solved challenges:', err);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  console.log('feed loaded');
  token = localStorage.getItem('token')
  if (!token) {
    alert('You must be logged in to access the feed');
    window.location.href = 'login.html';
    return;
  }

  checkSolvedChallengesOnLoad();
  document.addEventListener







  

 // ✅ הסתרת לשונית החברים כברירת מחדל
  document.getElementById('friendsPanel').style.display = 'none';

  renderPostsPerGroupChart(token);

  renderMediaTypeChart(token);

  fetchWeather();


  const FETCH_POSTS_URL = 'http://localhost:3005/api/posts/friends-feed';
  const CREATE_POST_URL = 'http://localhost:3005/api/posts';



  const postForm = document.getElementById('postForm');
  const postsContainer = document.getElementById('postsContainer');
  const userId = parseJwt(token).userId;

  async function fetchWeather() {
    try {
      // שלב 1: בקשת המפתח מהשרת
      const keyResponse = await fetch('/api/weather-key');
      const keyData = await keyResponse.json();
      const apiKey = keyData.apiKey;

      // שלב 2: בקשת מזג האוויר לפי המפתח שהתקבל
      const city = 'Tel Aviv';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=he`
      );

      const data = await response.json();

      if (!data.main || !data.weather) {
        throw new Error(`API error: ${data.message}`);
      }

      const weatherDiv = document.getElementById('weatherInfo');
      const temp = data.main.temp;
      const desc = data.weather[0].description;

      weatherDiv.innerHTML = `
      <p><strong>${city}</strong></p>
      <p>🌡️ טמפרטורה: ${temp}°C</p>
      <p>🌤️ ${desc}</p>
    `;
    } catch (err) {
      document.getElementById('weatherInfo').innerText = 'שגיאה בטעינת מזג האוויר';
      console.error('שגיאה ב-fetchWeather:', err);
    }
  }



  async function loadPosts() {
    try {
      const response = await fetch(FETCH_POSTS_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });


      const posts = await response.json();

      // ניקוי תצוגה קודם
      postsContainer.innerHTML = '';

      // ✅ סינון: רק פוסטים שלי ושל חבריי שלא שייכים לקבוצות
      const filteredPosts = posts.filter(post => !post.groupId);

      // ✅ הצגה
      filteredPosts.reverse().forEach(post => renderPost(post));


    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  }



  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();


    const content = document.getElementById('postContent').value;
    const fileInput = document.getElementById('postImage');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('content', content);
    if (file) {
      formData.append('media', file);
    }

    try {
      const response = await fetch(CREATE_POST_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

     const data = await response.json();

// הצגת הפוסט
renderPost(data.post);
postForm.reset();

// אם נפתר אתגר WEB 1
if (data.challengeSolved === 'web_xss_1') {
  showChallengeSuccess(' פתרת את אתגר WEB 1 (Stored XSS)');
}


    } catch (err) {
      console.error('Failed to create post:', err);
    }
  });

  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = option.getAttribute('data-filter');
      filterPosts(filter);
    });

  });

  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length === 0) {
      loadPosts(); // מציג את כל הפוסטים מחדש
    } else {
      searchPosts(query);
    }
  });


  loadPosts();

const llmSendBtn = document.getElementById('llm-send')
const llmInput = document.getElementById('llm-input')
const llmMessages = document.getElementById('llm-messages')

if (llmSendBtn) {
  llmSendBtn.addEventListener('click', async () => {
    const text = llmInput.value.trim()
    if (!text) return

    const userMsg = document.createElement('div')
    userMsg.textContent = '🧑‍💻 ' + text
    llmMessages.appendChild(userMsg)

    llmInput.value = ''

    const res = await fetch('/api/llm/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ prompt: text })
    })

    const data = await res.json()


    const botMsg = document.createElement('div')
    botMsg.textContent = '🤖 ' + data.reply
    llmMessages.appendChild(botMsg)

    

    llmMessages.scrollTop = llmMessages.scrollHeight
  })
}


  const showFriendsBtn = document.getElementById('showFriendsBtn');
  const friendsPanel = document.getElementById('friendsPanel');
  const friendsList = document.getElementById('friendsList');
  const closeFriendsPanel = document.getElementById('closeFriendsPanel');

  if (showFriendsBtn && friendsPanel && friendsList) {
    showFriendsBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3005/api/users/friends', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const friends = await response.json();
        friendsList.innerHTML = '';

        if (friends.length === 0) {
          friendsList.innerHTML = '<li class="list-group-item">אין חברים להצגה</li>';
        } else {
          friends.forEach(friend => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${friend.firstName} ${friend.lastName} (@${friend.username})`;
            friendsList.appendChild(li);
          });
        }

        friendsPanel.style.display = 'block';
      } catch (err) {
        console.error('שגיאה בשליפת חברים:', err);
      }
    });
  }

  if (closeFriendsPanel && friendsPanel) {
    closeFriendsPanel.addEventListener('click', () => {
      friendsPanel.style.display = 'none';
    });
  }

});

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function renderPost(post) {
  const postsContainer = document.getElementById('postsContainer');
  const token = localStorage.getItem('token')
  const userId = parseJwt(token).userId;

  console.log("📩 מציג פוסט:", post);

  const postElement = document.createElement('div');
  postElement.classList.add('card', 'mb-3');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const postHeader = document.createElement('div');
  postHeader.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
  const userInfo = document.createElement('div');
  userInfo.classList.add('d-flex', 'align-items-center', 'gap-2');
  const avatarIcon = document.createElement('i');
  avatarIcon.classList.add('bi', 'bi-person-circle', 'fs-4', 'text-secondary');
  const username = document.createElement('strong');
  username.textContent = post?.author?.username || 'User';
  userInfo.appendChild(avatarIcon);
  userInfo.appendChild(username);
  const date = document.createElement('small');
  date.classList.add('text-muted');
  date.textContent = new Date(post.createdAt).toLocaleDateString();
  postHeader.appendChild(userInfo);
  postHeader.appendChild(date);
  cardBody.appendChild(postHeader);

  const textElement = document.createElement('p');
  textElement.classList.add('card-text');
  textElement.innerHTML = post.content;
  
  cardBody.appendChild(textElement);

  if (post.mediaUrl && post.mediaType !== 'text') {
    const mediaElement = document.createElement(post.mediaType === 'image' ? 'img' : 'video');
    mediaElement.src = post.mediaUrl;
    mediaElement.classList.add('post-media');
    if (post.mediaType === 'video') mediaElement.controls = true;
    cardBody.appendChild(mediaElement);
  }

  const actionsWrapper = document.createElement('div');
  actionsWrapper.classList.add('d-flex', 'align-items-center', 'gap-3', 'mt-2');

  const likeBtn = document.createElement('button');
  likeBtn.classList.add('btn-icon', 'like-button');
  const likeIcon = document.createElement('i');
  likeIcon.classList.add('bi');
  likeIcon.classList.add(post.likedBy.includes(userId) ? 'bi-heart-fill' : 'bi-heart');
  if (post.likedBy.includes(userId)) likeIcon.classList.add('liked');
  likeBtn.appendChild(likeIcon);

  const likeCountSpan = document.createElement('span');
  likeCountSpan.textContent = post.likedBy.length;

  likeBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/posts/${post._id}/like`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const updated = await response.json();
      likeCountSpan.textContent = updated.likes;
      if (updated.likedBy.includes(userId)) {
        likeIcon.classList.add('bi-heart-fill', 'liked');
        likeIcon.classList.remove('bi-heart');
      } else {
        likeIcon.classList.remove('bi-heart-fill', 'liked');
        likeIcon.classList.add('bi-heart');
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  });

  const commentBtn = document.createElement('button');
  commentBtn.classList.add('btn-icon');
  const commentIcon = document.createElement('i');
  commentIcon.classList.add('bi', 'bi-chat');
  commentBtn.appendChild(commentIcon);

  const commentCountSpan = document.createElement('span');
  commentCountSpan.textContent = post.comments.length;

  actionsWrapper.appendChild(likeBtn);
  actionsWrapper.appendChild(likeCountSpan);
  actionsWrapper.appendChild(commentBtn);
  actionsWrapper.appendChild(commentCountSpan);
  if (post.author?._id === userId) {
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    editBtn.classList.add('btn-icon');

    editBtn.addEventListener('click', () => {
      showEditForm(post, postElement);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.classList.add('btn-icon');

    deleteBtn.addEventListener('click', async () => {
      const confirmed = confirm('האם אתה בטוח שברצונך למחוק את הפוסט?');
      if (!confirmed) return;

      try {
        const response = await fetch(`http://localhost:3005/api/posts/${post._id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();



if (response.ok) {
  postElement.remove();
  console.log('פוסט נמחק בהצלחה');
        } else {
          const err = await response.json();
          console.error('שגיאה במחיקה:', err);
        }
      } catch (err) {
        console.error('שגיאה במחיקת הפוסט:', err);
      }
    });

    actionsWrapper.appendChild(editBtn);
    actionsWrapper.appendChild(deleteBtn);
  }


  cardBody.appendChild(actionsWrapper);

  const commentSection = document.createElement('div');
  commentSection.classList.add('comment-section');
  commentSection.style.display = 'none';

  commentBtn.addEventListener('click', () => {
    commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
  });

  const commentInput = document.createElement('input');
  commentInput.type = 'text';
  commentInput.placeholder = 'כתוב תגובה...';
  commentInput.classList.add('form-control', 'form-control-sm', 'mb-2');

  const commentList = document.createElement('div');
  commentList.classList.add('comment-list');

  post.comments.forEach(comment => {
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment');
    commentItem.textContent = `${comment.author?.username || 'User'}: ${comment.content}`;
    commentList.appendChild(commentItem);
  });

  commentInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const text = commentInput.value.trim();
      if (text !== '') {
        try {
          const response = await fetch(`http://localhost:3005/api/posts/${post._id}/comments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: text })
          });

          const updatedComments = await response.json();
          commentList.innerHTML = '';
          updatedComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment');
            commentItem.textContent = `${comment.author?.username || 'User'}: ${comment.content}`;
            commentList.appendChild(commentItem);
          });

          commentCountSpan.textContent = updatedComments.length;
          commentInput.value = '';
        } catch (err) {
          console.error('Failed to add comment:', err);
        }
      }
    }
  });

  commentSection.appendChild(commentInput);
  commentSection.appendChild(commentList);
  cardBody.appendChild(commentSection);
  postElement.appendChild(cardBody);
  postElement.setAttribute('data-type', post.mediaType || 'text');
  postsContainer.prepend(postElement);
}


function showEditForm(post, postElement) {
  if (postElement.querySelector('.edit-form')) return;

  const oldTextElement = postElement.querySelector('.card-text');
  if (!oldTextElement) return;

  const formWrapper = document.createElement('div');
  formWrapper.classList.add('edit-form', 'mt-2');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = post.content;
  input.classList.add('form-control', 'mb-2');

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'שמור';
  saveBtn.classList.add('btn', 'btn-success', 'me-2');

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'ביטול';
  cancelBtn.classList.add('btn', 'btn-secondary');

  formWrapper.appendChild(input);
  formWrapper.appendChild(saveBtn);
  formWrapper.appendChild(cancelBtn);

  oldTextElement.style.display = 'none';
  postElement.appendChild(formWrapper);

  saveBtn.addEventListener('click', async () => {
    const newContent = input.value.trim();
    console.log('🟢 נלחץ שמור:', newContent);

    if (newContent && newContent !== post.content) {
      await updatePostContent(post._id, newContent, postElement);
    } else {
      console.log('⚠️ אין שינוי או טקסט ריק');
    }
  });

  cancelBtn.addEventListener('click', () => {
    formWrapper.remove();
    oldTextElement.style.display = '';
  });
}

async function updatePostContent(postId, newContent, postElement) {
  try {
    console.log('🚀 שולח עדכון לשרת:', postId, newContent);

    const response = await fetch(`http://localhost:3005/api/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: newContent })
    });

    if (response.ok) {
      const updatedPost = await response.json();
      console.log('✅ הפוסט עודכן בהצלחה:', updatedPost);

      const textElement = postElement.querySelector('.card-text');
      if (textElement) {
        textElement.textContent = updatedPost.content;
        textElement.style.display = '';
      }

      const editForm = postElement.querySelector('.edit-form');
      if (editForm) {
        editForm.remove();
      }
    } else {
      const error = await response.json();
      console.error('❌ שגיאה מהשרת:', error);
    }
  } catch (err) {
    console.error('🛑 שגיאה בבקשת עדכון:', err);
  }
}

const toggleGroupListBtn = document.getElementById('toggleGroupListBtn');
const groupList = document.getElementById('groupList');


async function renderPostsPerGroupChart(token) {
  try {
    const response = await fetch('http://localhost:3005/api/posts/stats-per-group', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    console.log('challengeSolved from server:', data.challengeSolved);
  
    



    const svg = d3.select("#postsPerGroupChart");
    svg.selectAll("*").remove(); // ניקוי קודם

    // 🟢 הגדל גובה לגרף ותחתית
    const width = +svg.attr("width") || 600;
    const height = +svg.attr("height") || 450; // במקום 400
    const margin = { top: 20, right: 30, bottom: 90, left: 50 }; // bottom מוגדל ל־90

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.groupName))
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.postsCount)])
      .nice()
      .range([chartHeight, 0]);

    chart.append("g").call(d3.axisLeft(y));

    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(45)") // זווית מתונה
      .style("text-anchor", "end")
      .attr("dx", "-0.6em")
      .attr("dy", "0.25em")
      .style("font-size", "13px"); // פונט ברור

    chart.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.groupName))
      .attr("y", d => y(d.postsCount))
      .attr("width", x.bandwidth())
      .attr("height", d => chartHeight - y(d.postsCount))
      .attr("fill", (d, i) => d3.schemeSet2[i % 8]);

    chart.selectAll("text.bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.groupName) + x.bandwidth() / 2)
      .attr("y", d => y(d.postsCount) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(d => d.postsCount);
  } catch (err) {
    console.error("❌ Failed to load posts per group chart:", err);
  }
}




async function renderMediaTypeChart(token) {
  try {
    const response = await fetch('http://localhost:3005/api/posts/stats-media-type', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 32; // ← שוליים נוספים


    const svg = d3.select("#postMediaTypeChart")
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const chart = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.mediaType))
      .range(d3.schemeSet2);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    chart.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.mediaType));

    chart.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d => `${d.data.mediaType}: ${d.data.count}`);
  } catch (err) {
    console.error("❌ Failed to load media type chart:", err);
  }
}


function filterPosts(type) {
  const posts = document.querySelectorAll('#postsContainer .card');

  posts.forEach(post => {
    const mediaType = post.getAttribute('data-type') || 'text';

    if (type === 'all' || mediaType === type) {
      post.style.display = '';
    } else {
      post.style.display = 'none';
    }
  });
}

async function searchPosts(query) {
  try {
    const response = await fetch(`http://localhost:3005/api/posts/search?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const posts = await response.json();
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    console.log('🔍 תוצאות חיפוש:', posts);

    posts.reverse().forEach(post => {
      renderPost(post);
    });

  } catch (err) {
    console.error('Failed to search posts:', err);
  }


}

function renderChecklist(solvedChallenges) {
  const list = document.getElementById('challenge-list')
  if (!list) return

  list.innerHTML = ''

  ALL_CHALLENGES.forEach(challenge => {
    const li = document.createElement('li')   // ✅ התיקון הקריטי

    const solved = solvedChallenges.includes(challenge.id)

    const textSpan = document.createElement('span')
    textSpan.textContent = (solved ? '✔️ ' : '❌ ') + challenge.name

    const hintBtn = document.createElement('button')
    hintBtn.textContent = '💡'
    hintBtn.style.marginLeft = '10px'
    hintBtn.onclick = () => {
      alert(CHALLENGE_HINTS[challenge.id] || 'No hint available')
    }

    li.appendChild(textSpan)
    li.appendChild(hintBtn)
    list.appendChild(li)
  })
}




  function showChallengeSuccess(message) {
  const toast = document.getElementById('challenge-toast');

  if (!toast) return;

  toast.innerText = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}












