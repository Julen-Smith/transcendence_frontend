import { threeRoot, gameRoot, visibilityController } from './values.js';


export async function fetchPlayerInfo(user_id) {
    return fetch(`https://trascendence.tech:4242/api/user_profile/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(async data => {
        return fetch(`https://trascendence.tech:4242/api/get_profile_photo/${user_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(photoResponse => {
            if (!photoResponse.ok) {
                throw new Error(`HTTP error! status: ${photoResponse.status}`);
            }
            return photoResponse.blob();
        })
        .then(photoBlob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: data.id,
                        username: data.username,
                        level: data.level || 5,
                        score: data.score,
                        photo: reader.result || '../preview.gif'
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(photoBlob);
            });
        });
    })
    .catch(error => {
        console.log('Error fetching player info:', error);
        throw error;
    });
}


