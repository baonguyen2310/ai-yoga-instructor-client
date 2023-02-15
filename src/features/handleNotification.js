import { HOST } from "../App";

const handleNotification = (e, ref) => {
    let swRegistration = null;
    if ("serviceWorker" in navigator && "PushManager" in window) {
        console.log("Service Worker and Push is supported");

        //Register the service worker
        navigator.serviceWorker
            .register("./sw.js")
            .then(swReg => {
                console.log("Service Worker is registered", swReg);
                swRegistration = swReg;
                displayNotification(swRegistration);
                subscribeToServer(swRegistration);
            })
            .catch(error => {
                console.error("Service Worker Error", error);
            });
    } else {
        console.warn("Push messaging is not supported");
    }
}

function displayNotification(swRegistration) {
    if (window.Notification && Notification.permission === "granted") {
        notification(swRegistration);
    }
    // If the user hasn't told if he wants to be notified or not
    // Note: because of Chrome, we are not sure the permission property
    // is set, therefore it's unsafe to check for the "default" value.
    else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(status => {
            if (status === "granted") {
                notification(swRegistration);
            } else {
                alert("You denied or dismissed permissions to notifications.");
            }
        });
    } else {
        // If the user refuses to get notified
        alert(
            "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
        );
    }
}

function notification(swRegistration) {
    const options = {
        body: "Testing Our Notification"
    };
    console.log(swRegistration);
    swRegistration.showNotification("PWA Notification!", options);
}

/*ĐĂNG KÝ LÊN SERVER */
//pushManager
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const publicVapidKey = "BI24EwR2Szl4WpdADtmzlVsr-P_au4B_k5wJQzxDQ6KFsd_3PqKcWqFQ5RL6XZEakaAmyoEx7qqhyW1f5b7jYlA";

async function subscribeToServer(swRegistration) {
    const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    await fetch(`${HOST}/subscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
}


export { handleNotification }