// script.js - single JS for project
(function(){
  // Elements
  const nameInput = document.getElementById('name');
  const dobInput = document.getElementById('dob');
  const messageInput = document.getElementById('message');
  const form = document.getElementById('messageForm');
  const previewTime = document.getElementById('currentTime');
  const pName = document.getElementById('p_name');
  const pDob = document.getElementById('p_dob');
  const pGender = document.getElementById('p_gender');
  const pMessage = document.getElementById('p_message');
  const welcomeNameSpan = document.getElementById('welcomeName');
  const clearBtn = document.getElementById('clearBtn');
  const yearSpan = document.getElementById('year');
  const yearSpan2 = document.getElementById('year2');

  // set footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (yearSpan2) yearSpan2.textContent = new Date().getFullYear();

  // display current time (updates once)
  function updateTime(){
    const now = new Date();
    previewTime.textContent = "Current time : " + now.toString();
  }
  if (previewTime) updateTime();

  // Load name from localStorage to show welcome if exists
  function loadWelcomeName(){
    const saved = localStorage.getItem('revo_name');
    if(saved && welcomeNameSpan){
      welcomeNameSpan.textContent = saved;
    } else if (welcomeNameSpan){
      welcomeNameSpan.textContent = "Guest";
    }
  }
  loadWelcomeName();

  // show preview values
  function showPreview(data){
    pName.textContent = data.name || '-';
    pDob.textContent = data.dob || '-';
    pGender.textContent = data.gender || '-';
    pMessage.textContent = data.message || '-';
    // also set welcome name and save to localStorage
    if (data.name && welcomeNameSpan){
      welcomeNameSpan.textContent = data.name;
      localStorage.setItem('revo_name', data.name);
    }
  }

  // simple validation helper
  function validateForm(data){
    const errors = [];
    if(!data.name || data.name.trim().length < 2) errors.push("Nama minimal 2 karakter.");
    // optional: if dob provided, check plausible year
    if(data.dob){
      const y = new Date(data.dob).getFullYear();
      if(y < 1900 || y > (new Date().getFullYear())) errors.push("Tanggal lahir tidak valid.");
    }
    return errors;
  }

  // get selected gender
  function getGender(){
    const radios = document.getElementsByName('gender');
    for(let r of radios) if(r.checked) return r.value;
    return '';
  }

  // handle submit
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = {
        name: nameInput.value.trim(),
        dob: dobInput.value,
        gender: getGender(),
        message: messageInput.value.trim()
      };
      const errors = validateForm(data);
      if(errors.length){
        alert("Periksa form:\n- " + errors.join("\n- "));
        return;
      }
      // show preview
      showPreview(data);
      // show success briefly
      alert("Form berhasil dikirim. Preview terisi di sebelah kanan.");
      // update time
      updateTime();
      // optionally persist the entire message snapshot in localStorage
      localStorage.setItem('revo_last_message', JSON.stringify({...data, time:new Date().toISOString()}));
    });
  }

  // clear button
  if(clearBtn){
    clearBtn.addEventListener('click', function(){
      if(confirm("Clear form?")){
        if(nameInput) nameInput.value = "";
        if(dobInput) dobInput.value = "";
        if(messageInput) messageInput.value = "";
        const radios = document.getElementsByName('gender');
        for(let r of radios) r.checked = false;
        // reset preview
        showPreview({name:'-', dob:'-', gender:'-', message:'-'});
        // remove saved name
        localStorage.removeItem('revo_name');
        loadWelcomeName();
      }
    });
  }

  // On page load, if there is last message in localStorage, populate preview
  function loadLastMessage(){
    const raw = localStorage.getItem('revo_last_message');
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      showPreview(data);
    }catch(e){}
  }
  loadLastMessage();

  // If in profile page, we still want to display saved name in hero (script included on both pages)
  loadWelcomeName();

})();
