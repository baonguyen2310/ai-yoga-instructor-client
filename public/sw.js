self.addEventListener("push", function(event) {
    const data = event.data.json();
    self.registration.showNotification(
        data.title,
        {
            body: data.body,
            icon: "./logo192.png"
        }
    )
})

self.addEventListener('notificationclick', function(event) {
    let url = 'https://localhost:3000';
    event.notification.close(); // Android needs explicit close.
    clients.openWindow(url);
});