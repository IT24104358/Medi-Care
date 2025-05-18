document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const commentInput = document.getElementById('comment');
    const ratingInput = document.getElementById('rating');
    const listContainer = document.getElementById('list');

    async function loadFeedbacks() {
        const res = await fetch('/api/feedbacks');
        const feedbacks = await res.json();

        listContainer.innerHTML = feedbacks.length === 0
            ? '<p>No feedbacks yet.</p>'
            : feedbacks.map(fb => `
                <div class="card">
                    <p><strong>Comment:</strong> ${fb.comment}</p>
                    <p><strong>Rating:</strong> ${fb.rating}/5</p>
                    <button onclick="deleteFeedback(${fb.id})">Delete</button>
                </div>
            `).join('');
    }

    window.deleteFeedback = async (id) => {
        await fetch(`/api/feedbacks/${id}`, { method: 'DELETE' });
        alert('Deleted!');
        loadFeedbacks();
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const feedback = {
                comment: commentInput.value,
                rating: ratingInput.value
            };

            await fetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback)
            });

            alert('Feedback submitted!');
            form.reset();
            loadFeedbacks();
        });
    }

    if (listContainer) loadFeedbacks();
});