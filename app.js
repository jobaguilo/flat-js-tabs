(function () {
    let originalTitle = document.title;
    let currentTabId = Date.now();
    if (localStorage.getItem("flatTabs")) {

    }
    localStorage.setItem('flatTabs', JSON.stringify({

        }
    ));
  
    function setOnSite() {
      localStorage.setItem('onsite', JSON.stringify({
        status: status,
        timestamp: Date.now()
      }));
    }
  
    function getSharedStatus() {
      const stored = localStorage.getItem('tabStatus');
      return stored ? JSON.parse(stored) : null;
    }
  
    document.onfocus = function () {
      isCurrentOnFocus = true;
    };
  
    const channel = new BroadcastChannel("localhost-channel");
  
    function setOriginalTitle() {
      document.title = originalTitle;
    }
  
    channel.addEventListener("message", e => {
      if (e.data.status === 'visible' || e.data.status === 'hidden') {
        setOriginalTitle();
      }
  
      if (e.data.status === 'hidden') {
        channel.postMessage({
          tabId: currentTabId,
          status: 'changeTitle'
        });
      }
  
      if (e.data.status === 'setOriginal') {
        setOriginalTitle();
      }
  
      if (e.data.status === 'changeTitle') {
        channel.postMessage({
          tabId: currentTabId,
          status: 'setOriginal',
        });
        setTimeout(() => {
          if (!isCurrentOnFocus && getSharedStatus().status === 'offsite') {
            document.title = "Te echamos de menos...";
          }
        }, 200);
      }
    });
  
    function handleFocus() {
      isCurrentOnFocus = true;
      sessionStorage.setItem('lastTab', currentTabId);
      setOriginalTitle();
      channel.postMessage({
        tabId: currentTabId,
        status: 'focus'
      });
    }
  
    function handleBlur() {
      isCurrentOnFocus = false;
      channel.postMessage({
        tabId: currentTabId,
        status: 'blur'
      });
    }
  
    function handleChange() {
      if (document.visibilityState === 'hidden') {
        // Delay execution to ensure user has truly left
        setTimeout(() => {
          if (!document.hasFocus() && location.hostname === lastKnownSite) {
            // Still on the same domain, don't change title
            setSharedStatus('onsite');
          } else {
            // User moved to another domain
            setSharedStatus('offsite');
          }
        }, 500);
      }
  
      if (document.visibilityState === 'visible') {
        setSharedStatus('onsite');
      }
  
      channel.postMessage({
        tabId: currentTabId,
        status: document.visibilityState
      });
    }
  
    document.addEventListener("focus", handleFocus);
    document.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleChange);
  
    // Periodically check if user is still on site
    setInterval(() => {
      if (!document.hasFocus() && document.visibilityState === 'hidden') {
        setSharedStatus('offsite');
      }
    }, 1000);
  })();