(function () {
    const originalTitle = document.title;
    let currentTabId = Date.now();
    let isCurrentOnFocus = true;
    let otherIn = false;
  
    const channel = new BroadcastChannel("flatSnippet");
  
    function setOriginalTitle() {
      document.title = originalTitle;
    } 
    
    channel.addEventListener("message", e => {
        
        setOriginalTitle();

        if (e.data.status === 'visible') {
            otherIn = true;
            localStorage.setItem('onSite', 'in');
        } 
        
        if (e.data.status === 'hidden') {
            otherIn = false;
        }
    });
  
    function handleFocus() {
      isCurrentOnFocus = true;
      setTimeout(() => {
        localStorage.setItem('onSite', 'in');
        setOriginalTitle();
        channel.postMessage({
            tabId: currentTabId,
            status: document.visibilityState
        });
        }, 100);
    }
    
    function handleBlur() {
      isCurrentOnFocus = false;
    }
  
    function handleChange() {
        if (document.visibilityState === 'hidden') {
            localStorage.setItem('onSite', 'out');
        }

        if (document.visibilityState === 'visible') {
            localStorage.setItem('onSite', 'in');
        }

        channel.postMessage({
            tabId: currentTabId,
            status: document.visibilityState
        });

        if (document.visibilityState === 'hidden') {
            setTimeout(() => {
                if (localStorage.getItem('onSite')==='out' && !otherIn) {
                    document.title = "Te echamos de menos...";
                }
            }, 50);
        }
    }
  
    document.addEventListener("focus", handleFocus);
    document.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleChange);
  })();