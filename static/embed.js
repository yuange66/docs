(function () {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const button = document.createElement('div');
    const iframe = document.createElement('iframe');

    let isMinMode = true;

    function initUI() {
        Object.assign(button.style, {
            overflow: "hidden",
            position: "fixed",
            userSelect: "none",
            right: "20px",
            bottom: "40px",
            zIndex: "9999",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
        });

        iframe.src = "https://knowledge.rentsoft.cn/open-kf-chatbot";
        Object.assign(iframe.style, {
            position: "fixed",
            zIndex: "10000",
            borderRadius: "10px",
            boxShadow: "0px 10px 30px rgba(150, 150, 150, 0.2), 0px 0px 0px 1px rgba(150, 150, 150, 0.2)",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform: "scale(0)",
            transformOrigin: "right bottom",
            opacity: 0,
        });

        document.body.appendChild(iframe);

        adjustIframeStyleForSmallScreens();
    }

    const fireToIframe = (event, data) => {
        iframe.contentWindow.postMessage({ event, data }, '*');
    };

    button.onclick = function () {
        const isMinWidth = window.matchMedia("(max-width: 768px)").matches || isMobile;
        const isHidden = iframe.style.transform === "scale(0)";
        
        if (isHidden) {
            fireToIframe('openIframe', isMinWidth);
            iframe.style.transform = "scale(1)";
            iframe.style.opacity = 1;
        } else {
            iframe.style.transform = "scale(0)";
            iframe.style.opacity = 0;
        }
        if (isMinWidth && isHidden) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    };

    window.addEventListener('message', function (event) {
        if (event.data.event === 'closeIframe') {
            iframe.style.transform = "scale(0)";
            iframe.style.opacity = 0;
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        if (event.data.event === 'toogleSize') {
            iframe.style.width = isMinMode ? "720px" : "420px";
            iframe.style.height = isMinMode ? "80vh" : "60vh";
            isMinMode = !isMinMode;
        }
        if (event.data.event === 'getConfig') {
            if(event.data.data){
                button.innerHTML = `<img src="${event.data.data}" style="width: 50px; height: 50px;"/>`
            }else {
                button.innerHTML = "Ask";
                button.style.color = "white";
                button.style.backgroundColor = "#2160fd";
            }
            document.body.appendChild(button);
        }
    });

    window.onload = initUI;

    function adjustIframeStyleForSmallScreens() {
        const isMinWidth = window.matchMedia("(max-width: 768px)").matches || isMobile;
        if (isMinWidth) {
            Object.assign(iframe.style, {
                width: "100%",
                height: "100%",
                right: "0",
                bottom: "0",
                left: "0",
                top: "0",
                borderRadius: "0",
                boxShadow: "none",
            });
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            fireToIframe('resizeIframe', true);
        } else {
            Object.assign(iframe.style, {
                width: isMinMode ? "420px" : "720px",
                height: isMinMode ? "60vh" : "80vh",
                right: "20px",
                bottom: "100px",
                left: "unset",
                top: "unset",
                borderRadius: "10px",
                boxShadow: "0px 10px 30px rgba(150, 150, 150, 0.2), 0px 0px 0px 1px rgba(150, 150, 150, 0.2)",
            });
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            fireToIframe('resizeIframe', false);
        }
    }    

    window.addEventListener('resize', adjustIframeStyleForSmallScreens);
})();
