(function () {
    let originalTitle = document.title;
    let currentTabId = Date.now();
    let isCurrentOnFocus = true;
    let otherIn = false;
  
    const channel = new BroadcastChannel("flatSnippet");
  
    function setOriginalTitle() {
      document.title = originalTitle;
    } 
    
    channel.addEventListener("message", e => {
        
        // Recibo un mensaje de otra. O visible o ha cambiado después de esta,
        // por tanto tienen que tener título original
        if (e.data.status === 'visible' || e.data.status === 'hidden') {
            setOriginalTitle();
        } 

        if (e.data.status === 'visible') {
            otherIn = true;
            localStorage.setItem('onSite', 'in');
            console.log('onsite other FI ' + localStorage.getItem('onSite')); 
        } 
        
        // Recibo mensaje de otra cambia a hidden
        // Espero para ver si otra se ha marcado a activa, y si no, 
        // ésa última que ha emitido el mensaje debe cambiar el título
        if (e.data.status === 'hidden') {
            otherIn = false;
            setTimeout(() => {
                //if (sessionStorage.getItem('onSite')==false) {
                    channel.postMessage({
                    tabId: e.data.tabId, // ID de la que tiene que cambiar title
                    status: 'changeTitle'
                    });
                //}
            }, 200);
        }
      /*
      if (e.data.status === 'changeTitle') {
        // ¿redundante?
        
        setTimeout(() => {
          // Si no estoy en focus y corresponde con la pestaña que tiene
          // que cambiar el title sigún el mensaje
            console.log(localStorage.getItem('onSite'));
            if (!isCurrentOnFocus 
                && localStorage.getItem('onSite')==='out'
                && e.data.tabId === currentTabId
            ){
                console.log('onsite CT ' + localStorage.getItem('onSite'));
                document.title = "Te echamos de menos...";
            }
        }, 200);
      }*/
    });
  
    
    function handleFocus() {
      isCurrentOnFocus = true;
      setTimeout(() => {
        localStorage.setItem('onSite', 'in');
        console.log('onsite current FO ' + localStorage.getItem('onSite'));
        setOriginalTitle();
        channel.postMessage({
            tabId: currentTabId,
            status: document.visibilityState
        });
        }, 300);
    }
    
    function handleBlur() {
      isCurrentOnFocus = false;
      // Check the URL of the newly focused window/tab
      //localStorage.setItem('onSite', 'out');
      console.log('onsite BL ' + localStorage.getItem('onSite'));
    }
  
    function handleChange() {
      if (document.visibilityState === 'hidden') {
        //setTimeout(() => {
            localStorage.setItem('onSite', 'out');
        //}, 300);
        console.log('onsite CH HID ' + localStorage.getItem('onSite'));
      }
  
      if (document.visibilityState === 'visible') {
        localStorage.setItem('onSite', 'in');
        console.log('onsite CH VIS ' + localStorage.getItem('onSite'));
      }
  
      channel.postMessage({
        tabId: currentTabId,
        status: document.visibilityState
      });

      if (document.visibilityState === 'hidden') {
        setTimeout(() => {
          if (localStorage.getItem('onSite')==='out' && !otherIn) {
            console.log(localStorage.getItem('onSite') + 'entro cambio');
            document.title = "Te echamos de menos...";
          }
        }, 100);
      }
    }
  
    document.addEventListener("focus", handleFocus);
    document.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleChange);
  })();